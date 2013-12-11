var path = require('path');
var fs = require('fs');
var sitesDir = path.join(__dirname, "../data/sites");


headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

module.exports.serveStaticAssets = function(res, folder, asset) {
  //Write some code here that helps serve up your static files!
  //(Static files are things like html (yours or arhived from others...), css, or anything that doesn't change often.)
  res.writeHead(202, headers);
  if (!folder) {
    res.write("<h2>Your request to an archive is not yet available.</h2>");
  }
  else {
    res.write(fs.readFileSync(sitesDir+"/"+asset));
  }
};

// As you go through, keep thinking about what helper functions you can put here!