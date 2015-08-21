var L = require('leaflet'),
	Util = require('../util');

module.exports = {
	class: L.Class.extend({
		options: {
			serviceUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
			geocodingQueryParams: {},
			reverseQueryParams: {}
		},

		initialize: function(key, options) {
			this._key = key;
			L.setOptions(this, options);
			// Backwards compatibility
			this.options.serviceUrl = this.options.service_url || this.options.serviceUrl;
		},

		geocode: function(query, cb, context) {
			var params = {
				address: query,
			};

			if (this._key && this._key.length) {
				params.key = this._key;
			}

			params = L.Util.extend(params, this.options.geocodingQueryParams);

			Util.getJSON(this.options.serviceUrl, params, function(data) {
				var results = [],
						loc,
						latLng,
						latLngBounds;
				if (data.results && data.results.length) {
					for (var i = 0; i <= data.results.length - 1; i++) {
						loc = data.results[i];
						latLng = L.latLng(loc.geometry.location);
						latLngBounds = L.latLngBounds(L.latLng(loc.geometry.viewport.northeast), L.latLng(loc.geometry.viewport.southwest));
						results[i] = {
							name: loc.formatted_address,
							bbox: latLngBounds,
							center: latLng,
							properties: loc.address_components
						};
					}
				}

				cb.call(context, results);
			});
		},

		reverse: function(location, scale, cb, context) {
			var params = {
				latlng: encodeURIComponent(location.lat) + ',' + encodeURIComponent(location.lng)
			};
			params = L.Util.extend(params, this.options.reverseQueryParams);
			if (this._key && this._key.length) {
				params.key = this._key;
			}

			Util.getJSON(this.options.serviceUrl, params, function(data) {
				var results = [],
						loc,
						latLng,
						latLngBounds;
				if (data.results && data.results.length) {
					for (var i = 0; i <= data.results.length - 1; i++) {
						loc = data.results[i];
						latLng = L.latLng(loc.geometry.location);
						latLngBounds = L.latLngBounds(L.latLng(loc.geometry.viewport.northeast), L.latLng(loc.geometry.viewport.southwest));
						results[i] = {
							name: loc.formatted_address,
							bbox: latLngBounds,
							center: latLng,
							properties: loc.address_components
						};
					}
				}

				cb.call(context, results);
			});
		}
	}),

	factory: function(key, options) {
		return new L.Control.Geocoder.Google(key, options);
	}
};
