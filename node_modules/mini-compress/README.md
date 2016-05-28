# mini-compress
mini-route file compression handler.

Example:
```javascript
var http = require('http');
var MiniRoute = require('mini-route');
var miniCompress = require('mini-compress');

var server = http.createServer();
var router = new MiniRoute(server);

router.get('/', function(req, res) {
  miniCompress(req, 'some data to compress', function(err, compressed) {
    res.end(compressed);
  });
});

server.listen(8080);
```

This can also be used with Express:
```javascript
var miniFile = require('mini-file');
var app = require('express')();

app.get('/', function(req, res) {
  miniCompress(req, 'some data to compress', function(err, compressed) {
    res.end(compressed);
  });
});

app.listen(8080);
```
