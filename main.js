var Requester = require("./requester.js");

var args = process.argv.slice(2);

if(args.length < 1) {
  console.log("Usage: node main.js <filename>");
  return;
}

var filename = args[0];

Requester.parseSitemapFile(filename, function (list) {
  var url;

  for(var i=0; i<list.length; i++) {
      url = list[i].loc[0];
      Requester.requestUrl(url);
  }
});
