Leaflet Control Geocoder [![NPM version](https://badge.fury.io/js/leaflet-control-geocoder.png)](http://badge.fury.io/js/leaflet-control-geocoder)
=============================

A simple geocoder for [Leaflet](http://leafletjs.com/) that by default uses [OSM](http://www.openstreetmap.org/)/[Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim) to locate places, but also supports [Bing Locations API](http://msdn.microsoft.com/en-us/library/ff701715.aspx) and can easily be extended to support other providers.

See the [Leaflet Control Geocoder Demo](http://perliedman.github.com/leaflet-control-geocoder/).

# Usage

Load the CSS and Javascript:

```HTML
<link rel="stylesheet" href="../Control.Geocoder.css" />
<script src="Control.Geocoder.js"></script>
```

Add the control to a map instance:

```javascript
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
L.Control.geocoder().addTo(map);
```

# Customizing

By default, when a geocoding result is found, the control will center the map on it and place
a marker at its location. This can be customized by overwriting the control's ```markGeocode```
function, to perform any action desired.

For example:

```javascript
var geocoder = L.Control.geocoder().addTo(map);

geocoder.markGeocode = function(result) {
    var bbox = result.bbox;
    L.polygon([
         bbox.getSouthEast(),
         bbox.getNorthEast(),
         bbox.getNorthWest(),
         bbox.getSouthWest()
    ]).addTo(map);
};
```

This will add a polygon representing the result's boundingbox when a result is selected.

# API

## L.Control.Geocoder

This is the geocoder control. It works like any other Leaflet control, and is added to the map.

### Constructor

```js
L.Control.Geocoder(options)
```

### Options

| Option          |  Type            |  Default          | Description |
| --------------- | ---------------- | ----------------- | ----------- |
| collapsed       |  Boolean         |  true             | Collapse control unless hovered/clicked |
| position        |  String          |  "topright"       | Control [position](http://leafletjs.com/reference.html#control-positions) |
| placeholder     |  String          |  "Search..."      | Placeholder text for text input
| errorMessage    |  String          |  "Nothing found." | Message when no result found / geocoding error occurs |
| geocoder        |  IGeocoder       |  new L.Control.Geocoder.Nominatim() | Object to perform the actual geocoding queries |
| showResultIcons |  Boolean         |  false            | Show icons for geocoding results (if available); supported by Nominatim |

### Methods

| Method                                |  Returns            | Description       |
| ------------------------------------- | ------------------- | ----------------- |
| markGeocode(<GeocodingResult> result) |  this               | Marks a geocoding result on the map |

## L.Control.Geocoder.Nominatim

Uses [Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim) to respond to geocoding queries. This is the default
geocoding service used by the control, unless otherwise specified in the options. Implements ```IGeocoder```.

Unless using your own Nominatim installation, please refer to the [Nominatim usage policy](http://wiki.openstreetmap.org/wiki/Nominatim_usage_policy).

### Constructor

```js
L.Control.Geocoder.Nominatim(options)
```

## Options

| Option          |  Type            |  Default          | Description |
| --------------- | ---------------- | ----------------- | ----------- |
| serviceUrl       | String          |  "http://nominatim.openstreetmap.org/" | URL of the service |

## L.Control.Geocoder.Bing

Uses [Bing Locations API](http://msdn.microsoft.com/en-us/library/ff701715.aspx) to respond to geocoding queries. Implements ```IGeocoder```.

Note that you need an API key to use this service.

### Constructor

```
L.Control.Geocoder.Bing(<String> key)
```

## IGeocoder

An interface implemented to respond to geocoding queries.

### Methods

| Method                                |  Returns            | Description       |
| ------------------------------------- | ------------------- | ----------------- |
| geocode(<String> query, callback, context) | GeocodingResult[] | Performs a geocoding query and returns the results to the callback in the provided context |
| reverse(<L.LatLng> location, <Number> scale, callback, context) | GeocodingResult[] | Performs a reverse geocoding query and returns the results to the callback in the provided context |

## GeocodingResult

An object that represents a result from a geocoding query.

### Properties

| Property   | Type             | Description                           |
| ---------- | ---------------- | ------------------------------------- |
| name       | String           | Name of found location                |
| bounds     | L.LatLngBounds   | The bounds of the location            |
| center     | L.LatLng         | The center coordinate of the location |
| icon       | String           | URL for icon representing result; optional |
