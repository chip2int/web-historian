// eventually, you'll have some code here that uses the tested helpers 
// to actually download the urls you want to download.
var helpers = require("./lib/html-fetcher-helpers");
var path = require('path');
var sitesFile = path.join(__dirname, "../data/sites.txt"); 
var sitesDir = path.join(__dirname, "../data/sites");


var readUrlFile = function () {
  urlArray = [];
  helpers.readUrls(sitesFile, function(result) {
    urlArray = result.slice();
  });
  return urlArray;
};



var downloadUrls = function() {
  console.log("IN urls");
  urlArray = readUrlFile();
  helpers.downloadUrls(urlArray, sitesDir);  

};

downloadUrls(); 
