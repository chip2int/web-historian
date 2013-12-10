var fs = require("fs");
var http = require("http");

exports.readUrls = function(filePath, cb){
  var fileContents = fs.readFileSync(filePath, 'utf8');
  cb(fileContents.split("\n"));
};

exports.downloadUrls = function(urls, location){


  var appendCB = function(err) {
    if (err) throw err;
  };

  var resCB = function (res) {
    
    var data = "";
    var fileName = res.req._headers.host;

    //console.log("Got response: ",res.req._headers.host);
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers.domain));
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      data += chunk;
    });

    res.on('end', function() {
      console.log('In end');  
      fs.writeFileSync(location+"/"+fileName, data);
      //fs.appendFileSync("./testing.txt", "\n------Next File-----\n");
    });

  };


  var errCB = function(e) {
    console.log("Got error: " + e.message);
  };
  
  for (var i = 0;  i < urls.length; i++) {
    url = urls[i];
    console.log("URL", url);
    http.get(url, resCB).on('error', errCB);
    console.log('before or after "GOT RESPONSE"????')
    // console.log('returned request', request)
  };

  return true;
};
