(function() {
    'use strict';

    var L = require('leaflet');
    require('../util');

    L.Control.Geocoder.Nominatim = L.Class.extend({
        options: {
            serviceUrl: '//nominatim.openstreetmap.org/',
            geocodingQueryParams: {},
            reverseQueryParams: {},
            htmlTemplate: function(r) {
                var a = r.address,
                    parts = [];
                if (a.road || a.building) {
                    parts.push('{building} {road} {house_number}');
                }

                if (a.city || a.town || a.village) {
                    parts.push('<span class="' + (parts.length > 0 ? 'leaflet-control-geocoder-address-detail' : '') +
                        '">{postcode} {city} {town} {village}</span>');
                }

                if (a.state || a.country) {
                    parts.push('<span class="' + (parts.length > 0 ? 'leaflet-control-geocoder-address-context' : '') +
                        '">{state} {country}</span>');
                }

                return L.Control.Geocoder.template(parts.join('<br/>'), a, true);
            }
        },

        initialize: function(options) {
            L.Util.setOptions(this, options);
        },

        geocode: function(query, cb, context) {
            L.Control.Geocoder._getJSON(this.options.serviceUrl + 'search/', L.extend({
                q: query,
                limit: 5,
                format: 'json',
                addressdetails: 1
            }, this.options.geocodingQueryParams),
            function(err, data) {
                var features = [],
                    r;
                if (!err) {
                    for (var i = 0; i < data.length; i++) {
                        r = data[i];

                        features.push({
                            type: 'Feature',
                            properties: {
/* jshint camelcase: false */
                                icon: r.icon,
                                name: r.display_name,
                                html: this.options.htmlTemplate ?
                                    this.options.htmlTemplate(r)
                                    : undefined,
                                bounds: this._bboxToPolygon(r.boundingbox),
                                source: r
/* jshint camelcase: true */
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: [r.lon, r.lat]
                            }
                        });
                    }
                    cb.call(context, undefined, {type: 'FeatureCollection', features: features});
                } else {
                    cb.call(context, err);
                }
            }, this, 'json_callback');
        },

        reverse: function(location, scale, cb, context) {
            L.Control.Geocoder._getJSON(this.options.serviceUrl + 'reverse/', L.extend({
                lat: location.lat,
                lon: location.lng,
                zoom: Math.round(Math.log(scale / 256) / Math.log(2)),
                addressdetails: 1,
                format: 'json'
            }, this.options.reverseQueryParams), function(err, data) {
                var result = [],
                    loc;

                if (!err) {
                    if (data && data.lat && data.lon) {
                        loc = L.latLng(data.lat, data.lon);
                        result.push({
/* jshint camelcase: false */
                            name: data.display_name,
                            html: this.options.htmlTemplate ?
                                this.options.htmlTemplate(data)
                                : undefined,
                            center: loc,
                            bounds: L.latLngBounds(loc, loc),
                            properties: data
/* jshint camelcase: true */
                        });
                    }

                    cb.call(context, result);
                } else {
                    cb.call(context, err);
                }
            }, this, 'json_callback');
        },

        _bboxToPolygon: function(bbox) {
            var i,
                floats = [];
            // Order: lat1, lat2, lng1, lng2
            for (i = 0; i < 4; i++) {
                floats[i] = parseFloat(bbox[i]);
            }

            return {
                type: 'Polygon',
                coordinates: [
                    [
                        [floats[2], floats[0]],
                        [floats[2], floats[1]],
                        [floats[3], floats[1]],
                        [floats[3], floats[0]]
                    ]
                ]
            };
        }
    });

    L.control.geocoder.nominatim = function(options) {
        return new L.Control.Geocoder.Nominatim(options);
    };

    module.exports = L.Control.Geocoder;
})();
