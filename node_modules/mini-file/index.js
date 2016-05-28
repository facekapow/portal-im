'use strict';

var fs = require('fs');
var path = require('path');
var mime = require('mime');
var miniCompress = require('mini-compress');

module.exports = function(router, folder, basePath) {
  basePath = basePath || '/';
  // read directory synchronously and recursively
  function readDirectory(dir, serverPath) {
    var cont = fs.readdirSync(dir);
    var files = [];
    files.push({
      virt: serverPath,
      real: dir
    });
    for (var i = 0; i < cont.length; i++) {
      var stats = fs.statSync(path.join(dir, cont[i]));
      if (cont[i].substr(0, 1) !== '.') {
        if (!stats.isDirectory()) {
          files.push({
            virt: serverPath + cont[i],
            real: dir + '/' + cont[i]
          });
        } else {
          var retFiles = readDirectory(path.join(dir, cont[i]), serverPath + cont[i] + '/');
          files = files.concat(retFiles);
        }
      }
    }
    return files;
  }

  var files = readDirectory(folder, basePath);

  for (var i = 0; i < files.length; i++) {
    (function(i) {
      var file = files[i];
      router.get(file.virt, function(req, res) {
        var getFile = file;

        if (file.virt.substr(file.length-1) === '/') {
          getFile = {
            virt: file.virt + '/index.html',
            real: file.real + '/index.html'
          };
        }

        fs.readFile(getFile.real, function(err, data) {
          if (err) {
            console.log(getFile.real);
            res.statusCode = 500;
            return res.end('500 internal server error.');
          }

          miniCompress(req, data, function(err, compressed, encoding) {
            if (err) {
              res.statusCode = 500;
              return res.end('500 internal server error.');
            }

            var headers = {
              'content-type': mime.lookup(getFile.real)
            };

            if (encoding) {
              headers['content-encoding'] = encoding;
            }

            res.writeHead(200, headers);

            res.end(compressed);
          });
        });
      });
    })(i);
  }
}
