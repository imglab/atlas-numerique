/*

@@@@@@@@@@@@@@@@@@@@@@@
Bubble chart with data
@@@@@@@@@@@@@@@@@@@@@@@

author: lmk
date: 28 avril 2020

*/
var margin = {top: 20, right: 30, bottom: 30, left: 10},
  width = 850 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

const svg = d3.select("#graph")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

const rect = svg.append('rect')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("fill", "transparent")
const container = svg.append('g')

//Mike Bostock https://observablehq.com/@d3/bubble-chart





// https://observablehq.com/@mmattozzi/bubble-chart-gdp-by-country
function chart(root) {
    console.log("we are starting the chart")
    
    var format = d3.format(",d"),
        color = d3.scaleOrdinal(d3.schemeSet3)
  
    var tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "white")
      .style("padding", "8px")
      .style("background-color", "rgba(0, 0, 0, 0.75)")
      .style("border-radius", "6px")
      .style("font", "12px sans-serif")
      .text("tooltip");

    var betterData = d3.hierarchy(root)
      .sum(function(d) { return d.occurences; })
      .sort(function(a, b) { a.group < b.group ? -1 : 1 })

    var bubble = d3.pack()
      .size([width, height])
      .padding(1.5);
   
    bubble(betterData)

    console.log(betterData.children)


    var node = container.selectAll(".node")
        .data(betterData.children)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { 
            return color(d.group); 
        })
        .on("mouseover", function(d) {
            tooltip.text(d.data.name + ": " + format(d.value));
            tooltip.style("visibility", "visible");
            d3.select(this).style("stroke", "black");
        })
        .on("mousemove", function() {
            return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
        })
        .on("mouseout", function() {
          d3.select(this).style("stroke", "none");
          return tooltip.style("visibility", "hidden");
        });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("font", "10px sans-serif")
        .style("pointer-events", "none")
        .text(function(d) { return d.data.name.substring(0, d.r / 3); });

  
     return svg.node();
}




Promise.all([
    d3.json('../../data/rolesEtPersonnes.json')
  ]).then(([json]) => {
    chart(json);
  }).catch(function(error) {
    console.log(error);
  });