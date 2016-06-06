var data = require('./data/fb_checkin.json');

data.sort(function(a, b) {
  return b.visit - a.visit;
})
for (var i = 0; i < 10; ++i ){
  console.log(data[i])
}
