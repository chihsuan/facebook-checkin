var request = require('request');

var data = require('./data/fb_checkin_daily.json');
var opt = {
  url: 'http://127.0.0.1:8000/checkin/create/',
  method: 'POST',
  json: data
};

data.forEach(function(d) {
  if (d.visit.length > 0) {
    d.visit = d.visit[d.visit.length-1];
    d.like = d.like[d.like.length-1];
    d.visit.date = new Date(d.visit.date).toLocaleDateString();
    d.like.date = new Date(d.like.date).toLocaleDateString();
  }
  else {
    d.visit = '';
    d.like = '';
  }
});

request(opt, function (error, response, body) {
  if (error)
    console.log(error);
  else if (response.statusCode == 200)
    console.log('200 ok');
  else
    console.log(response.statusCode);
});
