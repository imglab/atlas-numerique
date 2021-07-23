const fs = require('fs-extra');
const conbavil = JSON.parse(fs.readFileSync('../../data/conbavil.json', {encoding: 'utf8'}));

var indexDate={};
var result = [];

//crée un index par année 
conbavil.forEach(delib => {
       var an = delib.meeting.substring(0,4)
       //si l'année n'existe pas encore dans l'annexe, initialiser une entrée pour cette année
       if (!indexDate[an]){
              indexDate[an] = {
                  annee: an,
                  types: [],
                  total: 0
              }
       }
       //on ne s'intéresse qu'aux délibérations dont le type d'intervention est défini
       if (delib.projectGenre) {            
        //index des types d'intervention
        var type = delib.projectGenre;
        //il peut y avoir plusieurs types
        type.forEach( t => {
            var trouve = false;


    //système indexation du 2nd degré ne fonctionne pas!

            //passer au travers des types pour l'année
            indexDate[an].types.forEach(ti => {
                //si le type correspond, incrémenter la valeur de 1
                //mettre trouve à vrai
                if(ti.type == t){
                    trouve = true;
                    this.value += 1;
                }
            })
            // si trouvé = faux, on n'a pas trouvé, il faut créer une entrée
            if (trouve = false){
                indexDate[an].types[ti].push({
                    type: t,
                    value: 1,
                })
            }

            
        })

        //comptage       
        indexDate[an].total +=1;
       }
    
});    
console.log(indexDate)

for (a in indexDate){
    var r = {
        annee: indexDate[a].annee,
        total: indexDate[a].total
    }

    indexDate[a].types.forEach( t=> {
        

    })
    result.push(r)
}


fs.writeJSONSync('../../data/boudonSzambien/q5-2.json', result, {spaces: 2, encoding: 'utf8'});
