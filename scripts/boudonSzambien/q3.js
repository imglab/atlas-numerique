const fs = require('fs-extra');
const conbavil = JSON.parse(fs.readFileSync('../../data/conbavil.json', {encoding: 'utf8'}));

var chalgrin=[];

conbavil.forEach(delib => {
    //délibérations qui ont Chalgrin comme auteur du rapport
    //utiliser .includes() car il y a parfois plusieurs auteurs
    if (delib.reportAuthor && delib.reportAuthor.includes("Chalgrin") ){
        chalgrin.push(delib)
    }
});

console.log(chalgrin.length)

var result=[];
var id=0;
var date={};
// liste des délibérations dont Chalgrin était le rapporteur
chalgrin.forEach( d =>{
    id++;
    var entry={};
    entry.id = id;
    entry.title = d.title;
    entry.conbavil = d.id.substring(8); 
    entry.date = d.meeting;
    entry.rapporteur = d.reportAuthor;
    result.push(entry)


    //étude de la liste

    //par année
    var an = d.meeting.substring(0,4)
    if (!date[an])
        date[an] = {
            annee: an,
            value: 0
        }
    date[an].value += 1;

    //seul ou sinon, combien d'auteurs
    //initialise les compteurs à 0
    if (!date[an].seul)
        date[an].seul = 0;
    if (!date[an].deux)
            date[an].deux = 0;
    if (!date[an].plusieurs)
        date[an].plusieurs = 0;

    //élégante solution pour trouver le nombre d'individu: soustrction entre la chaîne de caractères originale et une où l'on a supprimé tous les points virgule. 
    //si nbr = 0, alors il n'y avait pas de ; et donc 1 seul auteur
    //si nbr = 1, alors il y avait deux auteurs
    //si nbr > 1, alors il y avait plus que deux auteurs
    var txt = d.reportAuthor;
    var nbr = txt.length - txt.replace(/;/g, "").length;
    
    if (nbr == 0 ){
        //pas de point virgule, normalement (= système de vérification)
        if (!d.reportAuthor == "Chalgrin")
            console.log("erreur d'algorithme: "+ d.reportAuthor + " " + txt)
        date[an].seul += 1;
    } else if (nbr == 1){
        // un seul point virgule = 2 auteurs 
        date[an].deux += 1;
    } else if (nbr > 1) {
        //plus que 2 auteurs
        date[an].plusieurs +=1;
    } else {
        console.log("erreur alogrithme "+ d.reportAuthor + " " + txt )
    }

});

//parcourir les dates et afficher le nombre de délibérations (où Chalgrin était rapporteur)
for (d in date){
    console.log(date[d].annee+" = seul: "+ date[d].seul + " , à deux: " + date[d].deux + ", plusieurs: " + date[d].plusieurs + ", TOTAL: " + date[d].value) 
}


fs.writeJSONSync('../../data/boudonSzambien/q3.json', result, {spaces: 2, encoding: 'utf8'});
