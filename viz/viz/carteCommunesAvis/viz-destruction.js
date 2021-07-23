const destruction = d3.select("#destruction");
var button = `
    <button class="type" id="prison" type="buton">Que les prisons</button>
    <button id="reset" type="button">Tout sélectionner</button>
    <button id="deselect" type="button">Désélectionner tout</button>
    `
    // <button id="paris" type="button">Detruire Paris</button>
destruction.html(button)

function destroy(){
    console.log("destruction Paris")
    window.hermes.emit('destroy', {nom: "Paris"})
}

function filter(){
    window.hermes.emit('filtre', this.id)
}

function reset(){
    window.hermes.emit('reset')
}

function deselect(){
    window.hermes.emit('deselect')
}

// d3.select("#paris").on("click", destroy);
d3.select(".type").on("click", filter)
d3.select("#reset").on("click", reset)
d3.select("#deselect").on("click", deselect)

