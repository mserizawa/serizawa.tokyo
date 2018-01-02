var CELL_WIDTH = 10,
    svg = d3.select('.js-lifegame'),
    svgRect = svg.node().getBoundingClientRect(),
    row = Math.floor(svgRect['width'] / CELL_WIDTH) + 1,
    col = Math.floor(svgRect['height'] / CELL_WIDTH) + 1,
    data = [];

// init data
for (var i = 0; i < row * col; i++) {
  var ratio = 4,
      val = Math.floor(Math.random() * ratio) % ratio === 0 ? 1 : 0;
  data.push(val);
}

var cell = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', function(d, i) { return 'translate(' + i % row * CELL_WIDTH + ',' + Math.floor(i / row) * CELL_WIDTH + ')'; });
cell.append('rect')
    .attr('width', CELL_WIDTH)
    .attr('height', CELL_WIDTH)
    .attr('class', function(d) { return d == 0 ? 'dead' : 'live' });

// main loop
setInterval(function() {
  var newData = [];
  for (var i = 0; i < row * col; i++) {
    newData[i] = calcNext(i);
  }
  newData.forEach(function(d, i) { data[i] = d; })
  svg.selectAll('g').data(data);
  svg.selectAll('g').select('rect').attr('class', function(d, i) { return d == 0 ? 'dead' : 'live' });
}, 100);

function calcNext(index) {
  var arounds = [],
      x = index % row,
      y = Math.floor(index / row);
  if (y > 0) {
    arounds.push(data[index - row]);  // n
    if (x > 0) {
      arounds.push(data[index - row - 1]);  // nw
    }
    if (x < row - 1) {
      arounds.push(data[index - row + 1]);  // ne
    }
  }
  if (x > 0) {
    arounds.push(data[index - 1]);  // w
  }
  if (x < row - 1) {
    arounds.push(data[index + 1]);  // e
  }
  if (y < col - 1) {
    arounds.push(data[index + row]);  // s
    if (x > 0) {
      arounds.push(data[index + row - 1]);  // sw
    }
    if (x < row - 1) {
      arounds.push(data[index + row + 1]);  // se
    }
  }
  var livingCount = 0;
  arounds.forEach(function(v) {
    if (v === 1) {
      livingCount++;
    }
  });
  if (data[index] === 0) {
    return livingCount === 3 ? 1 : 0;
  } else {
    return (livingCount === 2 || livingCount === 3) ? 1 : 0;
  }
}
