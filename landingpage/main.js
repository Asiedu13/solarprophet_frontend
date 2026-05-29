google.charts.load('current', {
  packages:['corechart']
});

google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  const data = google.visualization.arrayToDataTable([
    ['Time', 'Solar Output', { role: 'annotation' }, { role: 'style' }],

    ['', 4, null, null],
    ['', 11, null, null],

    // Peak point
    [
      '',
      16,
      'peak • 12:30',
      'point { size: 6; shape-type: circle; fill-color: #d9470f; }'
    ],

    ['', 7, null, null],
    ['', 0.1, null, null]
  ]);

  const options = {

    // Smooth elegant curve
    curveType: 'function',

    // Remove legend
    legend: 'none',

    // Transparent chart background
    backgroundColor: 'transparent',

    // Main line color
    colors: ['#d9470f'],

    // Area beneath curve
    areaOpacity: 0.30,

    // Thin elegant line
    lineWidth: 3,

    // Hide normal points
    pointSize: 0,

    // Layout
    chartArea: {
      left: 0,
      top: 10,
      width: '100%',
      height: '80%'
    },

    // Horizontal axis
    hAxis: {

      textPosition: 'none',

      baselineColor: 'transparent',

      gridlines: {
        color: 'transparent'
      }
    },

    // Vertical axis
    vAxis: {

      minValue: 0,

      textPosition: 'none',

      baselineColor: 'transparent',

      gridlines: {
        color: 'transparent'
      }
    },

    // Annotation styling
    annotations: {

      stem: {
        color: 'transparent'
      },

      textStyle: {
        fontSize: 10,
        color: '#5c4033',
        bold: false
      }
    }
  };

  const chart = new google.visualization.AreaChart(
    document.getElementById('solar-chart')
  );

  chart.draw(data, options);
}