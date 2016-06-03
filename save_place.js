var request = require('request');

var data = require('./data/fb_checkin.json');
var opt = {
  url: 'http://127.0.0.1:8000/checkin/place/',
  method: 'POST',
  json: data
};

request(opt, function (error, response, body) {
  if (error)
    console.log(error);
  else if (response.statusCode == 200)
    console.log('200 ok');
  else
    console.log(response.statusCode);
});
