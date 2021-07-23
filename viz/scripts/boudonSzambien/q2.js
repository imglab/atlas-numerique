const fs = require('fs-extra');
const conbavil = JSON.parse(fs.readFileSync('../../data/conbavil.json', {encoding: 'utf8'}));

var date=[];
var nievre=[];
var ecoles=[];
var eglises=[];
var nouvAff=[]

var ecolesN=[];
var eglisesN=[];
var nouvAffN=[];

var selection=[]


//crée des sous-ensemble avec les délibération qui respectent les critères de sélection
conbavil.forEach(delib => {
       //délibérations entre 1802 et 1810
       if (delib.meeting >= '1802-01-01' && delib.meeting <= '1810-12-31'){
           date.push(delib)
       }
       //délibérations dans Nièvre (58)
       if (delib.numDepartement && delib.numDepartement =='58'){
           nievre.push(delib)
       }
       //délibérations à propos d'écoles
       if (delib.buildingType && delib.buildingType =='école'){
           ecoles.push(delib)
       }
       //délibérations à propos d'églises
       if(delib.buildingType && delib.buildingType=="église"){
            eglises.push(delib)
       }
       //délibérations qui concernent de nouvelles affectations
       if(delib.projectGenre && delib.projectGenre == 'nouvelle affectation'){
           nouvAff.push(delib)
       }

       //écoles à Nièvre
       if (delib.numDepartement && delib.numDepartement =='58' &&delib.buildingType && delib.buildingType =='école'){
            ecolesN.push(delib)
        }

       //églises à Nièvre
        if (delib.numDepartement && delib.numDepartement =='58' &&delib.buildingType && delib.buildingType =='église'){
            ecolesN.push(delib)
        }

        //nouvelles affectations à Nièvre
        if (delib.numDepartement && delib.numDepartement =='58' && delib.projectGenre && delib.projectGenre == 'nouvelle affectation'){
            nouvAffN.push(delib)
        }

       //tous critères combinées (école ou église)
       if (delib.meeting >= '1802-01-01' && delib.meeting <= '1810-12-31' && delib.numDepartement && delib.numDepartement =='58' && delib.buildingType && ( delib.buildingType =='école' || delib.buildingType == 'église')  && delib.projectGenre && delib.projectGenre == 'nouvelle affectation'){
           selection.push(delib)
       }

});    

//imprime le nombre de mentions 
console.log("délibérations entre 1802 et 1810: " + date.length)
console.log("délibérations concernant Nièvre: " + nievre.length)
console.log("églises: " + eglises.length)
console.log("écoles: " + ecoles.length)
console.log("nouvelles affectations" + nouvAff.length)
console.log("écoles dans Nièvre: " + ecolesN.length)
console.log("églises dans Nièvre: " + eglisesN.length)
console.log("nouvelles affectations dans Nièvre: "+ nouvAffN.length)
console.log("tout combiné: " + selection.length)

var result=[];
//puique la combinaison des critères complets donne un résultat vide, nous allons du moins nous intéresser aux nouvelles affectations dans Nièvre
//sélection des propriétés à afficher dans les résultats
nouvAffN.forEach(d => {
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



fs.writeJSONSync('../../data/boudonSzambien/q2.json', result, {spaces: 2, encoding: 'utf8'});
