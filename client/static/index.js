$(document).ready(function() {
  var map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('http://{s}.tiles.mapbox.com/v3/aavikko.icpmacma/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
  }).addTo(map);

  var lastToken = null;

  function addToMap(tweet) {
    // Flip coordinate order
    for (var i = 0; i < tweet.geo.coordinates.length; i += 2) {
      var tmp = tweet.geo.coordinates[i];
      tweet.geo.coordinates[i] = tweet.geo.coordinates[i+1];
      tweet.geo.coordinates[i+1] = tmp;
    }
    var geojsonFeature = {
      "type": "Feature",
      "properties": {
        "name": tweet.user.name,
        "screen_name": tweet.user.screen_name,
        "text": tweet.text
      },
      "geometry": tweet.geo
    };
    var marker = L.geoJson(geojsonFeature).addTo(map);
    console.log(tweet);
    marker.bindPopup(
      "<div class='tweet-popup'>" +
        "<div class='user'>" +
          "<img src="+tweet.user.profile_image_url_https+">" +
          "<div class='name'>"+tweet.user.name+"</div>" +
          "<div class='screen_name'>"+tweet.user.screen_name+"</div>" +
        "</div>" +
        "<div class='content'>"+tweet.text+"</div>"+
      "</div>");
  }

  function retrieveResults() {
    $.ajax('/api/tweets', {
      data: {
        token: lastToken
      }
    }).done(function(data) {
      if (data.length > 0) {
        lastToken = data[data.length-1]._id;
        for (var i = 0; i < data.length; i++) {
          addToMap(data[i]);
        }
      }
    }).always(function() {
      setTimeout(retrieveResults, 5000);
    })
  }

  retrieveResults();

  // The world
  map.fitBounds([
    [47, -122],
    [34, 151]
    ]);
});
