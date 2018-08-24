import L from 'leaflet';

export var OpenLocationCode = L.Class.extend({
  options: {
    OpenLocationCode: undefined,
    codeLength: undefined
  },

  initialize: function(options) {
    L.setOptions(this, options);
  },

  geocode: function(query, cb, context) {
    try {
      var decoded = this.options.OpenLocationCode.decode(query);
      var result = {
        name: query,
        center: L.latLng(decoded.latitudeCenter, decoded.longitudeCenter),
        bbox: L.latLngBounds(
          L.latLng(decoded.latitudeLo, decoded.longitudeLo),
          L.latLng(decoded.latitudeHi, decoded.longitudeHi)
        )
      };
      cb.call(context, [result]);
    } catch (e) {
      console.warn(e); // eslint-disable-line no-console
      cb.call(context, []);
    }
  },
  reverse: function(location, scale, cb, context) {
    try {
      var code = this.options.OpenLocationCode.encode(
        location.lat,
        location.lng,
        this.options.codeLength
      );
      var result = {
        name: code,
        center: L.latLng(location.lat, location.lng),
        bbox: L.latLngBounds(
          L.latLng(location.lat, location.lng),
          L.latLng(location.lat, location.lng)
        )
      };
      cb.call(context, [result]);
    } catch (e) {
      console.warn(e); // eslint-disable-line no-console
      cb.call(context, []);
    }
  }
});

export function openLocationCode(options) {
  return new OpenLocationCode(options);
}
