var data = require('./data/fb_checkin_daily.json');
var fs = require('fs');
var output = [];
data.forEach(function(d) {
  if(d.visit.length < 2)
    return

  var len = d.visit.length;
  var diff = d.visit[len-1].value - d.visit[len-2].value;
  if (diff > 0 && diff < 5000) {
    output.push({
      visit: diff,
      longitude: d.location.longitude,
      latitude: d.location.latitude,
      name: d.name,
      date: d.visit[len-1].date
    });
  }
  else {
    console.log('-->', d.name, diff)
  }
});

output.sort(function(a, b) {
  return a.visit - b.visit;
});
output.forEach(function(d) {
  console.log(d.name, d.visit);
});

outputFilename = './data/simplify_checkin_daily.json';
console.log(output.length);
fs.writeFile(outputFilename, JSON.stringify(output, null, 2), function(err) {
   process.exit(0);
});
