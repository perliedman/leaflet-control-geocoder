(function() {
    'use strict';

    var L = require('leaflet');
    require('../control');

    L.Control.Geocoder.Mapbox = L.Class.extend({
        options: {
            serviceUrl: 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places-v1/'
        },

        initialize: function(accessToken) {
            this._accessToken = accessToken;
        },

        geocode: function(query, cb, context) {
            L.Control.Geocoder.getJSON(this.options.serviceUrl + encodeURIComponent(query) + '.json', {
                access_token: this._accessToken,
            }, function(data) {
                var results = [],
                loc,
                latLng,
                latLngBounds;
                if (data.features && data.features.length) {
                    for (var i = 0; i <= data.features.length - 1; i++) {
                        loc = data.features[i];
                        latLng = L.latLng(loc.center.reverse());
                        if(loc.hasOwnProperty('bbox')) {
                            latLngBounds = L.latLngBounds(L.latLng(loc.bbox.slice(0, 2).reverse()), L.latLng(loc.bbox.slice(2, 4).reverse()));
                        } else {
                            latLngBounds = L.latLngBounds(latLng, latLng);
                        }
                        results[i] = {
                            name: loc.place_name,
                            bbox: latLngBounds,
                            center: latLng
                        };
                    }
                }

                cb.call(context, results);
            });
        },

        reverse: function(location, scale, cb, context) {
            L.Control.Geocoder.getJSON(this.options.serviceUrl + encodeURIComponent(location.lng) + ',' + encodeURIComponent(location.lat) + '.json', {
                access_token: this._accessToken,
            }, function(data) {
                var results = [],
                loc,
                latLng,
                latLngBounds;
                if (data.features && data.features.length) {
                    for (var i = 0; i <= data.features.length - 1; i++) {
                        loc = data.features[i];
                        latLng = L.latLng(loc.center.reverse());
                        if(loc.hasOwnProperty('bbox'))
                        {
                            latLngBounds = L.latLngBounds(L.latLng(loc.bbox.slice(0, 2).reverse()), L.latLng(loc.bbox.slice(2, 4).reverse()));
                        }
                        else
                        {
                            latLngBounds = L.latLngBounds(latLng, latLng);
                        }
                        results[i] = {
                            name: loc.place_name,
                            bbox: latLngBounds,
                            center: latLng
                        };
                    }
                }

                cb.call(context, results);
            });
        }
    });

    L.control.geocoder.mapbox = function(accessToken) {
        return new L.Control.Geocoder.Mapbox(accessToken);
    };

    module.exports = L.Control.Geocoder;
})();
