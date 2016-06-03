var data = require('./data/fb_checkin_daily.json');
var fs = require('fs');
var output = [];
var log = {}
console.log(data.length);
data.forEach(function(d) {
  if(log.hasOwnProperty(d.id)) {
    return;
  }
  output.push(d);
  log[d.id] = true;
});


outputFilename = './data/checkin_daily.json';
console.log(output.length);
fs.writeFile(outputFilename, JSON.stringify(output, null, 2), function(err) {
   process.exit(0);
});
