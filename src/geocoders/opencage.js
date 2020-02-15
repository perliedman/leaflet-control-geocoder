import L from 'leaflet';
import { getJSON } from '../util';

export var OpenCage = L.Class.extend({
  options: {
    serviceUrl: 'https://api.opencagedata.com/geocode/v1/json',
    geocodingQueryParams: {},
    reverseQueryParams: {}
  },

  initialize: function(apiKey, options) {
    L.setOptions(this, options);
    this._accessToken = apiKey;
  },

  geocode: function(query, cb, context) {
    var params = {
      key: this._accessToken,
      q: query
    };
    params = L.extend(params, this.options.geocodingQueryParams);
    getJSON(this.options.serviceUrl, params, function(data) {
      var results = [],
        latLng,
        latLngBounds,
        loc;
      if (data.results && data.results.length) {
        for (var i = 0; i < data.results.length; i++) {
          loc = data.results[i];
          latLng = L.latLng(loc.geometry);
          if (loc.annotations && loc.annotations.bounds) {
            latLngBounds = L.latLngBounds(
              L.latLng(loc.annotations.bounds.northeast),
              L.latLng(loc.annotations.bounds.southwest)
            );
          } else {
            latLngBounds = L.latLngBounds(latLng, latLng);
          }
          results.push({
            name: loc.formatted,
            bbox: latLngBounds,
            center: latLng
          });
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
      key: this._accessToken,
      q: [location.lat, location.lng].join(',')
    };
    params = L.extend(params, this.options.reverseQueryParams);
    getJSON(this.options.serviceUrl, params, function(data) {
      var results = [],
        latLng,
        latLngBounds,
        loc;
      if (data.results && data.results.length) {
        for (var i = 0; i < data.results.length; i++) {
          loc = data.results[i];
          latLng = L.latLng(loc.geometry);
          if (loc.annotations && loc.annotations.bounds) {
            latLngBounds = L.latLngBounds(
              L.latLng(loc.annotations.bounds.northeast),
              L.latLng(loc.annotations.bounds.southwest)
            );
          } else {
            latLngBounds = L.latLngBounds(latLng, latLng);
          }
          results.push({
            name: loc.formatted,
            bbox: latLngBounds,
            center: latLng
          });
        }
      }
      cb.call(context, results);
    });
  }
});

export function opencage(apiKey, options) {
  return new OpenCage(apiKey, options);
}
