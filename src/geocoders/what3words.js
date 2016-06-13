var L = require('leaflet'),
	Util = require('../util');

module.exports = {
	class: L.Class.extend({
		options: {
			serviceUrl: 'https://api.what3words.com/v2/'
		},

		initialize: function(accessToken) {
			this._accessToken = accessToken;
		},

		geocode: function(query, cb, context) {
			//get three words and make a dot based string
			Util.getJSON(this.options.serviceUrl +'forward', {
				key: this._accessToken,
				addr: query.split(/\s+/).join('.'),
			}, function(data) {
				var results = [], loc, latLng, latLngBounds;
				if (data.hasOwnProperty('geometry')) {
					latLng = L.latLng(data.geometry['lat'],data.geometry['lng']);
					latLngBounds = L.latLngBounds(latLng, latLng);
					results[0] = {
						name: data.words,
						bbox: latLngBounds,
						center: latLng
					};
				}

				cb.call(context, results);
			});
		},

		suggest: function(query, cb, context) {
			return this.geocode(query, cb, context);
		},

		reverse: function(location, scale, cb, context) {
			Util.getJSON(this.options.serviceUrl +'reverse', {
				key: this._accessToken,
				coords: [location.lat,location.lng].join(',')
			}, function(data) {
				var results = [],loc,latLng,latLngBounds;
				if (data.status.status == 200) {
					latLng = L.latLng(data.geometry['lat'],data.geometry['lng']);
					latLngBounds = L.latLngBounds(latLng, latLng);
					results[0] = {
						name: data.words,
						bbox: latLngBounds,
						center: latLng
					};
				}
				cb.call(context, results);
			});
		}
	}),

	factory: function(accessToken) {
		return new L.Control.Geocoder.What3Words(accessToken);
	}
};
