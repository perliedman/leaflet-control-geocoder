import L from 'leaflet';
import { getJSON } from '../util';

export var Pelias = L.Class.extend({
  options: {
    serviceUrl: 'https://api.geocode.earth/v1',
    geocodingQueryParams: {},
    reverseQueryParams: {}
  },

  initialize: function(apiKey, options) {
    L.Util.setOptions(this, options);
    this._apiKey = apiKey;
    this._lastSuggest = 0;
  },

  geocode: function(query, cb, context) {
    var _this = this;
    getJSON(
      this.options.serviceUrl + '/search',
      L.extend(
        {
          api_key: this._apiKey,
          text: query
        },
        this.options.geocodingQueryParams
      ),
      function(data) {
        cb.call(context, _this._parseResults(data, 'bbox'));
      }
    );
  },

  suggest: function(query, cb, context) {
    var _this = this;
    getJSON(
      this.options.serviceUrl + '/autocomplete',
      L.extend(
        {
          api_key: this._apiKey,
          text: query
        },
        this.options.geocodingQueryParams
      ),
      L.bind(function(data) {
        if (data.geocoding.timestamp > this._lastSuggest) {
          this._lastSuggest = data.geocoding.timestamp;
          cb.call(context, _this._parseResults(data, 'bbox'));
        }
      }, this)
    );
  },

  reverse: function(location, scale, cb, context) {
    var _this = this;
    getJSON(
      this.options.serviceUrl + '/reverse',
      L.extend(
        {
          api_key: this._apiKey,
          'point.lat': location.lat,
          'point.lon': location.lng
        },
        this.options.reverseQueryParams
      ),
      function(data) {
        cb.call(context, _this._parseResults(data, 'bounds'));
      }
    );
  },

  _parseResults: function(data, bboxname) {
    var results = [];
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      onEachFeature: function(feature, layer) {
        var result = {},
          bbox,
          center;

        if (layer.getBounds) {
          bbox = layer.getBounds();
          center = bbox.getCenter();
        } else if (layer.feature.bbox) {
          center = layer.getLatLng();
          bbox = L.latLngBounds(
            L.GeoJSON.coordsToLatLng(layer.feature.bbox.slice(0, 2)),
            L.GeoJSON.coordsToLatLng(layer.feature.bbox.slice(2, 4))
          );
        } else {
          center = layer.getLatLng();
          bbox = L.latLngBounds(center, center);
        }

        result.name = layer.feature.properties.label;
        result.center = center;
        result[bboxname] = bbox;
        result.properties = layer.feature.properties;
        results.push(result);
      }
    });
    return results;
  }
});

export function pelias(apiKey, options) {
  return new Pelias(apiKey, options);
}
export var GeocodeEarth = Pelias;
export var geocodeEarth = pelias;

export var Mapzen = Pelias; // r.i.p.
export var mapzen = pelias;

export var Openrouteservice = Mapzen.extend({
  options: {
    serviceUrl: 'https://api.openrouteservice.org/geocode'
  }
});
export function openrouteservice(apiKey, options) {
  return new Openrouteservice(apiKey, options);
}
