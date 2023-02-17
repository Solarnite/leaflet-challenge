// Earthquakes URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Request on URL to retrieve earthquake data.features
d3.json(url).then(function(data)  {
    createMaps(data);
});

function markerSize(magnitude) {
    return magnitude * 20000;
}

function markerColor(depth) {
    switch(true) {
        case depth > 90:
            return "#ff5f65";
        case depth > 70:
            return "#fca35d";
        case depth > 50:
            return "#fdb72a";
        case depth > 30:
            return "#f7db11";
        case depth > 10:
            return "#dcf400";
        default:
            return "#a3f600";
    };
}

function createMaps(earthquake) {
    // Creation of tilelayer
    let street = L.tileLayer ('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Creation of map object with layers
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 2,
        layers: street
    });

    // loop
        for (let i = 0; i < earthquake.features.length; i++) {
            // Define some variables for Earthquake Data properties 
            let features = earthquake.features[i];
            let coordinates = features.geometry.coordinates;
            let latitude = coordinates[1];
            let longitude = coordinates[0];
            let depth = coordinates[2];

            // Define magnitude and place
            let properties = features.properties;
            let magnitude = properties.mag;
            let place = properties.place;

            // Creation of Markers
            markers = L.circle([latitude, longitude], {
                radius: markerSize(magnitude),
                color: "000000",
                opacity: 0.5,
                weight: 1,
                fillColor: markerColor(depth),
                fillOpacity: 0.5
            }).bindPopup(`<h1>${place}</h1><br/>Magnitude: ${magnitude}<br/>Depth: ${depth}`).addTo(myMap);

        }

    // Legend
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "legend");
        let limits = [0, 10, 30, 50, 70, 90];
        div.innerHTML = "<h3 style = 'text-align: center'>Depth in km</h3>"
    
        for (let i = 0; i < limits.length; i++) {
            div.innerHTML += 
            '<i style ="background:' + markerColor(limits[i] + 1) + '"></i> ' +
            limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // Add legend to map
    legend.addTo(myMap);
}

