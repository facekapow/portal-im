'use strict';

var http = require('http');
var MiniRoute = require('../'); // replace with "mini-route"

var server = http.createServer();
var router = new MiniRoute(server);

router.get('/', function(req, res) {
  res.end('Hello, world!');
});

server.listen(8080, function() {
  console.log('listening on :8080...');
});
