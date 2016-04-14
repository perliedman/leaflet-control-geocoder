var L = require('leaflet'),
	Control = require('./control'),
	Nominatim = require('./geocoders/nominatim'),
	Bing = require('./geocoders/bing'),
	MapQuest = require('./geocoders/mapquest'),
	Mapbox = require('./geocoders/mapbox'),
	What3Words = require('./geocoders/what3words'),
	Google = require('./geocoders/google'),
	Photon = require('./geocoders/photon'),
	Mapzen = require('./geocoders/mapzen'),
	ArcGis = require('./geocoders/arcgis'),
	HERE = require('./geocoders/here');

module.exports = L.Util.extend(Control.class, {
	Nominatim: Nominatim.class,
	nominatim: Nominatim.factory,
	Bing: Bing.class,
	bing: Bing.factory,
	MapQuest: MapQuest.class,
	mapQuest: MapQuest.factory,
	Mapbox: Mapbox.class,
	mapbox: Mapbox.factory,
	What3Words: What3Words.class,
	what3words: What3Words.factory,
	Google: Google.class,
	google: Google.factory,
	Photon: Photon.class,
	photon: Photon.factory,
	Mapzen: Mapzen.class,
	mapzen: Mapzen.factory,
	ArcGis: ArcGis.class,
	arcgis: ArcGis.factory,
	HERE: HERE.class,
	here: HERE.factory
});

L.Util.extend(L.Control, {
	Geocoder: module.exports,
	geocoder: Control.factory
});
