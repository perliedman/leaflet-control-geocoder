import * as L from 'leaflet';
import { getJSON } from '../util';
import {
  IGeocoder,
  GeocoderOptions,
  GeocodingCallback,
  geocodingParams,
  GeocodingResult,
  reverseParams
} from './api';

export interface NeutrinoOptions extends GeocoderOptions {
  userId: string;
}

/**
 * Implementation of the [Neutrino API](https://www.neutrinoapi.com/api/geocode-address/)
 */
export class Neutrino implements IGeocoder {
  options: NeutrinoOptions = {
    userId: undefined,
    apiKey: undefined,
    serviceUrl: 'https://neutrinoapi.com/'
  };

  constructor(options?: Partial<NeutrinoOptions>) {
    L.Util.setOptions(this, options);
  }

  // https://www.neutrinoapi.com/api/geocode-address/
  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    const params = geocodingParams(this.options, {
      apiKey: this.options.apiKey,
      userId: this.options.userId,
      //get three words and make a dot based string
      address: query.split(/\s+/).join('.')
    });
    getJSON(this.options.serviceUrl + 'geocode-address', params, data => {
      const results: GeocodingResult[] = [];
      if (data.locations) {
        data.geometry = data.locations[0];
        const center = L.latLng(data.geometry['latitude'], data.geometry['longitude']);
        const bbox = L.latLngBounds(center, center);
        results[0] = {
          name: data.geometry.address,
          bbox: bbox,
          center: center
        };
      }

      cb.call(context, results);
    });
  }

  suggest(query: string, cb: GeocodingCallback, context?: any): void {
    return this.geocode(query, cb, context);
  }

  // https://www.neutrinoapi.com/api/geocode-reverse/
  reverse(location: L.LatLngLiteral, scale: number, cb: GeocodingCallback, context?: any): void {
    const params = reverseParams(this.options, {
      apiKey: this.options.apiKey,
      userId: this.options.userId,
      latitude: location.lat,
      longitude: location.lng
    });
    getJSON(this.options.serviceUrl + 'geocode-reverse', params, data => {
      const results: GeocodingResult[] = [];
      if (data.status.status == 200 && data.found) {
        const center = L.latLng(location.lat, location.lng);
        const bbox = L.latLngBounds(center, center);
        results[0] = {
          name: data.address,
          bbox: bbox,
          center: center
        };
      }
      cb.call(context, results);
    });
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Neutrino}
 * @param options the options
 */
export function neutrino(options?: Partial<NeutrinoOptions>) {
  return new Neutrino(options);
}
