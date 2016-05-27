var fs = require('fs');
var args = process.argv;
var path = args[2];
var data = require(path);


var s = [];
data.forEach(function(d) {
  s.push({
    latitude: d.location.latitude,
    longitude: d.location.longitude,
    visit: d.visit
  });
});

outputFilename = './simplify_checkin.json';
fs.writeFile(outputFilename, JSON.stringify(s, null, 2), function(err) {
  process.exit(0);
});
