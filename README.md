Leaflet Control Bing Geocoder
=============================

# What is it ?
A simple geocoder that uses Bing to locate places.

# How to use ?
```javascript
var cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
    cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {attribution: cloudmadeAttribution});

var map = new L.Map('map').addLayer(cloudmade).setView(new L.LatLng(48.5, 2.5), 15);

var bingGeocoder = new L.Control.BingGeocoder('AsaKzgbo2GW8wrcv0mLCyVvEx2Q8V1N54Gpmizw-fzHIKOAjAMMy4TdNfKdS71vs');

map.addControl(bingGeocoder);
```

# What are the options ?
You can specify an options object as a second argument of L.Control.BingGeocoder.
```javascript
var options = {
    collapsed: true, /* Whether its collapsed or not */
    position: 'topright', /* The position of the control */
    text: 'Locate', /* The text of the submit button */
    callback: function (results) {
        var bbox = results.resourceSets[0].resources[0].bbox,
            first = new L.LatLng(bbox[0], bbox[1]),
            second = new L.LatLng(bbox[2], bbox[3]),
            bounds = new L.LatLngBounds([first, second]);
        this._map.fitBounds(bounds);
    }
};
```