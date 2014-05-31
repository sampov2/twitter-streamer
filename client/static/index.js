$(document).ready(function() {
  console.log('it\'s alive ..');
  var map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('http://{s}.tiles.mapbox.com/v3/aavikko.icpmacma/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
  }).addTo(map);
  var marker = L.marker([51.5, -0.09]).addTo(map);
  var circle = L.circle([51.508, -0.11], 500, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
  }).addTo(map);
  //map.locate({setView: true, maxZoom: 16});
});
