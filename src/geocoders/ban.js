var L = require('leaflet'),
 Util = require('../util');

module.exports = {
  class: L.Class.extend({
    options: {
      geocodingQueryParams: {},
      reverseQueryParams: {}
    },

    initialize: function(options) {
      L.Util.setOptions(this, options);
    },

    htmlTemplate: function(r) {
      var parts = [];
      parts.push(r.name);
      parts.push('<span class="leaflet-control-geocoder-address-detail">'
                 + r.postcode + ' ' + r.city + '</span>');
      parts.push('<span class="leaflet-control-geocoder-address-context">'
                 + 'France ' + r.context + '</span>');
      return Util.template(parts.join('<br>'), r.label, true);
    },

    _handle_data: function(data, cb, context, htmlTemplate) {
      var results = [];
      if (data.features && data.features.length) {
        for (var i=0; i<data.features.length; i++) {
          var feature = data.features[i];
          var latlng = data.features[i].geometry.coordinates;
          var center = L.latLng(latlng[1], latlng[0]);
          var southWest = L.latLng(center.lat - 0.0001, center.lng + 0.0001),
              northEast = L.latLng(center.lat + 0.0001, center.lng - 0.0001),
              bounds = L.latLngBounds(southWest, northEast);
          results[i] = {
            name: feature.properties.label,
            html: htmlTemplate(feature.properties),
            center: center,
            bbox: bounds,
            properties: feature.properties
          };
        }
        cb.call(context, results);
      }
    },

    geocode: function(query, cb, context) {
      var regex = /(?:geo:)?(\d+(?:[.]\d+)?)[\s,;:|-]+(\d+(?:[.]\d+)?)(?:[?]z=\d+)?/i;
      var regex2 = /(?:lat\s*[:=]\s*)?(\d+(?:[.]\d+)?)[\s,;:|-]+(?:lo?ng\s*[:=]\s*)?(\d+(?:[.]\d+)?)(?:[?]z=\d+)?/i;
      var match = regex.exec(query) || regex2.exec(query);
      if (match) {
        this.reverse({lat: match[1], lng:match[2]}, null, cb, context);
      } else {
        var handle_data = this._handle_data;
        var htmlTemplate = this.options.htmlTemplate || this.htmlTemplate;;
        Util.getJSON('https://api-adresse.data.gouv.fr/search/', L.extend({
          q: query,
        },
        this.options.geocodingQueryParams),
        function(data) { handle_data(data, cb, context, htmlTemplate); });
      }
    },

    reverse: function(location, scale, cb, context) {
      var handle_data = this._handle_data;
      var htmlTemplate = this.options.htmlTemplate || this.htmlTemplate;;
      Util.getJSON('https://api-adresse.data.gouv.fr/reverse/', L.extend({
        lat : location.lat,
        lon : location.lng,
      },
      this.options.reverseQueryParams),
      function(data) { handle_data(data, cb, context, htmlTemplate); });
    },

  }),

  factory: function(options) {
    return new L.Control.Geocoder.BAN(options);
  }
};
