const fs = require('fs-extra');
const conbavil = JSON.parse(fs.readFileSync('../../data/conbavil.json', {encoding: 'utf8'}));

var napoleon=[];
var depotMendicite=[];
var result=[];

//crée un sous-ensemble intitulé "napoleon" avec les délibération qui font mention de ce dernier
conbavil.forEach(delib => {
       if (delib.mentionPerson && delib.mentionPerson=="Napoléon Ier"){
              napoleon.push(delib)
       }
       if(delib.buildingType && delib.buildingType=="dépôt de mendicité"){
              depotMendicite.push(delib)
       }
});    

//imprime le nombre de mentions de napoléons et la quantité de délibérations traitant de dépôts de mendicité
console.log("mention de Napoléon: " + napoleon.length)
console.log("dépôt de mendicité: " + depotMendicite.length)

//sélection des propriétés à afficher dans les résultats
napoleon.forEach(d => {
       var entry = {};
       //récupérer le id (sans "conbavil") pour créer un lien vers la page INHA
       entry.id = d.id.substring(8); 
       if (d.title)
              entry.title = d.title
       if(d.commune)
              entry.commune = d.commune
       if(d.departement)
              entry.departement = d.departement
       if (d.meeting)
              entry.date = d.meeting
       if (d.buildingCategory)
              entry.buildingCategory = d.buildingCategory
       if (d.buildingType)
              entry.buildingType = d.buildingType
       result.push(entry)
})



fs.writeJSONSync('../../data//boudonSzambien/q1.json', result, {spaces: 2, encoding: 'utf8'});
