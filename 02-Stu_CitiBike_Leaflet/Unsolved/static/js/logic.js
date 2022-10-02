var newYorkCoords = [40.73, -74.0059];
var mapZoomLevel = 12;

// Create the createMap function.
function createMap(bikeLayer)
{

  // Create the tile layer that will be the background of our map.
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object to hold the streetmap layer.
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the bikeStations layer.
  var overlayMaps = {
    "Bike Stations": bikeLayer
  };

  // Create the map object with options.
  var map = L.map("map-id", {
    center: newYorkCoords,
    zoom: mapZoomLevel,
    layers: [streetmap, bikeLayer]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

// Create the createMarkers function.
function createMarkers(data)
{
  console.log(data);

  // Pull the "stations" property from response.data.
  // creates an array of stations that we can use to get the data that we need
  var stations = data.data.stations;

  // Initialize an array to hold the bike markers.
  var bikeMarkers = [];

  // Loop through the stations array.
  for(var i = 0; i < stations.length; i++)
  {
    // For each station, create a marker, and bind a popup with the station's name.
    var bikeStation = L.marker([stations[i].lat, stations[i].lon])
      .bindPopup(`<h2>ID: ${stations[i].station_id} - ${stations[i].name}</h2><hr><b>Capacity:</b> ${stations[i].capacity}`);

    // Add the marker to the bikeMarkers array.
    bikeMarkers.push(bikeStation);
  }
  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  var bikeLayer = L.layerGroup(bikeMarkers);

  createMap(bikeLayer);
}

// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(
  createMarkers
);