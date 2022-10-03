// Start with the tile layers that need to be made
var USGS_USImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// More layers
// grayscale layer
var grayscale = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});
// water color layer
var waterColor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
});

// Basemaps object
var baseMaps = {
    Grayscale: grayscale,
    "Water Colors": waterColor,
    "USGS Topography": USGS_USImageryTopo,
    "Open Street Map Default": OpenStreetMap_Mapnik,
    Default: Stadia_AlidadeSmoothDark
}

// Make the map object
var map = L.map("map", {
    center: [40.7608, -111.8910],
    zoom: 5,
    layers: [Stadia_AlidadeSmoothDark, grayscale, waterColor, USGS_USImageryTopo, OpenStreetMap_Mapnik]
});

// Add default map to map
// This doesn't work after adding the base maps
// Stadia_AlidadeSmoothDark.addTo(map);

// Layer controls
// L.control
//     .layers(baseMaps)
//     .addTo(map);


// Tectonic plate call
var tectonicPlates = new L.layerGroup();

// Call the API for tectonic plate info
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
.then(function(plateData){
    // Console log to see if the data loads up
    // console.log(plateData)

    // load the data with geojson
    L.geoJson(plateData, {
        // Add style to see the lines
        color: "#7B68EE",
        weight: 3
    }).addTo(tectonicPlates);
});

// Add tectonic plates to the map
tectonicPlates.addTo(map);

// Earthquake overlay info
var earthquakes = new L.layerGroup();

// Get earthquake data
// Call the API
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(
    function(earthquakeData){
        // Make sure the earthquake data loads
        // console.log(earthquakeData);

        // Make circles that reflects radius = mag, color = depth
        // Choose the color function
        function colorChoice(depth){
            if (depth > 90)
                return "#8B0000";
            else if (depth > 70)
                return "#FF4500";
            else if (depth > 50)
                return "#FFA500"
            else if (depth > 30)
                return "#FFEC8B"
            else if (depth > 10)
                return "#3CB371";
            else 
                return "#006400"
        }

        // Determine radius size
        function radiusSize(mag){
            if (mag == 0)
                return 1;
            else
                return mag * 3;
        }

        // Style the earthquake circles on the map
        function style(feature){
            return {
                opacity: 0.45,
                fillOpacity: 0.45,
                fillColor: colorChoice(feature.geometry.coordinates[2]),
                color: colorChoice(feature.geometry.coordinates[2]),
                radius: radiusSize(feature.properties.mag),
                weight: 0.5
            }
        }

        // add geojson to earthquake layers
        L.geoJson(earthquakeData, {
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            // Set the marker styles
            style: style,
            // Popups
            onEachFeature: function(feature, layer){
                layer.bindPopup(`Magnidtude: <b>${feature.properties.mag}</b><br>
                                Depth: <b>${feature.geometry.coordinates[2]}</b><br>
                                Location: <b>${feature.properties.place}</b>`)
            }
        }).addTo(earthquakes);
    }
)

earthquakes.addTo(map);

// Overlap to allow for tectonic plate toggling
var overlayMaps = {
    "Tectonic Plates": tectonicPlates,
    Earthquakes: earthquakes
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);

// make a variable for the legend and position it in the bottom right of the screen
var legend = L.control(
    {
        position: "bottomright"
    }
  );
  // add the properties for the legend
  legend.onAdd = function()
  {
    // create a div for the legend
    var div = L.DomUtil.create("div", "info legend");
    // console.log(div);
    var intervals = [-10, 10, 30, 50, 70, 90]; // this array represents the intervals
                                 // for the earthquake magnitude depths
    // this array represents the colors that will be associated with the intervals
    var colors = [
        "#006400",
        "#3CB371",
        "#FFEC8B",
        "#FFA500",
        "#FF4500",
        "#8B0000"
    ];
    // use a loop to generate labels within the div
    // div starts as empty, then is populated with the data from the arrays
    for(var i = 0; i < intervals.length; i++)
    {
        // display the colors and the interval values
        //console.log(colors[i]);
        //console.log(intervals[i]);
        // use .innerHTML to set the value of the color and the text for the interval
        div.innerHTML += "<i style='background: " + colors[i] + "'></i>"
        + intervals[i]
        + (intervals[i + 1] ? " &ndash; " + intervals[i+1] + " Depth<br>" :
        "+ Depth");
    }
    return div;
  };
  // add the legend to the map
legend.addTo(map);