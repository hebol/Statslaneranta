var log = function(text) {
    $('#message').text(text.substring(0, 40));
    console.log(text);
};


$(document).ready(function() {
  log('Ready');

  $.getJSON('/scrape', null, function(data) {
    log('Received ' + data.length + ' elements');

    if (data.length > 0) {
      data.shift();
      // remove labels
    }
    var chartData = data.map(function(entry) {
      return {
        x: new Date(entry.date),
        y: (entry.rate).replace(',', '.')
      };
    }).sort((e1, e2) => e1.x.getTime() - e2.x.getTime());

    var ctx = $('#myChart');
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: '2017',
          data: chartData
        }]
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
  });
});
