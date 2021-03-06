var fs    = require('fs'),
  xml2js  = require('xml2js'),
  request = require('request');

/**
 * Patches stupid memory leak warning, possible to be fixed in near node version
 * source: https://github.com/chriso/node.io/issues/96
 */
var EventEmitter = require('events').EventEmitter
  , on = EventEmitter.prototype.on;
EventEmitter.prototype.on = function () {
    this._maxListeners = Infinity;
    on.apply(this, arguments);
};

var parser = new xml2js.Parser();

var Requester = {
  /**
   * Parses a sitemap file
   */
  parseSitemapFile : function (filename, callback) {
    fs.readFile(filename, function(err, data) {

      parser.parseString(data, function (err, result) {
        if(err) {
            console.log("An error occurred while parsing sitemap file");
            return;
        }
        callback(result.urlset.url);
      });

    });
  },
  /**
   * Performs a request to a given url as a google user agent
   */
  requestUrl : function(url) {

    var options = {
      url: url,
      headers: {
        'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)'
      }
    };

    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(options.url, ":", response.statusCode);
      } else {
        console.log("REQUEST ERROR: ", response);
      }
    });
  }
};


module.exports = Requester;
