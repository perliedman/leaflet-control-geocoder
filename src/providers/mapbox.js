(function() {
    'use strict';

    var L = require('leaflet');
    require('../control');

    L.Control.Geocoder.Mapbox = L.Class.extend({
        options: {
            serviceUrl: 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/'
        },

        initialize: function(accessToken) {
            this._accessToken = accessToken;
        },

/* jshint camelcase: false */
        geocode: function(query, cb, context) {
            L.Control.Geocoder._getJSON(this.options.serviceUrl + encodeURIComponent(query) + '.json', {
                access_token: this._accessToken,
            }, function(err, data) {
                if (!err) {
                    cb.call(context, undefined, this._carmenToResult(data));
                } else {
                    cb.call(context, err);
                }
            }, this);
        },

        suggest: function(query, cb, context) {
            return this.geocode(query, cb, context);
        },

        reverse: function(location, scale, cb, context) {
            L.Control.Geocoder._getJSON(this.options.serviceUrl + encodeURIComponent(location.lng) + ',' + encodeURIComponent(location.lat) + '.json', {
                access_token: this._accessToken,
            }, function(err, data) {
                if (!err) {
                    cb.call(context, undefined, this._carmenToResult(data));
                } else {
                    cb.call(context, err);
                }
            }, this);
        },

        _carmenToResult: function(data) {
            var features = [],
                i,
                loc,
                bbox;
            if (data.features && data.features.length) {
                for (i = 0; i <= data.features.length - 1; i++) {
                    loc = data.features[i];
                    bbox = loc.bbox;
                    features[i] = {
                        type: 'Feature',
                        properties: {
                            name: loc.place_name,
                            bounds: {
                                type: 'Geometry',
                                coordinates: [[
                                    [bbox[0], bbox[1]],
                                    [bbox[0], bbox[3]],
                                    [bbox[2], bbox[3]],
                                    [bbox[2], bbox[1]]
                                ]],
                                source: loc
                            },
                        },
                        geometry: loc.geometry
                    };
                }
            }

            return {type: 'FeatureCollection', features: features};
        }
    });
/* jshint camelcase: true */

    L.control.geocoder.mapbox = function(accessToken) {
        return new L.Control.Geocoder.Mapbox(accessToken);
    };

    module.exports = L.Control.Geocoder;
})();
