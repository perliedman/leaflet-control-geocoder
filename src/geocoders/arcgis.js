var L = require('leaflet'),
	Util = require('../util');

module.exports = {
	class: L.Class.extend({
		options: {
			service_url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
		},

		initialize: function(accessToken, options) {
			L.setOptions(this, options);
			this._accessToken = accessToken;
		},

		geocode: function(query, cb, context) {
			var params = {
				SingleLine: query,
				outFields: 'Addr_Type',
				forStorage: false,
				maxLocations: 10,
				f: 'json'
			};

			if (this._key && this._key.length) {
				params.token = this._key;
			}

			Util.getJSON(this.options.service_url + '/findAddressCandidates', params, function(data) {
				var results = [],
					loc,
					latLng,
					latLngBounds;

				if (data.candidates && data.candidates.length) {
					for (var i = 0; i <= data.candidates.length - 1; i++) {
						loc = data.candidates[i];
						latLng = L.latLng(loc.location.y, loc.location.x);
						latLngBounds = L.latLngBounds(L.latLng(loc.extent.ymax, loc.extent.xmax), L.latLng(loc.extent.ymin, loc.extent.xmin));
						results[i] = {
								name: loc.address,
								bbox: latLngBounds,
								center: latLng
						};
					}
				}

				cb.call(context, results);
			});
		},

		suggest: function(query, cb, context) {
			return this.geocode(query, cb, context);
		},

		reverse: function(location, scale, cb, context) {
			var params = {
				location: encodeURIComponent(location.lng) + ',' + encodeURIComponent(location.lat),
				distance: 100,
				f: 'json'
			};

			Util.getJSON(this.options.service_url + '/reverseGeocode', params, function(data) {
				var result = [],
					loc;

				if (data && !data.error) {
					loc = L.latLng(data.location.y, data.location.x);
					result.push({
						name: data.address.Match_addr,
						center: loc,
						bounds: L.latLngBounds(loc, loc)
					});
				}

				cb.call(context, result);
			});
		}
	}),

	factory: function(accessToken, options) {
		return new L.Control.Geocoder.ArcGis(accessToken, options);
	}
};
