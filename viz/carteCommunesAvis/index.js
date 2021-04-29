/*

@@@@@@@@@@@@@@@@@@@@@@@
Map of France with data
@@@@@@@@@@@@@@@@@@@@@@@

author: lmk
date: 17 january 2019

*/

var index = {};
var conbavil;
var subset;
var delibData;

var margin = {top: 20, right: 30, bottom: 30, left: 10},
  width = 850 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

const svg = d3.select("#carte")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

const rect = svg.append('rect')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("fill", "transparent")
const container = svg.append('g')
const textView = d3.select("#data");

var proj = d3.geoConicConformal();
const path = d3.geoPath();

//make domain data according to subset...
var circleSize = d3.scaleLinear()
  .domain([Math.sqrt(1), Math.sqrt(326)])
  .range([2, 40]);


function handleMouseOver(d, i){
  //changes color on mouseOver
  d3.select(this)
    .classed("actif", true);

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
    .classed("actif", false);

  d3.select("#commune" + d.properties.numCommune + i).remove();
} 


function handleClickC (circles) {
  return function handleClick(d,i){
    //use includes to avoid ";" issue
    d3.select(this)
      .classed("actif", true)
      .classed("selection", !d3.select(this).classed("selection") );
  
    //define subset: etranger ou france
    if (d.properties.hasOwnProperty("context") && d.properties.context == "etranger"){
      subset = conbavil.filter(data => data.hasOwnProperty("commune") && data.hasOwnProperty("departement") && data.region == "étranger" && data.commune.includes(d.properties.commune) && data.departement.includes(d.properties.departement))
    } else {
      subset = conbavil.filter(data => 
        data.hasOwnProperty("commune") && data.hasOwnProperty("numDepartement") && data.commune.includes(d.properties.commune) && data.numDepartement.includes(d.properties.numDepartement)
      );
    }
    // console.log(subset)
    
    //envoyer sélection à Avis
    var selectedCommunes = d3.selectAll(".city-circle").filter(".selection").data()
    window.hermes.emit('communes', selectedCommunes)
  
    //afficher délibérations 
    const text = subset => 
      `<h3>${d.properties.commune}</h3>    
      ${subset.map(delib => 
        `<div class="delib">
          <h4>${delib.title || 'sans titre'}</h4>
          <p>${delib.meeting}</p>
          <p>${delib.buildingType}</p>
          <p>${delib.projectGenre}</p>
          <p>${delib.advice}</p>
        </div>`
      ).join("\n")}`
    textView.html(text(subset))
    
    // autre communes concernées par le subset 
    const set = new Set();
    subset.forEach(delib => {
      delib.commune.split(";").forEach(comm => {
        set.add(comm)
      })
    })
    set.delete(d.properties.commune)
    console.log(set, d3.selectAll('.city-circle').size());

    d3.selectAll('.city-circle')
      .classed("affected", false)
      .filter(d => set.has(d.properties.commune))
      .classed("affected", true)
      .transition()
      .duration(300);
  }
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

  var circles = container.selectAll("circle").data(json)
  circles.enter()
    .append("circle")
    .attr('class', 'city-circle')
    .attr("cx", d => {return proj(d.geometry.coordinates)[0]})
    .attr("cy", d => {return proj(d.geometry.coordinates)[1]})
    .attr("id", d => {return encodeURI(d.properties.commune)})
    .attr("r", d=> {return circleSize(Math.sqrt(d.properties.numDelib)) + "px"})
    .classed("selection", true)
    .attr("opacity", 0.3)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("click", handleClickC(circles));

    container.selectAll('circle').raise();

//messagerie
    /*window.hermes.on('destroy', function destroy (commune) {
      console.log(commune.nom)
      container.selectAll('circle').filter(d => {
        return d.properties.commune == commune.nom 
      })
        .each(console.log)
        .classed("detruit", true) //mettre une fonction qui récupère le d et toggle la class detruit
    })*/

    window.hermes.on('filtre', function filtre (type){
            
      console.log(`on veut que des ${type}s`)

      var set = new Set();
      var subset = conbavil.filter(d => {
        return d.buildingType && d.buildingType.includes(type)
      })

      console.log(subset)
      
      subset.forEach(d => {
          d.buildingType.forEach(t =>{
            if (t == type)
              set.add(d.commune)
          } )
      } )

      console.log(set)
      
      container.selectAll('circle')
        .classed("selection", false)
        .classed("passif", true)
        .filter(d => {
          return set.has(d.properties.commune)
        })
        .classed("passif", false)
        .classed("selection", true)
    });

    window.hermes.on('avis', function avis (selectedAvis){

      console.log(`on veut uniquement les avis : `+ selectedAvis)

      var set = new Set();

      selectedAvis.forEach( avis => {
        console.log(avis)
        var currentA = conbavil.filter(d => {
          return d.advice && d.advice.includes(avis.avis)
        })

        currentA.forEach(d => {
          if (d.hasOwnProperty("commune"))
              set.add(d.commune)
        } )
      } )
  
      console.log(set)
      
      container.selectAll('circle')
        .classed("selection", false)
        .filter(d => {
          return set.has(d.properties.commune)
        })
        .classed("selection", true)


    });


    window.hermes.on('reset', function reset (type){
      console.log("on remet tout à selection")

      container.selectAll('circle')
        .classed("actif", false)
        .classed("passif", false)
        .classed("affected", false)
        .classed("detruit", false)
        .classed("selection", true)


    });

    window.hermes.on('deselect', function deselect (type){
      console.log("on remet tout à selection")

      container.selectAll('circle')
        .classed("actif", false)
        .classed("affected", false)
        .classed("detruit", false)
        .classed("selection", false)


    });



//zoom function 
  svg.call(
    d3.zoom().on(
      "zoom", 
      () => {
        container.attr('transform', d3.event.transform)
      }
    )
  )

  rect.on("click", deselect)

  return container.node();
}

console.time('json');
console.time('projectiontime');

Promise.all([
  d3.json('../../data/geoCommunesConbavil.json'),
  d3.json('../../data/geoCommunesConbavil-E.json'),
  d3.json('../../data/france-dpt-proj.geojson'),
  d3.json('../../data/conbavil.json')
]).then(([json, jsonE, geojson, data]) => {
  var geo = json.concat(jsonE)
  console.log(json.length)
  console.log(jsonE.length)
  console.log(geo.length)
  map(geo, geojson, data);
}).catch(function(error) {
  console.log(error);
});

/*fix/get zoom */
