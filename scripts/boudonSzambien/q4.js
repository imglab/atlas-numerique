const fs = require('fs-extra');
const sortBy = require('lodash/sortBy');

const conbavil = JSON.parse(fs.readFileSync('../../data/conbavil.json', {encoding: 'utf8'}));

var aveyron=0;
var b=[];
var bArchiA=[];
var bAutreA=[];
var bArchi=[];
var bAutre=[];
var result=[];

//crée un sous-ensemble intitulé "napoleon" avec les délibération qui font mention de ce dernier
conbavil.forEach(delib => {
    if (delib.numDepartement && delib.numDepartement == "12"){
        //compte les délibérations en Aveyron
        aveyron +=1 ;

        var participants = delib.participants;

        if (participants.length > 0){
            participants.forEach(i => {
                //boissade architecte ou autre
                if ((i.persName == "Boissonnade" || i.persName == "Boissonade") && i.occupation =="architecte"){
                    bArchiA.push(delib)
                    b.push(delib)
                }
                else if (i.persName.includes("Boissonnade") || i.persName.includes("Boissonade")){
                    bAutreA.push(delib)
                    b.push(delib)
                }
            })
            
        }
    } else {
        //en dehors de l'aveyron

        var participants = delib.participants;
        if (participants.length > 0){
            participants.forEach( i => {
                if ((i.persName == "Boissonnade"|| i.persName == "Boissonade") && i.occupation =="architecte"){
                    bArchi.push(delib)
                    b.push(delib)
                }
                else if (i.persName.includes("Boissonnade") || i.persName.includes("Boissonade")){
                    bAutre.push(delib)
                    b.push(delib)
                }
            })
            
        }
    
    }



});

console.log("Délibérations en Aveyron: "+aveyron)
console.log("Boissonnade architecte en Aveyron: " + bArchiA.length)
console.log("Boissonnade (ingé ou autre) en Aveyron: " + bAutreA.length)
console.log("Boissonnade architecte ailleurs: " + bArchi.length)
console.log("Boissonnade (ingé ou autre) ailleurs: " + bAutre.length)
console.log("Boissonnade total: " + b.length)

//indexe les délibérations par type d'intervention
var result={}

//nombre et nature des interventions de Boissonnade comme architecte en Avyron
bArchiA.forEach(d => {
    var type = d.projectGenre;
    if (!result[type])
        result[type]={ 
            name: type,
            delib: [] 
        }
    result[type].delib.push(d)
})

//compte les délibérations dans chaque type
for (r in result){
    var c = result[r].delib.length;
    result[r].count = c; 
}

//classe les résultats de chaque type d'intervention par date
var sorted = sortBy(result, d => d.delib[0].meeting);


fs.writeJSONSync('../../data/boudonSzambien/q4.json', sorted, {spaces: 2, encoding: 'utf8'});


