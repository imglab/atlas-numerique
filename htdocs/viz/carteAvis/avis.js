
const svgAvis = d3.select("#barChart"),
    marginAvis = {top: 40, right: 20, bottom: 75, left: 50},
    widthAvis = 350 - marginAvis.left - marginAvis.right,
    heightAvis = 300 - marginAvis.top - marginAvis.bottom;

const rectA = svg.append('rect')
  .attr("width", widthAvis + margin.left + margin.right)
  .attr("height", heightAvis + margin.top + margin.bottom)
  .style("fill", "transparent")

console.log("largeur "+widthAvis)

console.log("hauteur "+heightAvis)


const x = d3.scaleBand()
      .range([0,widthAvis])
      .align([0.5])
      .paddingInner([1])
      .paddingOuter([0.1]);

const y = d3.scaleLinear()

function handleClickA (bar) {
  return function handleClick(d,i){
    
    var current = d3.select(this);

    //inverse selection de l'objet 
    current.classed("selection", !current.classed("selection"));

    var selectedAvis =  d3.selectAll(".bar").filter(".selection")
      .data()

    console.log(selectedAvis)

    window.hermes.emit('avis', selectedAvis)
    
  }
}

function barChart(indexAvis, data){

    const g = svgAvis.append("g")
        .attr("transform", "translate(" + marginAvis.left + "," + marginAvis.top + ")");

    x.domain(indexAvis.map(d => d.avis));

    y.domain([0, d3.max(indexAvis.map(d => d.value)) + 50])
      .range([heightAvis, 0]);

    // x axis
    g.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + heightAvis + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate (-25)")
        .attr("dx", "-0.1em")
        .style("text-anchor", "end");

    // y axis
    g.append("g")
        .attr("class", "yAxis")
        .call(d3.axisLeft(y))

    // y axis title
    g.append("text")
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .text("Nombre d'avis");
  
    //title
    g.append("text")
        .attr("x", widthAvis/2)
        .attr("y", -25)
        .style("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("font-size", "16px")
        .text("Avis du conseil");
    
    var bars = g.selectAll(".bar").data(indexAvis); 
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.avis))
        .attr("y", d => y(d.value))
        .attr("width", 25) //define bandwith accoding to number of deliberations bandwith
        .attr("height", d => heightAvis-y(d.value))
        .classed("selection", true)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClickA(bars));
  
  
    function handleMouseOver(d, i){
        //changes color on mouseOver
        d3.select(this)
            .classed("actif", true);
        
        svgAvis.append("text")
            .attr("id", "t" + d.letter + i)
            .attr("x", x(d.avis) + 45)
            .attr("y", y(d.value) + 20)
            .text(d.value)
            .attr("dy", ".51em")
            .style("text-anchor", "start");
        }
  
    function handleMouseOut(d,i){
        //changes color back 
        d3.select(this)
            .classed("actif", false);
        
        d3.select("#t" + d.letter + i).remove();  // Remove text location
      }

    function updateBar(data){
      x.domain(data.map(d => d.avis));

      y.domain([0, d3.max(data.map(d => d.value)) + 50])
        .range([heightAvis, 0]);

      var newBars = g.selectAll(".bar")
        .remove()
        .exit()
        .data(data)
      
      newBars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.avis))
        .attr("y", d => y(d.value))
        .attr("width", 25) //define bandwith accoding to number of deliberations bandwith
        .attr("height", d => heightAvis-y(d.value))
        .classed("selection", true)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClickA(bars));

      g.select(".xAxis")
        .attr("transform", "translate(0," + heightAvis + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate (-25)")
        .attr("dx", "-0.1em")
        .style("text-anchor", "end");
      
      g.select(".yAxis")
        .call(d3.axisLeft(y))
    }

    //changement selection communes
    window.hermes.on("communes", function communes (selectedCommunes){
      var sCommunes = [];
      console.log(selectedCommunes)
      selectedCommunes.forEach(d => sCommunes.push(d.properties.commune));

      console.log("sous-ensemble de communes")
      console.log(sCommunes);

      var newData = index(data, sCommunes)

      console.log("lets update the chart")
      updateBar(newData)
      
    })
  
    return svgAvis.node();    

}

function index(data, select) {

  //créer un index des délibérations par avis 
  var indexAvis = {};
  var count = 0;
  var dataset;


  if (select && select.length > 0){
    console.log("tri dans données");
    dataset = data.filter(d => d.hasOwnProperty("commune") && select.includes(d.commune)); //ne fonctionne pas pour mutliple
  } else {
    dataset = data
  }
  console.log("sous-ensemble pour index")
  console.log(dataset)

  dataset.forEach(delib => {
    var avis = delib.advice;
    count++;

    avis.split(/\s*;\s*/).map(x =>{
      if (x == "")
          x = "sans avis"

      if (!(x in indexAvis)){
        indexAvis[x] = {
          avis: x,
          value: 0
        };
      }
      indexAvis[x].value += 1;
    })
  })

  var result = [];

  for (i in indexAvis){
    if (indexAvis[i].value > 5){
      result.push({
        avis: indexAvis[i].avis,
        value: indexAvis[i].value
      })
    }
    else {
      console.log("la visualisation ignore "+ indexAvis[i].avis)
    }
    
  }
  console.log(result)
  return result;
}



d3.json("../../data/conbavil.json").then(function(data) {

var datA = index(data)

console.log("let's make a bar chart")
console.log(datA)
barChart(datA, data);
});
