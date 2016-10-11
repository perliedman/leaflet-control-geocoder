var L = require('leaflet');
require('../dist/Control.Geocoder');

var map = L.map('map').setView([0, 0], 2),
    geocoder = L.Control.Geocoder.mapzen('search-DopSHJw'),
    control = L.Control.geocoder({
        geocoder: geocoder
    }).addTo(map),
    marker;

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('click', function(e) {
    geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function(results) {
        var r = results[0];
        if (r) {
            if (marker) {
                marker.
                    setLatLng(r.center).
                    setPopupContent(r.html || r.name).
                    openPopup();
            } else {
                marker = L.marker(r.center).bindPopup(r.name).addTo(map).openPopup();
            }
        }
    })
});

