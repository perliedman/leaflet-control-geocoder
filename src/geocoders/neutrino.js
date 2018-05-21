import L from 'leaflet';
import { getJSON } from '../util';

export default {
  class: L.Class.extend({
    options: {
      serviceUrl: 'https://neutrinoapi.com/'
    },

    initialize: function(accessToken, userName) {
      this._accessToken = accessToken;
      this._userName = userName;
    },

    geocode: function(query, cb, context) {
      //get three words and make a dot based string
      getJSON(
        this.options.serviceUrl + 'geocode-address',
        {
          'api-key': this._accessToken,
          'user-id': this._userName,
          addr: query.split(/\s+/).join('.')
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

    reverse: function(location, scale, cb, context) {
      getJSON(
        this.options.serviceUrl + 'geocode-reverse',
        {
          'api-key': this._accessToken,
          'user-id': this._userName,
          latitude: location.lat,
          longitude:  location.lng
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
