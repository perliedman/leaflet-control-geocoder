import L from 'leaflet';

export var LatLng = L.Class.extend({
  options: {
    // the next geocoder to use
    next: undefined,
    sizeInMeters: 10000
  },

  initialize: function(options) {
    L.Util.setOptions(this, options);
  },

  geocode: function(query, cb, context) {
    var match;
    var center;
    // regex from https://github.com/openstreetmap/openstreetmap-website/blob/master/app/controllers/geocoder_controller.rb
    if ((match = query.match(/^([NS])\s*(\d{1,3}(?:\.\d*)?)\W*([EW])\s*(\d{1,3}(?:\.\d*)?)$/))) {
      // [NSEW] decimal degrees
      center = L.latLng(
        (/N/i.test(match[1]) ? 1 : -1) * parseFloat(match[2]),
        (/E/i.test(match[3]) ? 1 : -1) * parseFloat(match[4])
      );
    } else if (
      (match = query.match(/^(\d{1,3}(?:\.\d*)?)\s*([NS])\W*(\d{1,3}(?:\.\d*)?)\s*([EW])$/))
    ) {
      // decimal degrees [NSEW]
      center = L.latLng(
        (/N/i.test(match[2]) ? 1 : -1) * parseFloat(match[1]),
        (/E/i.test(match[4]) ? 1 : -1) * parseFloat(match[3])
      );
    } else if (
      (match = query.match(
        /^([NS])\s*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\W*([EW])\s*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?$/
      ))
    ) {
      // [NSEW] degrees, decimal minutes
      center = L.latLng(
        (/N/i.test(match[1]) ? 1 : -1) * (parseFloat(match[2]) + parseFloat(match[3] / 60)),
        (/E/i.test(match[4]) ? 1 : -1) * (parseFloat(match[5]) + parseFloat(match[6] / 60))
      );
    } else if (
      (match = query.match(
        /^(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\s*([NS])\W*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\s*([EW])$/
      ))
    ) {
      // degrees, decimal minutes [NSEW]
      center = L.latLng(
        (/N/i.test(match[3]) ? 1 : -1) * (parseFloat(match[1]) + parseFloat(match[2] / 60)),
        (/E/i.test(match[6]) ? 1 : -1) * (parseFloat(match[4]) + parseFloat(match[5] / 60))
      );
    } else if (
      (match = query.match(
        /^([NS])\s*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?\W*([EW])\s*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?$/
      ))
    ) {
      // [NSEW] degrees, minutes, decimal seconds
      center = L.latLng(
        (/N/i.test(match[1]) ? 1 : -1) *
          (parseFloat(match[2]) + parseFloat(match[3] / 60 + parseFloat(match[4] / 3600))),
        (/E/i.test(match[5]) ? 1 : -1) *
          (parseFloat(match[6]) + parseFloat(match[7] / 60) + parseFloat(match[8] / 3600))
      );
    } else if (
      (match = query.match(
        /^(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]\s*([NS])\W*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?\s*([EW])$/
      ))
    ) {
      // degrees, minutes, decimal seconds [NSEW]
      center = L.latLng(
        (/N/i.test(match[4]) ? 1 : -1) *
          (parseFloat(match[1]) + parseFloat(match[2] / 60 + parseFloat(match[3] / 3600))),
        (/E/i.test(match[8]) ? 1 : -1) *
          (parseFloat(match[5]) + parseFloat(match[6] / 60) + parseFloat(match[7] / 3600))
      );
    } else if (
      (match = query.match(/^\s*([+-]?\d+(?:\.\d*)?)\s*[\s,]\s*([+-]?\d+(?:\.\d*)?)\s*$/))
    ) {
      center = L.latLng(parseFloat(match[1]), parseFloat(match[2]));
    }
    if (center) {
      var results = [
        {
          name: query,
          center: center,
          bbox: center.toBounds(this.options.sizeInMeters)
        }
      ];
      cb.call(context, results);
    } else if (this.options.next) {
      this.options.next.geocode(query, cb, context);
    }
  }
});

export function latLng(options) {
  return new LatLng(options);
}
