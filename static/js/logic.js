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
L.control
    .layers(baseMaps)
    .addTo(map);

// Layer controls
// L.control
//     .layers(baseMaps, {
//         collapsed: false
//     }).addTo(map);

// L.control.layers(baseMaps, {
//     collapsed: false
// }).addTo(map);

//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(map);

// Tectonic plate call
