import * as L from 'leaflet';
import { getJSON } from '../util';
import {
  GeocoderAPI,
  GeocoderOptions,
  GeocodingCallback,
  geocodingParams,
  GeocodingResult,
  reverseParams
} from './api';

export interface What3WordsOptions extends GeocoderOptions {}

export class What3Words implements GeocoderAPI {
  options: What3WordsOptions = {
    serviceUrl: 'https://api.what3words.com/v2/'
  };

  constructor(options: Partial<What3WordsOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    //get three words and make a dot based string
    getJSON(
      this.options.serviceUrl + 'forward',
      geocodingParams(this.options, {
        key: this.options.apiKey,
        addr: query.split(/\s+/).join('.')
      }),
      data => {
        const results: GeocodingResult[] = [];
        if (data.geometry) {
          const latLng = L.latLng(data.geometry['lat'], data.geometry['lng']);
          const latLngBounds = L.latLngBounds(latLng, latLng);
          results[0] = {
            name: data.words,
            bbox: latLngBounds,
            center: latLng
          };
        }

        cb.call(context, results);
      }
    );
  }

  suggest(query: string, cb: GeocodingCallback, context?: any): void {
    return this.geocode(query, cb, context);
  }

  reverse(
    location: L.LatLngLiteral,
    scale: number,
    cb: (result: any) => void,
    context?: any
  ): void {
    getJSON(
      this.options.serviceUrl + 'reverse',
      reverseParams(this.options, {
        key: this.options.apiKey,
        coords: [location.lat, location.lng].join(',')
      }),
      data => {
        const results: GeocodingResult[] = [];
        if (data.status.status == 200) {
          const center = L.latLng(data.geometry['lat'], data.geometry['lng']);
          const bbox = L.latLngBounds(center, center);
          results[0] = {
            name: data.words,
            bbox: bbox,
            center: center
          };
        }
        cb.call(context, results);
      }
    );
  }
}

export function what3words(options: Partial<What3WordsOptions>) {
  return new What3Words(options);
}
