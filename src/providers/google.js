(function() {
    'use strict';

    var L = require('leaflet');
    require('../control');

    L.Control.Geocoder.Google = L.Class.extend({
        options: {
            serviceUrl: 'https://maps.googleapis.com/maps/api/geocode/json'
        },

        initialize: function(key) {
            this._key = key;
        },

        geocode: function(query, cb, context) {
            var params = {
                address: query,
            };
            if(this._key && this._key.length)
            {
                params.key = this._key;
            }

            L.Control.Geocoder.getJSON(this.options.serviceUrl, params, function(data) {
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
                                center: latLng
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
            if(this._key && this._key.length) {
                params.key = this._key;
            }

            L.Control.Geocoder.getJSON(this.options.serviceUrl, params, function(data) {
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
                            center: latLng
                        };
                    }
                }

                cb.call(context, results);
            });
        }
    });

    L.Control.Geocoder.google = function(key) {
        return new L.Control.Geocoder.Google(key);
    };

    module.exports = L.Control.Geocoder;
})();
