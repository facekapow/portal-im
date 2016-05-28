#!/usr/bin/env node

'use strict';

const MiniRoute = require('mini-route');
const miniFile = require('mini-file');
const http = require('http');
const socketIo = require('socket.io');
const PowerObject = require('power-object');
const clean = require('./shared-script/clean');
const EventEmitter = require('events');
const port = process.env.PORT || 80;

module.exports.events = new EventEmitter();

const server = http.createServer();
server.on('close', () => {
  console.log('server shutdown.');
  module.exports.events.emit('close');
});
const router = new MiniRoute(server, {
  notFound: true
});
const io = socketIo(server);
let users = new PowerObject(); // portal: username
let portals = new PowerObject(); // username: portal
let latestMessages = [];
const adminToken = new Buffer(String(Date.now())).toString('base64').substr(-7).replace(/(=)*$/, ''); // generate admin auth token

const addMessage = (user, msg) => {
  if (latestMessages.length > 60) latestMessages.unshift();
  latestMessages.push({
    username: user,
    msg: msg
  });
}

miniFile(router, `${__dirname}/public`);
miniFile(router, `${__dirname}/bower_components`, '/deps/');
miniFile(router, `${__dirname}/shared-script`, '/shared/');

const commands = {
  'CLEAR-CHAT': [
    (portal) => {
      io.emit('clearChat');
      latestMessages = [];
      portal.emit('ADMIN--RESPONSE', true);
    },
    'Clears the chat'
  ],
  'SEVER-CONNECTIONS': [
    (portal) => {
      io.emit('severConnections');
      users = new PowerObject();
      portals = new PowerObject();
      portal.emit('ADMIN--RESPONSE', true);
    },
    'Disconnects (severs) all active connections'
  ],
  'LIST-CONNECTIONS': [
    (portal) => {
      let str = '';
      for (let username of portals.keys()) str += `${username} - ${portals.get(username).request.connection.remoteAddress}\n`;
      if (str === '') str = 'no active connections.';
      portal.emit('ADMIN--INFO', str.trim());
      portal.emit('ADMIN--RESPONSE', true);
    },
    'Lists all active connections in the form of \'username: socket id\''
  ],
  'SHUTDOWN-SERVER': [
    (portal) => {
      portal.emit('ADMIN--INFO', 'shutting down sever...');
      portal.emit('ADMIN--RESPONSE', true);
      portal.disconnect();
      io.emit('severConnections');
      users = new PowerObject;
      portals = new PowerObject();
      latestMessages = [];
      server.close();
    },
    'Disconnects (severs) all connections and shuts down the server.'
  ]
}

io.on('connection', (portal) => {
  portal.on('requestUsername', (username) => {
    if (!(/[a-zA-Z0-9-_\.]+/.test(username))) return portal.emit('respondUsername', false, 'Invalid username');
    if (portals.get(username)) return portal.emit('respondUsername', false, 'Username is taken');
    portal.emit('respondUsername', true);
    users.set(portal, username);
    portals.set(username, portal);
  });
  portal.on('requestLatestMessages', () => portal.emit('respondLatestMessages', latestMessages));
  portal.on('emitMessage', (msg) => {
    msg = clean(msg);
    portal.broadcast.emit('message', users.get(portal), msg);
    addMessage(users.get(portal), msg);
  });
  portal.on('disconnect', () => {
    if (!users.get(portal)) return;
    portals.remove(users.get(portal));
    users.remove(portal);
    module.exports.events.emit('portal-closed');
  });
  portal.on('ADMIN--VERIFY-TOKEN', (token) => io.emit('ADMIN--VERIFIED', token === adminToken));
  portal.on('ADMIN--GET-COMMANDS', (token) => {
    if (token !== adminToken) return portal.emit('ADMIN--RETURN-COMMANDS', null, 'Invalid token.');
    const cmds = {};
    for (let cmd of Object.keys(commands)) {
      cmds[cmd] = commands[cmd][1];
    }
    portal.emit('ADMIN--RETURN-COMMANDS', cmds);
  });
  portal.on('ADMIN--COMMAND', (token, command) => {
    if (token !== adminToken) return portal.emit('ADMIN--RESPONSE', false, 'Invalid token.');
    const cmd = commands[command];
    if (!cmd) return portal.emit('ADMIN--RESPONSE', false, 'Unknown command.');
    cmd[0](portal);
  });
});

server.listen(port, () => {
  console.log(`listening on ::${port}...`);
  console.log(`Chat admin token: ${adminToken}`);
  module.exports.events.emit('listening', adminToken);
});
