# mini-file
mini-route static file handler extension.

Example:
```javascript
var http = require('http');
var MiniRoute = require('mini-route');
var miniFile = require('mini-file');

var server = http.createServer();
var router = new MiniRoute(server);

miniFile(router, __dirname + '/public');

miniFile(router, __dirname + '/bower_components', '/support/'); // don't forget the extra slash at the end
// the above serves the 'bower_components' folder on '/support/'

server.listen(8080);
```

This can also be used with Express:
```javascript
var miniFile = require('mini-file');
var app = require('express')();

miniFile(app, __dirname + '/public');

app.listen(8080);
```
