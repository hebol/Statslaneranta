var log = function(text) {
    $('#message').text(text.substring(0, 40));
    console.log(text);
};

var colorIndex = 0;
const colorList = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC'];


$(document).ready(function() {
  const startYear = 2004;
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
        borderColor: colorList[year - startYear],
        data: chartData
      });
      datasets.sort(function(e1,e2){
        return e1.label - e2.label;
      });
      chart.update();
    });
  }

  for (var year = startYear ; year <= moment().year() ; year++) {
    scrapeYear(year);
  }
});
