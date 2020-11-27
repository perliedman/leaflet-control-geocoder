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

export interface GoogleOptions extends GeocoderOptions {}

export class Google implements IGeocoder {
  options: GoogleOptions = {
    serviceUrl: 'https://maps.googleapis.com/maps/api/geocode/json'
  };

  constructor(options?: Partial<GoogleOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    const params = geocodingParams(this.options, {
      key: this.options.apiKey,
      address: query
    });
    getJSON(this.options.serviceUrl, params, data => {
      const results: GeocodingResult[] = [];
      if (data.results && data.results.length) {
        for (let i = 0; i <= data.results.length - 1; i++) {
          const loc = data.results[i];
          const latLng = L.latLng(loc.geometry.location);
          const latLngBounds = L.latLngBounds(
            L.latLng(loc.geometry.viewport.northeast),
            L.latLng(loc.geometry.viewport.southwest)
          );
          results[i] = {
            name: loc.formatted_address,
            bbox: latLngBounds,
            center: latLng,
            properties: loc.address_components
          };
        }
      }

      cb.call(context, results);
    });
  }

  reverse(
    location: L.LatLngLiteral,
    scale: number,
    cb: (result: any) => void,
    context?: any
  ): void {
    const params = reverseParams(this.options, {
      key: this.options.apiKey,
      latlng: encodeURIComponent(location.lat) + ',' + encodeURIComponent(location.lng)
    });
    getJSON(this.options.serviceUrl, params, data => {
      const results: GeocodingResult[] = [];
      if (data.results && data.results.length) {
        for (let i = 0; i <= data.results.length - 1; i++) {
          const loc = data.results[i];
          const center = L.latLng(loc.geometry.location);
          const bbox = L.latLngBounds(
            L.latLng(loc.geometry.viewport.northeast),
            L.latLng(loc.geometry.viewport.southwest)
          );
          results[i] = {
            name: loc.formatted_address,
            bbox: bbox,
            center: center,
            properties: loc.address_components
          };
        }
      }

      cb.call(context, results);
    });
  }
}

export function google(options?: Partial<GoogleOptions>) {
  return new Google(options);
}
