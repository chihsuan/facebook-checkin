var system = require('system');
var async = require("async");
var fs = require('fs');
var args = system.args;

var date = new Date().toLocaleString();
var DATA_INPUT = './data/fb_checkin_daily.json';
var LOOK_UP = './lookups/checkin_lookup_daily_' + date + '.json';

var data = require(DATA_INPUT);

var lookup = {};
if(fileExists(LOOK_UP)) {
  lookup = require(LOOK_UP);
}
var places = require('./data/fb_checkin.json');
var count = 0;
var NUMVER_TO_WRITE = 5;
var maxCount = 2000;

//places = places.reverse();
//places = places.slice(3280);

var q = async.queue(function (p, done) {

  var pageUrl = 'https://www.facebook.com/pages/'+p.name+'/'+p.id;
  //var pageUrl = p.pageUrl;

  // Manual input
  if (lookup.hasOwnProperty(p.name) && lookup[p.name] === false) {
    system.stdout.writeLine('PageUrl：' + pageUrl);
    system.stdout.writeLine('Your input：');
    pageUrl = system.stdin.readLine();
  }

  var page = require('webpage').create();
  pageUrl = encodeURI(pageUrl);
  console.log(p.name, pageUrl);
  page.open(pageUrl, function(status) {
    count += 1;
    console.log(status);
    if(status === "success") {
      console.log(page.content.indexOf('讚'), count);
      if (page.content.indexOf('讚') < 0 && page.content.indexOf('訪') < 0) {
        lookup[p.name] = false;
        page.close();
        done();
        return;
      }

      page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
        var d = page.evaluate(function() {

          var tr = $('._1zuq').text();
          var arr = tr.split('讚');

          var page = {},
            like,
            visit;

          if ((tr.indexOf('讚') || tr.indexOf('人次')) && arr && arr.length > 0) {
            if (tr.indexOf('讚') >= 0) {
              like = arr[0].replace('個', '').replace(/[, ]/g, '');
              visit = arr[1].replace('人次造訪', '').replace(/[, ]/g, '');
            }
            else if (tr.indexOf('人次') >= 0) {
              like = 0;
              visit = arr[0].replace('人次造訪', '').replace(/[, ]/g, '');
            }
          }
          else {
            /*arr = $('._50f5').text().split('讚');
            if (!arr || arr.length < 1) {
              return page;
            }*/
            arr = ['', document.querySelectorAll('._52id')[1].innerHTML];
            like = $('#PagesLikesCountDOMID').text().replace(',', '').replace(/[, ]/g, '');
            visit = arr[1].replace(',', '').replace('人次造訪', '').replace(/[, ]/g, '');
          }
          page = {
            like: parseInt(like),
            visit: parseInt(visit)
          };

          return page;
        });

        if (!d || (!d.like && !d.visit)) {
          console.log('--->' + d);
          lookup[p.name] = false;
          page.close();
          done();
          return;
        }

        if (!d.like)
          d.like = 0;
        if (!d.visit)
          d.visit = 0;

        console.log('按讚數：' + d.like, '造訪人數：'+d.visit);
        if (p.like && p.like.constructor !== Array) {
          p.like = [];
          p.visit = [];
        }

        p.like.push({
          value: d.like,
          date: date
        });

        p.visit.push({
          value: d.visit,
          date: date
        });

        p.pageUrl = pageUrl;
        data.push(p);
        lookup[p.name] = true;

        if (count % NUMVER_TO_WRITE === 0 || count >= max_count) {
          fs.write(DATA_INPUT, JSON.stringify(data, null, 2), 'w');
          fs.write(LOOK_UP, JSON.stringify(lookup, null, 2), 'w');
        }

        if (count >= max_count) {
          phantom.exit();
        }
        page.close();
        done();
      });
    }
    else {
      lookup[p.name] = false;
      page.close();
      done();
    }
  });
});

var g = false;
var input_number = 0;
data.forEach(function(p) {
  if ((lookup.hasOwnProperty(p.name) && lookup[p.name] !== false) || p.visit < 10000 ||
    p.location.latitude > 23.28 || p.location.latitude < 22.822) {
    return;
  }
  q.push(p);
  input_number += 1;
});
maxCount = input_number;

function fileExists(filePath)
{
    try
    {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
        return false;
    }
}
