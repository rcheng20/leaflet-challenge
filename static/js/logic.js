var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data) {
        console.log(data)
        createFeatures(data.features);
    });

function createFeatures(earthquake_info){
    function Radius(mag){
        return mag * 3
    }
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
            <p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    };
}

function getColor(feature){
    let edepth = feature.geometry.coordinates[2];
    let ecolor = "#e5f5e0"
    if      ( edepth > 90) { ecolor = "#238b45" }
    else if ( edepth > 70) { ecolor = "#41ab5d"}
    else if ( edepth > 50) { ecolor = "#74c476" }
    else if ( edepth > 30) { ecolor = "#a1d99b" }
    else if ( edepth > 10) { ecolor = "#c7e9c0" }
    return(ecolor)
    }

function pointToLayer (feature, latlng) {
    return new L.CircleMarker (latlng,  
                                {   radius : getRadius(feature.properties.mag),
                                    color : 'green',
                                    fillColor : getColor(feature),
                                    fillOpacity : 1,
                                    weight : 1 

    }
    );
}
var quakes = L.geoJSON(earthquake_info, {
    pointToLayer : pointToLayer,
    onEachFeature : onEachFeature
});
createMap(quakes);

function createMap(quakes){

var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});



var baseMap = {
"Street Map": street
};

var overlayMap = {
Earthquakes: quakes
};

var eMap = L.map("map", {
center: [ 38.50, -97.20 ],
zoom: 4,
layers: [street, quakes]
});


L.control.layers(baseMap, overlayMap
, {
collapsed: false
}).addTo(eMap);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
var div = L.DomUtil.create("div", "legend");
div.innerHTML += "<b>Depth</b><br>";
div.innerHTML += '<i style="background: #e5f5e0"></i><span>&lt;10</span><br>';
div.innerHTML += '<i style="background: #c7e9c0"></i><span>10-30</span><br>';
div.innerHTML += '<i style="background: #a1d99b"></i><span>30-50</span><br>';
div.innerHTML += '<i style="background: #74c476"></i><span>50-70</span><br>';
div.innerHTML += '<i style="background: #41ab5d"></i><span>70-90</span><br>';
div.innerHTML += '<i style="background: #238b45"></i><span>&gt;90</span><br>';
return div;
};

legend.addTo(eMap);
}