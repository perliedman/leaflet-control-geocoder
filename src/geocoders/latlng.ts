import * as L from 'leaflet';
import { IGeocoder, GeocodingCallback, GeocodingResult } from './api';

export interface LatLngOptions {
  /**
   * The next geocoder to use for non-supported queries
   */
  next?: IGeocoder;
  /**
   * The size in meters used for passing to `LatLng.toBounds`
   */
  sizeInMeters: number;
}

/**
 * Parses basic latitude/longitude strings such as `'50.06773 14.37742'`, `'N50.06773 W14.37742'`, `'S 50° 04.064 E 014° 22.645'`, or `'S 50° 4′ 03.828″, W 14° 22′ 38.712″'`
 * @param query the latitude/longitude string to parse
 * @returns the parsed latitude/longitude
 */
export function parseLatLng(query: string): L.LatLng | undefined {
  let match;
  // regex from https://github.com/openstreetmap/openstreetmap-website/blob/master/app/controllers/geocoder_controller.rb
  if ((match = query.match(/^([NS])\s*(\d{1,3}(?:\.\d*)?)\W*([EW])\s*(\d{1,3}(?:\.\d*)?)$/))) {
    // [NSEW] decimal degrees
    return L.latLng(
      (/N/i.test(match[1]) ? 1 : -1) * +match[2],
      (/E/i.test(match[3]) ? 1 : -1) * +match[4]
    );
  } else if (
    (match = query.match(/^(\d{1,3}(?:\.\d*)?)\s*([NS])\W*(\d{1,3}(?:\.\d*)?)\s*([EW])$/))
  ) {
    // decimal degrees [NSEW]
    return L.latLng(
      (/N/i.test(match[2]) ? 1 : -1) * +match[1],
      (/E/i.test(match[4]) ? 1 : -1) * +match[3]
    );
  } else if (
    (match = query.match(
      /^([NS])\s*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\W*([EW])\s*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?$/
    ))
  ) {
    // [NSEW] degrees, decimal minutes
    return L.latLng(
      (/N/i.test(match[1]) ? 1 : -1) * (+match[2] + +match[3] / 60),
      (/E/i.test(match[4]) ? 1 : -1) * (+match[5] + +match[6] / 60)
    );
  } else if (
    (match = query.match(
      /^(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\s*([NS])\W*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\s*([EW])$/
    ))
  ) {
    // degrees, decimal minutes [NSEW]
    return L.latLng(
      (/N/i.test(match[3]) ? 1 : -1) * (+match[1] + +match[2] / 60),
      (/E/i.test(match[6]) ? 1 : -1) * (+match[4] + +match[5] / 60)
    );
  } else if (
    (match = query.match(
      /^([NS])\s*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?\W*([EW])\s*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?$/
    ))
  ) {
    // [NSEW] degrees, minutes, decimal seconds
    return L.latLng(
      (/N/i.test(match[1]) ? 1 : -1) * (+match[2] + +match[3] / 60 + +match[4] / 3600),
      (/E/i.test(match[5]) ? 1 : -1) * (+match[6] + +match[7] / 60 + +match[8] / 3600)
    );
  } else if (
    (match = query.match(
      /^(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]\s*([NS])\W*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?\s*([EW])$/
    ))
  ) {
    // degrees, minutes, decimal seconds [NSEW]
    return L.latLng(
      (/N/i.test(match[4]) ? 1 : -1) * (+match[1] + +match[2] / 60 + +match[3] / 3600),
      (/E/i.test(match[8]) ? 1 : -1) * (+match[5] + +match[6] / 60 + +match[7] / 3600)
    );
  } else if ((match = query.match(/^\s*([+-]?\d+(?:\.\d*)?)\s*[\s,]\s*([+-]?\d+(?:\.\d*)?)\s*$/))) {
    return L.latLng(+match[1], +match[2]);
  }
}

/**
 * Parses basic latitude/longitude strings such as `'50.06773 14.37742'`, `'N50.06773 W14.37742'`, `'S 50° 04.064 E 014° 22.645'`, or `'S 50° 4′ 03.828″, W 14° 22′ 38.712″'`
 */
export class LatLng implements IGeocoder {
  options: LatLngOptions = {
    next: undefined,
    sizeInMeters: 10000
  };

  constructor(options?: Partial<LatLngOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any) {
    const center = parseLatLng(query);
    if (center) {
      const results: GeocodingResult[] = [
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
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link LatLng}
 * @param options the options
 */
export function latLng(options?: Partial<LatLngOptions>) {
  return new LatLng(options);
}
