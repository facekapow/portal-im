# mini-route
A little mini-router for Node.

This is a pretty simple, nonintrusive module that handles http (or https) routing.
Example:
```javascript
var http = require('http');
var MiniRoute = require('mini-route');

var server = http.createServer();
var router = new MiniRoute(server);

router.get('/', function(req, res) {
  res.end('Hello, world!');
});

server.listen(8080);
```

This simply attaches itself to the server's `request` event and processes the routes.

## Options
You can also add an options object like so:
```javascript
var router = new MiniRoute(server, {
  // opts
});
```

Available options:
  * notFound <bool> - Should return 404 when the route isn't found?

## Great, but, why not use Express?
Sure, Express is great, but, at times I feel it's too bloated.
Personally, I try to use as little modules as possible, and part of the reason I
do that is because most modules feel like they try to provide a lot more than what
I really need. Express is one of those modules. That's why I made this!
