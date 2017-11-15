var log = function(text) {
    $('#message').text(text.substring(0, 40));
    console.log(text);
};


$(document).ready(function() {
  log('Ready');

  const datasets = [];

  var chart = new Chart($('#myChart'), {
    type: 'line',
    data: {
      datasets: datasets
    },
    options: {
      scales: {
        xAxes: [{
          type: "time",
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Ränta'
          }
        }]
      }
    }
  });
  function scrapeYear(year) {
    $.getJSON('/scrape/' + year, null, function (data) {
      log('Received ' + data.length + ' elements');

      if (data.length > 0) {
        data.shift();
        // remove labels
      }
      var chartData = data.map(function (entry) {
        return {
          x: new Date(entry.date),
          y: (entry.rate).replace(',', '.')
        };
      }).sort((e1, e2) => e1.x.getTime() - e2.x.getTime());

      datasets.push({
        label: year,
        data: chartData
      });
      chart.update();
    });
  }

  for (var year = 2004 ; year <= moment().year() ; year++) {
    scrapeYear(year);
  }
});
