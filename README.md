## A few words on diversity in tech

I need to take some of your time. I can't believe we let shit like [the Kathy Sierra incident](http://www.wired.com/2014/10/trolls-will-always-win/) or [what happened to Brianna Wu](https://twitter.com/Spacekatgal/status/520739878993420290) happen over and over again. I can't believe we, the open source community, let [sexist, misogynous shit happen over and over again](http://geekfeminism.wikia.com/wiki/Timeline_of_incidents).

I strongly believe that it is my &mdash; and your &mdash; duty to make the open source community, as well as the tech community at large, a community where everyone feel welcome and is accepted. At the very minimum, that means making sure the community and its forums both _are_ safe, and are perceived as safe. It means being friendly and inclusive, even when you disagree with people. It means not shrugging off discussions about sexism and inclusiveness with [handwaving about censorship and free speech](https://josm.openstreetmap.de/ticket/10568). For a more elaborate document on what that means, [the NPM Code of Conduct](http://www.npmjs.com/policies/conduct) is a good start, [Geek Feminism's resources for allies](http://geekfeminism.wikia.com/wiki/Resources_for_allies) contains much more.

While I can't force anyone to do anything, if you happen to disagree with this, I ask of you not to use any of the open source I have published. Nor am I interested in contributions from people who can't accept or act respectfully towards other humans regardless of gender identity, sexual orientation, disability, ethnicity, religion, age, physical appearance, body size, race, or similar personal characteristics. If you think feminism, anti-racism or the LGBT movement is somehow wrong, disturbing or irrelevant, I ask you to go elsewhere to find software.

# Leaflet Control Geocoder [![NPM version](https://img.shields.io/npm/v/leaflet-control-geocoder.svg)](https://www.npmjs.com/package/leaflet-control-geocoder) ![Leaflet 1.0.0 compatible!](https://img.shields.io/badge/Leaflet%201.0.0-%E2%9C%93-1EB300.svg?style=flat)

A simple geocoder for [Leaflet](https://leafletjs.com/) that by default uses [OSM](https://www.openstreetmap.org/)/[Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim).

The plugin supports many different data providers:

- LatLng to parse basic latitude/longitude strings
- [OSM](https://www.openstreetmap.org/)/[Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim)
- [Bing Locations API](http://msdn.microsoft.com/en-us/library/ff701715.aspx)
- [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/)
- [Mapbox Geocoding](https://www.mapbox.com/api-documentation/#geocoding)
- [MapQuest Geocoding API](http://developer.mapquest.com/web/products/dev-services/geocoding-ws)
- [What3Words](http://what3words.com/)
- [Photon](http://photon.komoot.de/)
- [Pelias](https://pelias.io/), [geocode.earth](https://geocode.earth/) (formerly Mapzen Search), [Openrouteservice](https://openrouteservice.org/dev/#/api-docs/geocode)
- [HERE Geocoder API](https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html) ([legacy](https://developer.here.com/documentation/geocoder/topics/introduction.html))
- [Neutrino API](https://www.neutrinoapi.com/api/geocode-address/)
- [Plus codes](https://plus.codes/) (formerly OpenLocationCode) (requires [open-location-code](https://www.npmjs.com/package/open-location-code))
- [ArcGIS](https://developers.arcgis.com/features/geocoding/)

The plugin can easily be extended to support other providers. Current extensions:

- [DAWA Geocoder](https://github.com/kjoller/leaflet-control-geocoder-dawa/tree/new) - support for Danish Address Web API by [Niels Kjøller Hansen](https://github.com/kjoller)

# Demos

- [Leaflet Control Geocoder Demo](https://www.liedman.net/leaflet-control-geocoder/) hosted on liedman.net
- See [demo/](https://github.com/perliedman/leaflet-control-geocoder/tree/master/demo)
- See [demo-rollup/](https://github.com/perliedman/leaflet-control-geocoder/tree/master/demo-rollup) using the [rollup.js](https://rollupjs.org/) bundler
- See [demo-webpack/](https://github.com/perliedman/leaflet-control-geocoder/tree/master/demo-rollup) using the [webpack](https://webpack.js.org/) bundler

# Usage

[Download latest release](https://github.com/perliedman/leaflet-control-geocoder/releases), or obtain the latest release via [unpkg.com](https://unpkg.com/):

```HTML
<link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
<script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
```

Add the control to a map instance:

```javascript
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
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

- latest → https://www.liedman.net/leaflet-control-geocoder/docs/
- version 1.13.0 → https://github.com/perliedman/leaflet-control-geocoder/tree/1.13.0#api
