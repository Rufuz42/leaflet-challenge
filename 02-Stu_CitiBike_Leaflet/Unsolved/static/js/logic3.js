var newYorkCoords = [40.73, -74.0059];
var mapZoomLevel = 12;

// Create the createMap function.
function createMap(highLayer, medLayer, lowLayer)
{

  // Create the tile layer that will be the background of our map.
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

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

  // Create a baseMaps object to hold the streetmap layer.
  var baseMaps = {
    "Street Map": streetmap,
    "Grayscale Map": grayscale,
    "Watercolor Map": waterColor
  };

  // Create an overlayMaps object to hold the bikeStations layer.
  var overlayMaps = {
    "High Capacity Stations": highLayer,
    "Medium Capacity Stations": medLayer,
    "Low Capacity Stations": lowLayer
  };

  // Create the map object with options.
  var map = L.map("map-id", {
    center: newYorkCoords,
    zoom: mapZoomLevel,
    layers: [streetmap, highLayer, medLayer, lowLayer]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

// Create the createMarkers function.
function createMarkers(data)
{
  //console.log(data);

  // Pull the "stations" property from response.data.
  // creates an array of stations that we can use to get the data that we need
  var stations = data.data.stations;

  // Initialize an array to hold the bike markers.
  //var bikeMarkers = [];
  var highCap = []; // array for high capacity stations - over 40 bikes
  var medCap = []; // array for medium capacity stations - 25 - 40 bikes
  var lowCap = []; // array for low capacity stations - under 25 bikes

  // Loop through the stations array.
  for(var i = 0; i < stations.length; i++)
  {
    console.log(stations[i].capacity);

    // For each station, create a marker, and bind a popup with the station's name.
    // var bikeStation = L.marker([stations[i].lat, stations[i].lon])
    //   .bindPopup(`<h2>ID: ${stations[i].station_id} - ${stations[i].name}</h2><hr><b>Capacity:</b> ${stations[i].capacity}`);

    // change the marker size based on the capacity
    var markerRadius = stations[i].capacity * 10;
    var markerColor;

    if(stations[i].capacity > 40)
        markerColor = "green";
    else if(stations[i].capacity >= 25)
        markerColor = "orange";
    else
        markerColor = "red";

    var bikeStation = L.circle([stations[i].lat, stations[i].lon], {
        fillOpacity: .30,
        color: markerColor,
        fillColor: markerColor,
        radius: markerRadius,
        weight: 1
    })
    .bindPopup(`<h2>ID: ${stations[i].station_id} - ${stations[i].name}</h2><hr><b>Capacity:</b> ${stations[i].capacity}`);

    // Add the marker to the bikeMarkers array.
    // bikeMarkers.push(bikeStation);

    // populate array based on capacity level
    if(stations[i].capacity > 40)
        highCap.push(bikeStation);
    else if(stations[i].capacity >= 25)
        medCap.push(bikeStation);
    else
        lowCap.push(bikeStation);
  }
  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  //var bikeLayer = L.layerGroup(bikeMarkers);
  var highLayer = L.layerGroup(highCap);
  var medLayer = L.layerGroup(medCap);
  var lowLayer = L.layerGroup(lowCap);

  //createMap(bikeLayer);
  createMap(highLayer, medLayer, lowLayer);
}

// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(
  createMarkers
);