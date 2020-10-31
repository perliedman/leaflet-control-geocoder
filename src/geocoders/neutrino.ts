import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocodingResult } from './interfaces';

export interface NeutrinoOptions {
  userId: string;
  apiKey: string;
  serviceUrl: string;
}

export class Neutrino implements GeocoderAPI {
  options: NeutrinoOptions = {
    userId: undefined,
    apiKey: undefined,
    serviceUrl: 'https://neutrinoapi.com/'
  };

  constructor(options: Partial<NeutrinoOptions>) {
    L.Util.setOptions(this, options);
  }

  // https://www.neutrinoapi.com/api/geocode-address/
  geocode(query: string, cb: (result: GeocodingResult[]) => void, context?: any): void {
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
        if (data.locations) {
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
  }

  suggest(query: string, cb: (result: GeocodingResult[]) => void, context?: any): void {
    return this.geocode(query, cb, context);
  }

  // https://www.neutrinoapi.com/api/geocode-reverse/
  reverse(location: L.LatLng, scale: number, cb: (result: any) => void, context?: any): void {
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
}

export function neutrino(options: Partial<NeutrinoOptions>) {
  return new Neutrino(options);
}
