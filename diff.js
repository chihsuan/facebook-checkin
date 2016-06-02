var data = require('./fb_checkin_daily.json');
var fs = require('fs');
var output = [];
data.forEach(function(d) {
  if(d.visit.length < 2)
    return
  var diff = d.visit[1].value - d.visit[0].value;
  if (diff > 0 && diff < 1000) {
    console.log(diff, d.visit[1].value, d.visit[0].value, d.name);
    output.push({
      visit: diff,
      longitude: d.location.longitude,
      latitude: d.location.latitude
    });
  }
});
outputFilename = './simplify_checkin_daily.json';
console.log(output.length);
fs.writeFile(outputFilename, JSON.stringify(output, null, 2), function(err) {
   process.exit(0);
});
