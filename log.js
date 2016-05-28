'use strict';

const fs = require('fs');
const http = require('http');

class Log {
  constructor(stream) {
    this._handle = stream;
  }
  error() {
    this._handle.write('ERROR ');
    return this;
  }
  at(path) {
    this._handle.write(`at ${path} `);
    return this;
  }
  code(code) {
    this._handle.write(`with code ${code} `);
    return this;
  }
  desc(desc) {
    this._handle.write(`with description: ${desc}`);
    return this;
  }
  flush() {
    this._handle.write('\n');
    return this;
  }
  denial(msg) {
    this._handle.write('DENIAL ');
    return this;
  }
  info(msg) {
    this._handle.write('INFO ');
    return this;
  }
}

module.exports = (fn) => new Log(fs.createWriteStream(fn, {
  flags: 'a'
}));
