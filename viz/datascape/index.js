  /*

@@@@@@@@@@@@@@@@@@@@@@@
Datascape CONBAVIL 1
@@@@@@@@@@@@@@@@@@@@@@@

author: lmk
date: 18 juin 2020

*/

var textView = d3.select("#textview")

function handleClick (bar, decompte){
  return function handleClick(d,i){

    d3.select(this)
      .classed("selection", !d3.select(this).classed("selection") );

    var key = d.data.name;
    console.log(key)
    console.log(decompte[key].values)

    var set = decompte[key].values
    var liste="";
    set.forEach(i => {
      liste = liste.concat(`<ul>${i}</ul>`)
    })  
    //afficher les détails  
    const text = `<h3>${key}</h3>    
    <p>Occurences dans la base de données: ${decompte[key].count}</p>
    <p>Valeurs distinctes de la propriété: ${decompte[key].distinct}</p>
    <li>${liste}</li>`  
    
    textView.html(text)

  }
}


var svg1 = d3.select("#datascape"),
    margin = {top: 20, right: 20, bottom: 150, left: 80},
    width = +svg1.attr("width") - margin.left - margin.right,
    height = +svg1.attr("height") - margin.top - margin.bottom;

const rect = svg1.append('rect')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("fill", "transparent")


const container = svg1.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const x = d3.scaleBand()
      .range([0,width])
      .align([0.5])
      .paddingInner([1])
      .paddingOuter([0.1]);

const y = d3.scaleLinear();
const inverseX = d3.scaleQuantize();
function datascape(properties, decompte){
  console.timeEnd('json');

  //making a bar chart with the properties

  // https://observablehq.com/@ericd9799/learning-stacked-bar-chart-in-d3-js

  //https://observablehq.com/@d3/sortable-bar-chart
  //to be added

  var stack = d3.stack()
    .keys(properties.columns.slice(1))
  
  var series = stack(properties)

  //x axis is the names
  x.domain(properties.map(d => d.name))
    .range([0, width])
    .padding(0.1);

  // y axis is the value (number of distinct values)
  y.domain([0,d3.max(series, d => d3.max(d, d=> d[1]))+1000])
    .range([height,0]);

  inverseX.domain(x.range())
    .range(x.domain());
  
  const rects = container.selectAll("g").data(series).enter()
    .append("g")
    .attr("class", d => d.key);

  rects.selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", (d, i) => x(d.data.name))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .classed("selection", false)
    .on("mouseover", function(){d3.select(this).classed("h", true)})
    .on("click", handleClick(rects, decompte))
    .on("mouseout", function(){
      d3.select(this).classed("h", false);
      //ne garde pas l'état de sélection ou semble écrire par dessus
      d3.select(this).attr("class", this.parentElement.class)});
  
  container.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate (-60)")
    .attr("dx", "-0.75em")
    .style("text-anchor", "end"); 


  container.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).ticks(null, "s"))

      /*
  var nbr = decompte.file.count;
  var line = d3.line()
    .y(nbr)

  container.append("path")
    .attr("class", "line")
    .attr("d", line)

  var legend = container.selectAll("l").data(series).enter()
    .append("g")
    .attr("fill", d => color(d.key))
    .attr("class", "legend")
    .attr("x", 500)
    .attr("y", 150)
    .attr("height", 10)
    .attr("width", 10)
    .text(d => d.key)
*/
  return svg1.node();
  }

console.time('json');

var index = {};
var decompte = {};
var properties = []


d3.json('../../data/conbavil.json').then(function (data) {
  //pour chaque délibération
  data.forEach(delib => {

    var keyNames = Object.keys(delib)
    
    //pour chaque propriété dans la délibération
    keyNames.forEach(key => {
      if (!(key in index))
          index[key] = [];

      //si la propriété est décrite par un tableau
      if (Array.isArray(delib[key])){
        delib[key].forEach(d => {
          index[key].push(d)
        })
      }
      else{
        //si elle n'existe pas encore dans l'index, l'ajoute        //ajouter la dé
      index[key].push(delib[key]);
      }
    }) 
  });

  var i = 0;
  // pour chaque clef dans l'index

  for (key in index) {
    // créer un ensemble unique
    // :: ATTENTION :: 
    // ne fonctionne pas pour les propriétés qui sont en tableaux
    // faire if array, then .foreach() 

    var s = new Set(index[key]);

    //compter le nombre et ajouter l'ensemble des valeurs
    decompte[key] = {
      count: index[key].length , 
      distinct: s.size,
      values: s
      
    };


    //d is distinct values, t is the rest
    var nonUnique = index[key].length-s.size;
    properties[i] = {
      name: key,
      d: s.size,
      t: nonUnique,
    };
    i++;

  };


  properties.columns= ["name", "d", "t"]
  console.log("liste des propriétés")
  console.log(properties)


  console.log ("decompte")
  console.log(decompte)

  datascape(properties, decompte);
});


