var L = require('leaflet'),
	Util = require('../util');

module.exports = {
	class: L.Class.extend({
		options: {
			serviceUrl: '//dawa.aws.dk/adgangsadresser/',
			geocodingQueryParams: {},
			reverseQueryParams: {},
			wildcard: false
		},

		initialize: function(options) {
			L.Util.setOptions(this, options);
		},

		geocode: function(query, cb, context) {
			Util.jsonp(this.options.serviceUrl + '', L.extend({
				q: this.options.wildcard ? query + '*' : query,
			}, this.options.geocodingQueryParams),
			function(data) {
				var results = [], latLng;
				for (var i = 0; i < data.length; i++) {
					// Check if coordinates exists, otherwise skip
					if (data[i].adgangspunkt.koordinater) {
						latLng = L.latLng(data[i].adgangspunkt.koordinater[1],data[i].adgangspunkt.koordinater[0])
						results.push({
							name: data[i].vejstykke.navn + " " + data[i].husnr + ", " + data[i].postnummer.nr + " " + data[i].postnummer.navn,
							// there is no bounding box in the results
							bbox: L.latLngBounds(latLng, latLng),
							center: latLng
						});
					}
				};
				cb.call(context, results);
			}, this, 'callback');
		},

		suggest: function(query,cb,context) {
			// DAWA has a autocomplete API endpoint, but it does not include location data
			return this.geocode(query, cb, context);
		},

		reverse: function(location, scale, cb, context) {
			Util.jsonp(this.options.serviceUrl + 'reverse/', L.extend({
				y: location.lat,
				x: location.lng
			},
			this.options.reverseQueryParams), function(data) {
				var result = [],latLng;
				if (data && data.adgangspunkt) {
					latLng = L.latLng(data.adgangspunkt.koordinater[1], data.adgangspunkt.koordinater[0]);
					result.push({
						name: data.vejstykke.navn + " " + data.husnr + ", " + data.postnummer.nr + " " + data.postnummer.navn,
						center: latLng,
						bounds: L.latLngBounds(latLng, latLng)
					});
				}
				cb.call(context, result);
			}, this, 'callback');
		}
	}),

	factory: function(options) {
		return new L.Control.Geocoder.DAWA(options);
	}
};
