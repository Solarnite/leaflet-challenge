// Earthquakes URL
const URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Request on URL to retrieve earthquakeData.features
d3.json(URL).then(function(earthquakeData)  {
    createMaps(earthquakeData.features);
});

function markerSize(magnitude) {
    return magnitude * 4;
};

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
};

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

    // Creation of GeoJSON layer of data
    let features = earthquakeData.features;
    let depth_array = [];

    // loop
    for (let i = 0; i < earthquake.length; i++) {

        // Define some variables for Earthquake Data properties 
        let coordinates = features[i].geometry.coordinates;
        let latitude = coordinates[1];
        let longitude = coordinates[0];

        // Define depth then push to array
        let depth = coordinates[2];
        depth_array.push(depth);

        let properties = features[i].properties;

        // Define magnitude and place
        let magnitude = properties.mag;
        let place = properties.place;

        // Creation of Markers
        markers = L.markerCircle([latitude, longitude], {
            radius: markerSize(magnitude),
            color: "000000",
            opacity: 1,
            weight: 1,
            fillColor: markerColor(depth),
            fillOpacity: 1
        }).bindPopup(`<h3>${place}</h3><br/>Magnitude: ${magnitude}<br/>Depth: ${depth}`).addTo(myMap);

    }

    // Legend
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        let limits = [-10, 10, 30, 50, 70, 90];
        div.innerHTML = "<h3 style = 'text-align: center'>Depth in km</h3>"
    
        for (let i = 0; i < limits.length; i++) {
            div.innerHTML += 
            '<i style ="background:' + markerColor(limits[i] + 1) + '"></i> ' +
            limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
        };
        return div;
    };

    // Add legend to map
    legend.addTo(myMap);
}