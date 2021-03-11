  /*

@@@@@@@@@@@@@@@@@@@@@@@
Datascape CONBAVIL 1
@@@@@@@@@@@@@@@@@@@@@@@

author: lmk
date: 27 juin 2020

inspired by: https://observablehq.com/@mbostock/the-impact-of-vaccines
*/


var textView = d3.select("#textview")

var svg1 = d3.select("#datascape"),
    margin = {top: 50, right: 50, bottom: 5, left: 50},
    width = +svg1.attr("width") - margin.left - margin.right,
    height = +svg1.attr("height") - margin.top - margin.bottom;

const rect2 = svg1.append('rect2')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("fill", "transparent")

const container = svg1.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
/*
function handleMouseOver(d, i){
  //changes color on mouseOver
  d3.select(this)
  .classed("actif", true)

}
function handleMouseOut(d,i){
  //changes color back 
  d3.select(this)
      .classed("actif", false);
}*/
const x = d3.scaleBand()
      .range([0,width])

const y = d3.scaleBand()
      .range([0, height])




const  color = d3.scaleOrdinal(["#af8d86", "#260c1a"]).domain([0, 1])

function datascape(data){
  console.timeEnd('json');



  //viewing the texture or motif of the db

  //x axis is the names
  x.domain(data.names)

  // y axis is the id
  y.domain(data.entries)


  //attempt to fix the position of x axis 
  //(it probably would have to be in a separate html element)
  container.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate("+margin.left+"," + margin.top +")")
    .call(d3.axisTop(x))
    .selectAll("text")
    .attr("transform", "rotate (-60)")
    .attr("dx", "1em")
    .style("text-anchor", "start"); 

  console.log("done with x axis")
  
   
  container.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate("+ margin.left + ","+margin.top+")")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("text-anchor", "end")
    
  console.log("done with y axis")


  container.append("g")
    .selectAll("g")
    .data(data.values)
    .join("g")
      .attr("transform", (d, i) => `translate(0,${y(data.entries[i])+margin.top})`)
    .selectAll("rect")
    .data(d => d)
    .join("rect")
      .attr("x", (d, i) => x(data.names[i]) + margin.left)
      .attr("class", (d,i) => data.names[i].includes("unsure") ? "w3-opacity-min" : "" )
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth() - 1)
      .attr("fill", d => color(d))
  //    .on("mouseover", handleMouseOver)
  //    .on("mouseout", handleMouseOut)
  
  console.timeEnd('graphique');

  return svg1.node();
  }

console.time('json');

console.time('graphique');

Promise.all([
  d3.json('../../data/datascape0.json'),
  d3.json('../../data/datascape1.json'),
  d3.json('../../data/datascape2.json'),
  d3.json('../../data/datascape3.json'),
  d3.json('../../data/datascape4.json')
]).then(([data0, data1, data2, data3, data4]) => {
  
  datascape(data0);
  
  //pour mettre à jour en cas de changement de partie
  d3.selectAll(("input[name='partie']")).on("change", function (){
    /*
    tout en commentaire pour le moment car ça plante! 
    datascape(eval(`data${this.value}`))
    */
  })

});


