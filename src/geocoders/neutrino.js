import L from 'leaflet';
import { getJSON } from '../util';

export default {
  class: L.Class.extend({
    options: {
      userId: '<insert your userId here>',
      apiKey: '<insert your apiKey here>',
      serviceUrl: 'https://neutrinoapi.com/'
    },

    initialize: function(options) {
      L.Util.setOptions(this, options);
    },

    // https://www.neutrinoapi.com/api/geocode-address/
    geocode: function(query, cb, context) {
      getJSON(
        this.options.serviceUrl + 'geocode-address',
        {
          apiKey: this.options.apiKey,
          userId: this.options.userId,
          //get three words and make a dot based string
          address: query.split(/\s+/).join('.')
        },
        function(data) {
          var results = [],
            latLng,
            latLngBounds;
          if (data.hasOwnProperty('locations')) {
            data.geometry = data.locations[0];
            latLng = L.latLng(data.geometry['latitude'], data.geometry['longitude']);
            latLngBounds = L.latLngBounds(latLng, latLng);
            results[0] = {
              name: data.geometry.address,
              bbox: latLngBounds,
              center: latLng
            };
          }

          cb.call(context, results);
        }
      );
    },

    suggest: function(query, cb, context) {
      return this.geocode(query, cb, context);
    },

    // https://www.neutrinoapi.com/api/geocode-reverse/
    reverse: function(location, scale, cb, context) {
      getJSON(
        this.options.serviceUrl + 'geocode-reverse',
        {
          apiKey: this.options.apiKey,
          userId: this.options.userId,
          latitude: location.lat,
          longitude: location.lng
        },
        function(data) {
          var results = [],
            latLng,
            latLngBounds;
          if (data.status.status == 200 && data.found) {
            latLng = L.latLng(location.lat, location.lng);
            latLngBounds = L.latLngBounds(latLng, latLng);
            results[0] = {
              name: data.address,
              bbox: latLngBounds,
              center: latLng
            };
          }
          cb.call(context, results);
        }
      );
    }
  }),

  factory: function(accessToken) {
    return new L.Control.Geocoder.Neutrino(accessToken);
  }
};
