(function() {
    'use strict';

    var L = require('leaflet');
    require('../util');

    L.Control.Geocoder.MapQuest = L.Class.extend({
        initialize: function(key) {
            // MapQuest seems to provide URI encoded API keys,
            // so to avoid encoding them twice, we decode them here
            this._key = decodeURIComponent(key);
        },

        _formatName: function() {
            var r = [],
                i;
            for (i = 0; i < arguments.length; i++) {
                if (arguments[i]) {
                    r.push(arguments[i]);
                }
            }

            return r.join(', ');
        },

        geocode: function(query, cb, context) {
            L.Control.Geocoder._jsonp('//www.mapquestapi.com/geocoding/v1/address', {
                key: this._key,
                location: query,
                limit: 5,
                outFormat: 'json'
            }, function(data) {
                var results = [],
                    loc,
                    latLng;
                if (data.results && data.results[0].locations) {
                    for (var i = data.results[0].locations.length - 1; i >= 0; i--) {
                        loc = data.results[0].locations[i];
                        latLng = L.latLng(loc.latLng);
                        results[i] = {
                            name: this._formatName(loc.street, loc.adminArea4, loc.adminArea3, loc.adminArea1),
                            bbox: L.latLngBounds(latLng, latLng),
                            center: latLng
                        };
                    }
                }

                cb.call(context, results);
            }, this);
        },

        reverse: function(location, scale, cb, context) {
            L.Control.Geocoder._jsonp('//www.mapquestapi.com/geocoding/v1/reverse', {
                key: this._key,
                location: location.lat + ',' + location.lng,
                outputFormat: 'json'
            }, function(data) {
                var results = [],
                    loc,
                    latLng;
                if (data.results && data.results[0].locations) {
                    for (var i = data.results[0].locations.length - 1; i >= 0; i--) {
                        loc = data.results[0].locations[i];
                        latLng = L.latLng(loc.latLng);
                        results[i] = {
                            name: this._formatName(loc.street, loc.adminArea4, loc.adminArea3, loc.adminArea1),
                            bbox: L.latLngBounds(latLng, latLng),
                            center: latLng
                        };
                    }
                }

                cb.call(context, results);
            }, this);
        }
    });

    L.control.geocoder.mapQuest = function(key) {
        return new L.Control.Geocoder.MapQuest(key);
    };

    module.exports = L.Control.Geocoder;
})();
