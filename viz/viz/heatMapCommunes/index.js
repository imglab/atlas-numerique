
const createMap = (domNode, data) => {
    const map = L.map(document.querySelector(domNode)).setView([46.279229, 2.454071], 6);
    const tiles = L.tileLayer(
        'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
    tiles.addTo(map);
    //L.geoJSON(geojson).addTo(map);
    const addresses = data.map(p => [p.geometry.coordinates[1], p.geometry.coordinates[0], p.properties.numDelib]);
    const heat = L.heatLayer(addresses, {minOpacity: 0.1}).addTo(map);
    return map
}


Promise.all([
    d3.json('../../data/geoCommunesConbavil.json'),
    d3.json('../../data/geoCommunesConbavil-E.json')
]).then(([json, jsonE]) => {
    console.log('data');
    var data = json.concat(jsonE);
    console.log(data.length);
    createMap("#carte", data);
})

/*
https://wiki.openstreetmap.org/wiki/FR:Serveurs/tile.openstreetmap.fr



*/