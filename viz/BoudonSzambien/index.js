//fonction pour mettre en forme (html) les délibérations (en json)
//affiche titre (avec lien vers INHA), commune, dpt, date, catégorie, type
function formattext(delibjson){

  //afficher les données
  var result= `${delibjson.map(delib => 
    `<div class="delib">
      <p><a href="https://www.inha.fr/conbavil/notice.php?pv=${delib.id}"><b>${delib.title || 'sans titre'}</b></a></p>
      <p>${delib.commune || 'sans géolocalisation'}, ${delib.departement || ''} (${delib.date}) <br>
      ${delib.buildingCategory}<br> <i>${delib.buildingType}</i></p>
    </div>`
    ).join("\n")}`;

  return result;
}

//fonction pour mettre en forme (html) les délibérations (en json)
//affiche id, titre (avec lien vers INHA), date, rapporteur 
function formatdates(delibjson){

  //afficher les données
  var result= `${delibjson.map(delib => 
    `<div class="delib">
      <p><b>${delib.id}</b>: <a href="https://www.inha.fr/conbavil/notice.php?pv=${delib.conbavil}">${delib.title || 'sans titre'}</a></p>
      <p>${delib.rapporteur} <br> ${delib.date}</p>
    </div>`
    ).join("\n")}`;

  return result;
}

//fonction pour mettre en forme (html) les délibérations (en json)
//affiche id, titre (avec lien vers INHA), date, catégorie, type, élément remarquable
function formattypeI(delibjson){
  var result = "<h4>Boissonnade (architecte) en Averyon</h4><div class='delib'>";
  var str;
  //pour chaque groupe de délibérations
  for (g in delibjson){
    //titre: type d'intervention + comptage
    result = result + "<h4>"+ delibjson[g].name + ": " + delibjson[g].count+"</h4>";
    //afficher chaque déliébration
    delibjson[g].delib.forEach(d => {
      //s'il y a un élément remarquable, l'ajouter 
      var rem = "";
      if (d.remarquable){
        rem = "<b>Élément(s) remarquable(s): </b>" + d.remarquable; 
      }
      
      str = `<p><a href='https://www.inha.fr/conbavil/notice.php?pv=${d.id}'><b>${d.title || 'sans titre'}</b></a></p>
      <p>${d.meeting}, avis: ${d.advice}<br> 
      ${d.buildingCategory}<br> <i>${d.buildingType}</i><br>${rem}</p>`
      result = result + str;
    })
    
  }
  return result 
}


var scriptq1 = d3.select("#scriptq1"),
    delibsq1 = d3.select("#delibq1");
//q1
function showq1 (sq1, dq1){
    //afficher le script
    scriptq1.html(sq1)

    //afficher les données
    var textq1=formattext(dq1)    
    delibsq1.html(textq1)

    //compiler des données chiffrées? type quantité de monments..?
}   

var sqlq2 = d3.select("#sqlq2");
var scriptq2 = d3.select("#scriptq2")
var delibq2 = d3.select("#delibq2")
//q2
function showq2(sql2, sq2, dq2){
  //afficher le script sql    
  sqlq2.html(sql2);

  //afficher le script js
  scriptq2.html(sq2);

  //afficher les délibs
  var textq2 = formattext(dq2)
  delibq2.html(textq2)
}


var scriptq3 = d3.select("#scriptq3");
var delibq3 = d3.select("#delibq3");

function showq3(sq3, dq3){

  //afficher le script js
  scriptq3.html(sq3);

  //afficher les délibs
  var textq3 = formatdates(dq3)
  delibq3.html(textq3)
}

var sqlq4 = d3.select("#sqlq4")
var delibq4 = d3.select("#delibq4")
function showq4 (sql4, dq4) {
  sqlq4.html(sql4); 

  delibq4.html(formattypeI(dq4))

}

  
var widthChart = 400;
var heightChart = 400;
var arcs;
const svg = d3.select("#demoq5").append("svg").attr("id", "pieChart")
.attr("viewBox", [-widthChart / 2, -heightChart / 2, widthChart, heightChart]);
//crée un camembert :) 
function pieChart(data){
  //https://observablehq.com/@d3/pie-chart
  const pie = d3.pie()
    .sort(null)
    .value(d => d.value);
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(widthChart, heightChart) / 2 - 1);
  const color = d3.scaleOrdinal()
    .domain(data[0].map(d => d.name))
    .range(d3.quantize(t => d3.interpolateRdYlGn(t * 0.8 + 0.1), data[0].length).reverse())
  
  const radius = Math.min(widthChart, heightChart) / 2 * 0.8;
  const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);
  
  //ratio de 0 à 1
  const scalep = d3.scaleLinear()
    .domain([0, data[1]])
    .range([0, 1])
  //transforme le résultat en pourcentage
  var formatp = d3.format(".0%")
  
  arcs = pie(data[0]);
   
  svg.append("g")
      .attr("stroke", "white")
    .selectAll("path")
    .data(arcs)
    .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
    .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(arcs)
    .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .call(text => text.append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text(d => formatp(scalep(d.data.value))));
  
  return svg.node();
}

//formatte les données pour créer le camembert
//trie pour garder les années concernées
//garde le nom + la valeur & total (pour calculer le pourcentage)
function adjustRange(range, data){
  //dataRange servira au graphique
  var dataRange = [{
    name: 'construction',
    value: 0
  },{
    name: 'reparation', 
    value: 0
  },{
    name: 'autre', 
    value: 0
  }]
  

  data.forEach(a => {
    //si l'année est dans l'intervalle
    if (a.annee >= range[0] && a.annee <= range[1]){
      dataRange.forEach( d => {
        if (d.name == 'construction')
          d.value += a.construction
        else if (d.name == 'reparation')
          d.value += a.reparation
        else if (d.name == 'autre')
          d.value += a.autre 
        else 
          console.log("erreur!")
        
      })
      
    }  
  })
  var total = 0;
  //addition des valeurs pour obtenir le total
  dataRange.forEach(i =>{
      total += i.value;
  })
  return [dataRange, total]; 
}

function showq5 (dq5){
  //valeur par défaut de l'intervalle
  var range = [1805, 1815]

  //Slider
  //https://www.npmjs.com/package/d3-simple-slider
  //https://github.com/johnwalley/d3-simple-slider 

  var sliderRange = d3
    .sliderBottom()
    .min(1795)
    .max(1840)
    .width(400)
    .ticks(5)
    .default([1805, 1815])
    .fill('#2196f3')
    .on('onchange', val => {
      //en cas de changement, les valeurs de l'intervalle sont ajustées
      range = val;
      dataRange = adjustRange(range, dq5) 
      //ajuste les données du camembert
      pieChart(dataRange)
      //pour faire plus élégant on pourrait gérer ça dans une fonction
      d3.select('p#slidervalue').text(val.map(d3.format("d")).join(' - '));
    });

  var gRange = d3
    .select('div#slider')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gRange.call(sliderRange);


  //gérer les données selon l'intervalle
  var dataRange = adjustRange(range, dq5)

  console.log(dataRange)
  console.log(dataRange)

  //créer un camembert
  pieChart(dataRange)

}

Promise.all([
    d3.text('../../scripts/boudonSzambien/q1.js'),
    d3.json('../../data-public/boudonSzambien/q1.json'),
    d3.text('../../scripts/boudonSzambien/q2.sql'),
    d3.text('../../scripts/boudonSzambien/q2.js'),
    d3.json('../../data-public/boudonSzambien/q2.json'),
    d3.text('../../scripts/boudonSzambien/q3.js'),
    d3.json('../../data-public/boudonSzambien/q3.json'),
    d3.text('../../scripts/boudonSzambien/q4.sql'),
    d3.json('../../data-public/boudonSzambien/q4.json'),
    d3.json('../../data-public/boudonSzambien/q5.json')
    
]).then(([sq1, dq1, sql2, sq2, dq2, sq3, dq3, sql4, dq4, dq5]) => {
    showq1(sq1, dq1);
    showq2(sql2, sq2, dq2);
    showq3(sq3, dq3);
    showq4(sql4, dq4);
    showq5(dq5);
})