/*

@@@@@@@@@@@@@@@@@@@@@@@
Map of France with data
@@@@@@@@@@@@@@@@@@@@@@@

author: lmk
date: 17 january - 15 février 2019

*/
var conbavil;
var subset;

var margin = {top: 20, right: 30, bottom: 30, left: 40},
  width = 960 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

const svg = d3.select("#carte")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const container = svg.append('g');
var proj = d3.geoConicConformal();
const path = d3.geoPath();



function handleMouseOver(d, i){
  //changes color on mouseOver
  d3.select(this)
    .style('fill', 'green');

  svg.append("text")
      .attr("id", "commune" + d.properties.numCommune + i)
      .attr("x", this.getAttribute('cx'))
      .attr("y", this.getAttribute('cy'))
      .style("font-weight", "bold")
      .style("font-size", 10)
      .text(d.properties.commune + ": " + d.properties.numDelib)

}

function handleMouseOut(d,i){
  //changes color back 
  d3.select(this)
    .style('fill', 'red');

  d3.select("#commune" + d.properties.numCommune + i).remove();
} 

function handleClick(d,i){
  console.log(d.properties);
  subset = conbavil.filter(delib => {
    delib.commune == d.properties.commune && delib.numDepartement == d.properties.numDepartement
  })
  
}


function map(json, geojson, data){
  console.timeEnd('json');
  conbavil = data;

  proj.center([2.454071, 46.279229]) // Center on France
    .scale(1000)
    .fitSize([width, height], geojson);

  path.projection(proj);

  console.timeEnd('projectiontime');
  


//layer départements
  container.selectAll("path")
    .data(geojson.features)
    .enter().append("path")
    .attr("d", d => path(d))
    .attr('stroke', 'black')
    .attr('fill', 'none')

  
  container.selectAll("circle")
    .data(json).enter()
    .append("circle")
    .attr("cx", d => {return proj(d.geometry.coordinates)[0]})
    .attr("cy", d => {return proj(d.geometry.coordinates)[1]})
    .attr("r", d=> {return d.properties.numDelib + "px"})
    .attr("fill", "red")
    .attr("opacity", 0.2)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("click", handleClick);

  container.selectAll('circle').raise();

//zoom function 
  svg.call(
    d3.zoom().on(
      "zoom", 
      () => {
        container.attr('transform', d3.event.transform)
      }
    )
  )

 

  return svg.node();
}

console.time('json');
console.time('projectiontime');

Promise.all([
  d3.json('../../data/geoCommunesConbavil.json'),
  d3.json('../../data/france-dpt-proj.geojson'),
  d3.json('../../data/conbavil.json')
]).then(([json, geojson, data]) => {
  map(json, geojson, data);
}).catch(function(error) {
  console.log(error);
});

/*fix/get zoom */
