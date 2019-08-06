import L from 'leaflet';
import { getJSON } from '../util';

export var OpenCage = L.Class.extend({
  options: {
    serviceUrl: 'https://api.opencagedata.com/geocode/v1/json'
  },

  initialize: function(apiKey) {
    this._accessToken = apiKey;
  },

  geocode: function(query, cb, context) {
    getJSON(
      this.options.serviceUrl,
      {
        key: this._accessToken,
        q: query
      },
      function(data) {
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
      }
    );
  },

  suggest: function(query, cb, context) {
    return this.geocode(query, cb, context);
  },

  reverse: function(location, scale, cb, context) {
    getJSON(
      this.options.serviceUrl,
      {
        key: this._accessToken,
        q: [location.lat, location.lng].join(',')
      },
      function(data) {
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
      }
    );
  }
});

export function opencage(apiKey) {
  return new OpenCage(apiKey);
}
