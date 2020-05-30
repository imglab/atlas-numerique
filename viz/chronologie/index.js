/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2

Chronologie conbavil 
creator: lenamk

original brush and zoom: Bostock https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

var svg = d3.select("#timeline"),
  margin = {top: 20, right: 20, bottom: 110, left: 40},
  margin2 = {top: 430, right: 20, bottom: 30, left: 40},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  height2 = +svg.attr("height") - margin2.top - margin2.bottom;

var parseDate = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime([0, width]),
  x2 = d3.scaleTime([0, width]),
  y = d3.scaleLinear([height, 0]),
  y2 = d3.scaleLinear([height2, 0]);

var xAxis = d3.axisBottom(x),
  xAxis2 = d3.axisBottom(x2),
  yAxis = d3.axisLeft(y);

var brush = d3.brushX()
  .extent([[0, 0], [width, height2]])
  .on("brush end", brushed);

var zoom = d3.zoom()
  .scaleExtent([1, Infinity])
  .translateExtent([[0, 0], [width, height]])
  .extent([[0, 0], [width, height]])
  .on("zoom", zoomed);

//curve types
// http://bl.ocks.org/d3indepth/b6d4845973089bc1012dec1674d3aff8
//possible change for classic diagram? 

var area = d3.area()
  .curve(d3.curveStepAfter)
  .x(function(d) { return x(parseDate(d.date)); })
  .y0(height)
  .y1(function(d) { return y(d.value); });

var area2 = d3.area()
  .curve(d3.curveMonotoneX)
  .x(function(d) { return x2(parseDate(d.date)); })
  .y0(height2)
  .y1(function(
    d) { return y2(d.value); });

svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

var focus = svg.append("g")
  .attr("class", "focus")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
  .attr("class", "context")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

function timeline(array){
    
  x.domain(d3.extent(array, function(d) { return parseDate(d.date); }));
  y.domain([0, d3.max(array, function(d) { return d.value; })]);
  x2.domain(x.domain());
  y2.domain(y.domain());
  

  focus.append("path")
    .datum(array)
    .attr("class", "area")
    .attr("d", area);

  focus.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  focus.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);

  context.append("path")
    .datum(array)
    .attr("class", "area")
    .attr("d", area2);

  context.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

  context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x.range());

  svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);
}

Promise.all([
  d3.json('../../data/conbavil.json')
]).then(([data]) => {
  console.log(data);
  
  var index = {};
//créer un index des séances par date 
var count = 0;

  data.forEach(delib => {
    var date = delib.meeting;
    count++;
    if (!(date in index))
      index[date] = {
        date: date,
        value: 0
      };
    index[date].value += 1;
  })

  console.log(index);
  console.log(count)
  var datA = [];

  for (i in index){
    datA.push({
      date: index[i].date,
      value: index[i].value
    })
    
  }
  console.log(datA)
  timeline(datA);
}).catch(function(error) {
  console.log(error)
})


function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
    .scale(width / (s[1] - s[0]))
    .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
  d.date = parseDate(d.date);
  d.value = +d.value;
  return d;
}
