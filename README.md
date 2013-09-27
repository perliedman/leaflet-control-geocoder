Leaflet Control Geocoder
=============================

# What is it ?
A simple geocoder that by default uses [OSM](http://www.openstreetmap.org/)/[Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim) to locate places, but also supports [Bing Locations API](http://msdn.microsoft.com/en-us/library/ff701715.aspx) and can easily be extended to support other providers.

# How to use it ?
```javascript
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
new L.Control.Geocoder().addTo(map);
```

# What are the options ?
You can specify an options object as a second argument of L.Control.Geocoder.
```javascript
var options = {
    collapsed: true, /* Whether its collapsed or not */
    position: 'topright', /* The position of the control */
    text: 'Locate', /* The text of the submit button */
    placeholder: 'Search...', /* The placeholder text in the search field */
    errorMessage: 'Nothing found.', /* Text to display when no matches are found. */
    callback: function (results) {
        var bbox = results.resourceSets[0].resources[0].bbox,
            first = new L.LatLng(bbox[0], bbox[1]),
            second = new L.LatLng(bbox[2], bbox[3]),
            bounds = new L.LatLngBounds([first, second]);
        this._map.fitBounds(bounds);
    }
};
```