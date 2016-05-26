var request = require('request');
var fs = require('fs');
var async = require("async");

var API = 'https://graph.facebook.com/v2.6/search?type=place&access_token=' + process.argv[2];

var outputFilename = 'fb_place.json';

var count = 0;

var places = require('./tainanPOI.json');
//places = require('./poi.json');

var data = require('./fb_place.json');
var lookup = require('./fb_lookup.json');

var q = async.queue(function (p, done) {
  lookup[p.name] = true;
  //console.log(API+'&center='+p.lat+','+p.lng+'&distance=1000&q='+p.name)
  request(API+'&center='+p.lat+','+p.lng+'&distance=1000&q='+p.name, function (error, response, body) {
    if (error) {
      console.log(error);
    }

    var json = [];
    try {
      json = JSON.parse(body).data;
    }
    catch(e) {
      done();
      return;
    }

    json.forEach(function(j) {
      if (!lookup.hasOwnProperty(j.name)) {
        data.push(j);
        lookup[j.name] = true;
      }
    });

    count += 1;
    console.log(data.length);
    if (count > 50) {
      fs.writeFile(outputFilename, JSON.stringify(data, null, 2), function(err) {
        fs.writeFile('fb_lookup.json', JSON.stringify(lookup, null, 2), function(err) {
            process.exit(0);
            done();
        });
      });
    }
    else {
      done();
    }
  });
});

places.forEach(function(p) {
  if (lookup.hasOwnProperty(p.name) || p.lat > 23.28 || p.lat < 22.822) {
    return;
  }
  q.push(p);
});
