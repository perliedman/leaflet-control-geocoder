import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocoderOptions, GeocodingCallback, GeocodingResult } from './api';

export interface NeutrinoOptions extends GeocoderOptions {
  userId: string;
}

export class Neutrino implements GeocoderAPI {
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
    getJSON(
      this.options.serviceUrl + 'geocode-address',
      {
        apiKey: this.options.apiKey,
        userId: this.options.userId,
        //get three words and make a dot based string
        address: query.split(/\s+/).join('.')
      },
      data => {
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
      }
    );
  }

  suggest(query: string, cb: GeocodingCallback, context?: any): void {
    return this.geocode(query, cb, context);
  }

  // https://www.neutrinoapi.com/api/geocode-reverse/
  reverse(
    location: L.LatLngLiteral,
    scale: number,
    cb: (result: any) => void,
    context?: any
  ): void {
    getJSON(
      this.options.serviceUrl + 'geocode-reverse',
      {
        apiKey: this.options.apiKey,
        userId: this.options.userId,
        latitude: location.lat,
        longitude: location.lng
      },
      data => {
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
      }
    );
  }
}

export function neutrino(options?: Partial<NeutrinoOptions>) {
  return new Neutrino(options);
}
