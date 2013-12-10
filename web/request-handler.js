var path = require('path');
var fs = require('fs');



module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  "Content-Type": "application/json"
};


var actionListener = {
  'POST': function (req, res) {
    var statusCode = 302;

    var result = "";
    req.addListener('data', function(data) {
      res.writeHead(statusCode, headers);
      result +=data;
    });

    req.addListener('end', function() {
      fs.writeFileSync(module.exports.datadir, result+"\n");
      res.end(null);
    });


  },

  'GET': function(req, res){

    var fileContents = fs.readFileSync(module.exports.datadir, 'utf8');
    var newUrl = req.url.slice(1);

    if (newUrl.length > 0 && fileContents.search(RegExp(newUrl, 'gi')) === -1) {
      var statusCode = 404;
      res.writeHead(statusCode, headers);
      res.end(null);
    } else {
      var statusCode = 200;
      res.writeHead(statusCode,  headers);

      // var pathname = url.parse(req.url).pathname;
      var pathname = req.url;
      res.end(pathname !== "/"?pathname:'<input></input>');
    }
  },

  'OPTIONS': function(req, res) {

  }
};

module.exports.handleRequest = function (req, res) {
  
  actionListener[req.method](req, res);

};
