var request = require('request');
var fs = require('fs');

var API = 'https://api.foursquare.com/v2/venues/search?oauth_token=EACTJOEC3DFI4G4FHBQILJ1WVA1ZASBOIE4E5SKCO04ACVBC&v=20160526&limit=50&radius=10000&ll=23.0001878,120.1910196';

var outputFilename = 'poi.json';

var data = require('./poi.json');
var ids = require('./ids.json');

request(API, function (error, response, body) {
  var venues = JSON.parse(body).response.venues;
  venues.forEach(function(v) {
    if(!ids.hasOwnProperty(v.id)) {
      //console.log(v.name, v);
      ids[v.id] = true;
      data.push(v);
    }
  });
  console.log(data.length);
  fs.writeFile(outputFilename, JSON.stringify(data, null, 2), function(err) {
    fs.writeFile('./ids.json', JSON.stringify(ids, null, 2), function(err) {
      process.exit(0);
    });
  });
});
