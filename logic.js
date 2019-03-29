// Function to determine marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 30000;
}

// Function to determine marker color based on magnitude
function getColor(magnitude) {
  return magnitude > 5 ? '#800026' :
          magnitude > 4  ? '#BD0026' :
          magnitude > 3  ? '#E31A1C' :
          magnitude > 2  ? '#FC4E2A' :
          magnitude > 1   ? '#FD8D3C' :
                    '#FFEDA0';
}

// Creating map object
var myMap = L.map("map", {
  center: [38.0902, -95.7129],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Link to GeoJSON
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function(response) {

  console.log(response.features);
  data = response.features

  // add circles and correspond them to mag size
  var markerArray = [];

  for (var i = 0; i < data.length; i++) {
    var location = data[i].geometry;

    if (location) {
      //L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
      markerArray.push(
        L.circle([location.coordinates[1], location.coordinates[0]], {
          stroke: false,
          fillOpacity: 0.75,
          color: "white",
          fillColor: getColor(data[i].properties.mag),
          radius: markerSize(data[i].properties.mag)
        }));
    }
  };
  L.layerGroup(markerArray).addTo(myMap);

  // make legend
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our magnitude intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style=\"background:' + getColor(grades[i] + 1) + '\"></li> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

  // var legend = L.control({position: 'bottomright'});
  // legend.onAdd = function (map) {

  // var div = L.DomUtil.create('div', 'info legend');
  // labels = ['<strong>Categories</strong>'],
  // categories = ['Road Surface','Signage','Line Markings','Roadside Hazards','Other'];

  // for (var i = 0; i < categories.length; i++) {

  //         div.innerHTML += 
  //         labels.push(
  //             '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
  //         (categories[i] ? categories[i] : '+'));

  //     }
  //     div.innerHTML = labels.join('<br>');
  // return div;
  // };
  // legend.addTo(myMap);

// // Set up the legend
// var legend = L.control({ position: "bottomright" });
// legend.onAdd = function() {
//   var div = L.DomUtil.create("div", "info legend");
//   var limits = geojson.options.limits;
//   var colors = geojson.options.colors;
//   var labels = [];

//   // Add min & max
//   var legendInfo = "<h1>Median Income</h1>" +
//     "<div class=\"labels\">" +
//       "<div class=\"min\">" + limits[0] + "</div>" +
//       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//     "</div>";

//   div.innerHTML = legendInfo;

  // limits.forEach(function(limit, index) {
  //   labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  // });

//   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//   return div;
// };

});