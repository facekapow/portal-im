'use strict';

var url = require('url');

function MiniRoute(server, opts) {
  var self = this;

  this._routes = {};

  var methods = [
    'checkout',
    'connect',
    'copy',
    'delete',
    'get',
    'head',
    'lock',
    'merge',
    'mkactivity',
    'mkcol',
    'move',
    'm-search',
    'notify',
    'options',
    'patch',
    'post',
    'propfind',
    'proppatch',
    'purge',
    'put',
    'report',
    'search',
    'subscribe',
    'trace',
    'unlock',
    'unsubscribe'
  ];

  for (var i = 0; i < methods.length; i++) {
    (function(i) {
      self._routes[methods[i]] = {};
      self[methods[i]] = function(path, handler) {
        if (!self._routes[methods[i]][path]) {
          self._routes[methods[i]][path] = [];
        }
        self._routes[methods[i]][path].push(handler);
      }
    })(i);
  }

  this.remove = function(method, path, cb) {
    if (!self._routes[method][path]) {
      if (cb) cb(new Error('no such route.'));
      return;
    }
    self._routes[method][path] = null;
    cb(null);
  };

  server.on('request', function(req, res) {
    var method = req.method.toLowerCase();
    var path = url.parse(req.url).pathname;
    if (self._routes[method][path]) {
      for (var i = 0; i < self._routes[method][path].length; i++) {
        self._routes[method][path][i](req, res);
      }
    }
    if (opts && opts.notFound && opts.notFound === true) {
      if (!self._routes[method][path]) {
        res.statusCode = 404;
        res.end('404 not found.');
      }
    }
  });
}

module.exports = MiniRoute;
