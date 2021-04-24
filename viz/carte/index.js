/*

@@@@@@@@@@@@@@@@@@@@@@@
Map of France with data
@@@@@@@@@@@@@@@@@@@@@@@

author: lmk
source: https://beta.observablehq.com/d/47e03b0eadfc73b3
date: 11 january 2019

*/
var index = {};

var margin = {top: 20, right: 30, bottom: 30, left: 40},
  width = 1060 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

const svg = d3.select("#carte")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
    
const domain = [0, 825];
const color = d3.scaleLinear()
  .domain(domain)
  .interpolate(() => d3.interpolateGreens);
const path = d3.geoPath();

function handleMouseOver(d, i){
  //changes color on mouseOver
  d3.select(this)
    .style('fill', '#ddd');

  d3.select('#dpt'+d.properties.code)
    .style('font-weight', 'bold')
    .text(d => index[d.properties.code].length);

  svg.append("text")
    .attr("id", "dpt" + d.properties.code + i)
    .attr("x", width - 250)
    .attr("y", 80)
    .text("Departement: " + d.properties.nom)
    .style("font-weight", "bold")
  
  svg.append("text")
    .attr("id", "nb" + d.properties.code + i)
    .attr("x", width - 250)
    .attr("y", 100)
    .text("Nombre de délibérations: " + index[d.properties.code].length)

}

function handleMouseOut(d,i){
  //changes color back 
  d3.select(this)
    .style('fill', color(index[d.properties.code].length));

  d3.select('#dpt'+d.properties.code)
    .style('font-weight', 'normal')
    .text(d => d.properties.nom);

  d3.select("#dpt" + d.properties.code + i).remove();
  d3.select("#nb" + d.properties.code + i).remove();
} 

function handleClick(d,i){
  console.log(d.properties.nom + ' : ' + index[d.properties.code].length + ' délibérations')
}

function projection(data){
  
  const projection = d3.geoConicConformal()
    .center([2.454071, 46.279229]) // Center on France
    .scale(500)
    .fitSize([width, height], data);

  path.projection(projection);
    
  console.timeEnd('projection');
}


function nbDelib(dpt){
  

}


function map(geojson, index){
  console.timeEnd('json');

  projection(geojson);


  svg.selectAll("path")
    .data(geojson.features)
    .enter().append("path")
    .attr("d", path)
    .attr('fill', d => color(index[d.properties.code].length))
    .attr('stroke', 'white')
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("click", handleClick);

  var labels = svg.append('g').attr('class', 'labels');

  labels.selectAll('.label')
    .data(geojson.features)
    .enter()
    .append('text')
      .attr("class", "label")
      .attr('transform', function(d) {
          return "translate(" + path.centroid(d) + ")";
      })
      .attr("id", (d => ("dpt"+d.properties.code)))
      .style('text-anchor', 'middle')
      .style('font-family', 'sans-serif')
      .text(d => d.properties.nom);

  svg.selectAll('g').raise();
  return svg.node();
}

console.time('json');
console.time('projection');

Promise.all([
  d3.json('../../data/geo/departements-version-simplifiee.geojson'),
  d3.json('../../data/conbavil.json')
]).then(([geojson, data]) => {
  data.forEach(delib => {
    var dpts = delib.numDepartement || "00";
    dpts.split(";").forEach(dpt => {
      //attention séparer départements multiples 
      if (!(dpt in index))
        index[dpt] = [];

      index[dpt].push(delib);
    })
    
  })
  console.log(index);
  map(geojson, index);
}).catch(function(error) {
  console.log(error);
});




  /*
  svg.call(d3.zoom().on("zoom", function () {
          svg.attr("transform", d3.event.transform)
  }))
  */