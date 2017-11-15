var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var data = [], latestRun;

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.get('/scrape', function(req, res){

  const url = 'https://www.riksgalden.se/sv/omriksgalden/statsskulden/statslanerantan/';

  function sendData() {
    res.send(JSON.stringify(data, null, 2));
  }

  if (!latestRun || latestRun.getTime() < new Date().getTime() - 10 * 1000) {
    console.log('Running query');
    data = [];
    request(url, function(error, response, html){
      if(!error){
        var $ = cheerio.load(html);

        $('tr').filter(function(){
          var row = $(this);

          data.push({
            date: row.children().first().text(),
            rate: row.children().first().next().text()
          });
        });
      }

      latestRun = new Date();
      sendData();
    });
  } else {
    console.log('Sending cached data');
    sendData();
  }
});


const port = process.env.PORT || '8081';
app.listen(port);
console.log('Magic happens on port', port);
exports = module.exports = app;