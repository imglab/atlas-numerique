
const svg = d3.select("#barChart"),
    margin = {top: 10, right: 20, bottom: 20, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
//should enable deselect when clic on background but didn't work
const rect = svg.append('rect')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("fill", "transparent")


const container = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const textView = d3.select("#text");
var conbavil;
var parseDate = d3.timeParse("%Y-%m-%d");

// fisheye attempt 
// html <script src="https://bost.ocks.org/mike/fisheye/fisheye.js"></script>
//var fisheye = d3.fisheye.circular().radius(120);

const x = d3.scaleBand()
      .range([0,width])
      .align([0.5])
      .paddingInner([1])
      .paddingOuter([0.1]);

const y = d3.scaleLinear()

//temporary fix: button
const button = d3.select("#deselect")
  .on("click", function f() {
    console.log("deselection")

    container.selectAll('.bar')
      .classed('selection', false)

      var msg = `<h3>Affaires concernées</h3>    
        <p>Veuillez sélectionner une ou plusieurs barre·s pour afficher les délibérations concernées`
      textView.html(msg)
  })

function handleClick (bar){
  return function handleClick(d,i){

    d3.select(this)
      .classed("selection", !d3.select(this).classed("selection") );

    var set = new Set();
    var selectDates = d3.selectAll(".selection").data()
    selectDates.forEach( d => {
      set.add(d.date)
    })
    
  
    //define subset
    var subset = conbavil.filter(data => data.hasOwnProperty("meeting")&& set.has(data.meeting))

    console.log(subset)

    //afficher délibérations 
    const text = subset => 
      `<h3>Affaires concernées</h3>    
      ${subset.map(delib => 
        `<div class="delib">
          <h4>${delib.meeting}</h4>
          <p>${delib.commune}, ${delib.departement}</p>
          <p>${delib.buildingType}</p>
          <p>${delib.projectGenre}</p>
          <p>${delib.advice}</p>
        </div>`
      ).join("\n")}`
    textView.html(text(subset))
    /*
    if (d.value < 2) {
      d3.select('#text').text("Afficher la délibération du "+d.date) 
    }
    else {
      d3.select('#text').text("Afficher les "+d.value+" délibérations du "+d.date)    
    }*/

  }
}


//reformat data for "chartdata" format
function barChart(index){

  x.domain(index.map( d => d.date));
      
  //1802-1805 : why suddenly not integers? all small max (6-7-5)
  y.domain([0, d3.max(index.map(d => d.value))+1])
      .range([height, 0]);

  container.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        
/* ne pas afficher le pêle-mêle de dates
        .selectAll("text")
        .attr("transform", "rotate (-60)")
        .attr("dx", "-0.75em")
        .style("text-anchor", "end"); 
 */   
    console.log("x axis")

  
    container.append("g")
        .attr("class", "y axis")
        .style("font-family", "Dosis")
        .call(d3.axisLeft(y))
    
    console.log("y axis")
  
    container.append("text")
        .attr("y", -27)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .style("font-family", "Dosis")
        .style("font-size", "12px")
        .text("Nombre de délibérations");
  
    
    console.log("axis titles")

    //var color = d3.scaleSequential(d3.interpolateYlGnBu())
    var color = d3.scaleSequentialLog(d3.interpolateYlGnBu).domain([1, 50])
    
    var bars = container.selectAll(".bar").data(index); 

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.date))
        .attr("y", d => y(d.value))
        .attr("width", 2) //define bandwith accoding to number of deliberations bandwith
        .attr("height", d => height-y(d.value))
        .attr("fill", d => color(d.value))
        .classed("selection", false)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick(bars))
  
    
   container.selectAll('bar').raise();
  
    function handleMouseOver(d, i){

        //changes color on mouseOver
        d3.select(this)
            .classed("actif", true)
        
        svg.append("text")
            .attr("id", "t" + d.letter + i)
            .style('fill', 'darkOrange')
            .attr("x", width*3/4)
            .attr("y", 50)
            .text(d.value+" délibérations le "+d.date)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
        }
  
    function handleMouseOut(d,i){

        //changes color back 
        d3.select(this)
            .classed("actif", false);
            
        
        d3.select("#t" + d.letter + i).remove();  // Remove text location
      }
/* fisheye attempt
      svg.on("mousemove", function () {
        fisheye.focus(d3.mouse(this));
    
        bars.each(function (d) {
            d.fisheye = fisheye(d);
        });
    
         bars.selectAll(".bar")
              .attr("cx", function(d) { return d.fisheye.x - d.x; })
              .attr("cy", function(d) { return d.fisheye.y - d.y; })
              .attr("r", function(d) { return d.fisheye.z * d.r; });
    
          ;
    });
  */
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

d3.json("../../data/conbavil.json").then(function(data) {
    console.log(data.length);
//créer un index des séances par date 
var count = 0;  
var index = {};
  conbavil = data;
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
  barChart(datA);
});
