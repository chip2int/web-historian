var path = require('path');
var fs = require('fs');
var url = require('url');
var http = require('http');
var helper = require('./http-helpers');
var fetcher = require('../workers/htmlfetcher');

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
      startInd = data.indexOf("=");
      endInd   = data.indexOf("&");
      data = data.substring(startInd+1, endInd); 
      data = url.parse(data).pathname;
      res.writeHead(statusCode, headers);
      result +=data;
    });

    req.addListener('end', function() {
      var found = false;
      var rArray = fetcher.readUrlFile();
      for (var i = 0; i < rArray.length; i++) {
        if (rArray[i] === result) {
           found = true;
           break;
        }
      }
      if (found) {
        helper.serveStaticAssets(res, found, result);
      }
      else {
        helper.serveStaticAssets(res, found, result);
        fs.appendFileSync(module.exports.datadir, result+"\n");
      }
      res.end('');
    });
  },

  'GET': function(req, res){

    var fileContents = fs.readFileSync(module.exports.datadir, 'utf8');
    var newUrl = req.url.slice(2);
    var startInd = newUrl.indexOf("=");
    var endInd   = newUrl.indexOf("&");
    newUrl = newUrl.substring(startInd+1, endInd);
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
  req.setEncoding('utf8');
  actionListener[req.method](req, res);

};
