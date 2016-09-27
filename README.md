## A few words on diversity in tech

I need to take some of your time. I can't believe we let shit like [the Kathy Sierra incident](http://www.wired.com/2014/10/trolls-will-always-win/) or [what happened to Brianna Wu](https://twitter.com/Spacekatgal/status/520739878993420290) happen over and over again. I can't believe we, the open source community, let [sexist, misogynous shit happen over and over again](http://geekfeminism.wikia.com/wiki/Timeline_of_incidents).

I strongly believe that it is my &mdash; and your &mdash; duty to make the open source community, as well as the tech community at large, a community where everyone feel welcome and is accepted. At the very minimum, that means making sure the community and its forums both _are_ safe, and are perceived as safe. It means being friendly and inclusive, even when you disagree with people. It means not shrugging off discussions about sexism and inclusiveness with [handwaving about censorship and free speech](https://josm.openstreetmap.de/ticket/10568). For a more elaborate document on what that means, [the NPM Code of Conduct](http://www.npmjs.com/policies/conduct) is a good start, [Geek Feminism's resources for allies](http://geekfeminism.wikia.com/wiki/Resources_for_allies) contains much more.

While I can't force anyone to do anything, if you happen to disagree with this, I ask of you not to use any of the open source I have published. Nor am I interested in contributions from people who can't accept or act respectfully towards other humans regardless of gender identity, sexual orientation, disability, ethnicity, religion, age, physical appearance, body size, race, or similar personal characteristics. If you think feminism, anti-racism or the LGBT movement is somehow wrong, disturbing or irrelevant, I ask you to go elsewhere to find software.

Leaflet Control Geocoder [![NPM version](https://img.shields.io/npm/v/leaflet-control-geocoder.svg)](https://www.npmjs.com/package/leaflet-control-geocoder) ![Leaflet 1.0.0 compatible!](https://img.shields.io/badge/Leaflet%201.0.0-%E2%9C%93-1EB300.svg?style=flat)
=============================

A simple geocoder for [Leaflet](http://leafletjs.com/) that by default uses [OSM](http://www.openstreetmap.org/)/[Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim).

The plugin supports many different data providers:

* [OSM](http://www.openstreetmap.org/)/[Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim)
* [Bing Locations API](http://msdn.microsoft.com/en-us/library/ff701715.aspx)
* [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/)
* [Mapbox Geocoding](https://www.mapbox.com/developers/api/geocoding/)
* [MapQuest Geocoding API](http://developer.mapquest.com/web/products/dev-services/geocoding-ws)
* [What3Words](http://what3words.com/)
* [Photon](http://photon.komoot.de/)
* [Mapzen Search](https://mapzen.com/projects/search)
* [HERE Geocoder API] (https://developer.here.com/rest-apis/documentation/geocoder/topics/overview.html)

The plugin can easily be extended to support other providers. Current extensions:

* [DAWA Geocoder](https://github.com/kjoller/leaflet-control-geocoder-dawa/tree/new) - support for Danish Address Web API by [Niels Kjøller Hansen](https://github.com/kjoller)

See the [Leaflet Control Geocoder Demo](http://perliedman.github.com/leaflet-control-geocoder/).

# Usage

[Download latest release](https://github.com/perliedman/leaflet-control-geocoder/releases). Load the CSS and Javascript, located in
the `dist` folder:

```HTML
<link rel="stylesheet" href="Control.Geocoder.css" />
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
a marker at its location. This can be customized by listening to the control's `markgeocode`
event. To remove the control's default handler for marking a result, set the option
`defaultMarkGeocode` to `false`.

For example:

```javascript
var geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    })
    .on('markgeocode', function(e) {
        var bbox = e.geocode.bbox;
        var poly = L.polygon([
             bbox.getSouthEast(),
             bbox.getNorthEast(),
             bbox.getNorthWest(),
             bbox.getSouthWest()
        ]).addTo(map);
        map.fitBounds(poly.getBounds());
    })
    .addTo(map);
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
| geocodingQueryParams       | Object          |  {} | Additional URL parameters (strings) that will be added to geocoding requests; can be used to restrict results to a specific country for example, by providing the [`countrycodes`](http://wiki.openstreetmap.org/wiki/Nominatim#Parameters) parameter to Nominatim |
| reverseQueryParams       | Object          |  {} | Additional URL parameters (strings) that will be added to reverse geocoding requests |
| htmlTemplate     | function        | special           | A function that takes an GeocodingResult as argument and returns an HTML formatted string that represents the result. Default function breaks up address in parts from most to least specific, in attempt to increase readability compared to Nominatim's naming

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
| html       | String           | (optional) HTML formatted representation of the name |
