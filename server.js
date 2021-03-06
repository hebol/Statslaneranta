var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var moment  = require('moment');
var app     = express();

var data = {};

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.get('/scrape/:year', function(req, res){

  const year = req.params.year;
  const url = 'https://www.riksgalden.se/sv/omriksgalden/statsskulden/statslanerantan/?year=' + year;

  function sendData() {
    const value = data[year].data;
    //console.log('Will send data', value, 'for', year);
    res.send(JSON.stringify(value, null, 2));
  }

  if (!data.hasOwnProperty(year) || data[year].latestRun.getTime() < new Date().getTime() - 3600 * 1000) {
    console.log('Running query', year);
    var dataResponse = [];
    request(url, function(error, response, html) {
      if(!error){
        var $ = cheerio.load(html);

        $('tr').filter(function(){
          var row = $(this);

          dataResponse.push({
            date: row.children().first().text(),
            rate: row.children().first().next().text()
          });
        });
      } else {
        console.log('Error retrieving year', year, error);
      }

      data[year] = {
        data: dataResponse,
        latestRun: new Date()
      };
      //console.log('Data is now', data, 'when adding', dataResponse, 'for', year);
      sendData();
    });
  } else {
    console.log('Sending cached data', year);
    sendData();
  }
});


const port = process.env.PORT || '8081';
app.listen(port);
console.log('Magic happens on port', port);
exports = module.exports = app;