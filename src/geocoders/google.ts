import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocodingCallback, GeocodingResult } from './interfaces';

export interface GoogleOptions {
  serviceUrl: string;
  geocodingQueryParams?: Record<string, unknown>;
  reverseQueryParams?: Record<string, unknown>;
}

export class Google implements GeocoderAPI {
  options: GoogleOptions = {
    serviceUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
    geocodingQueryParams: {},
    reverseQueryParams: {}
  };

  constructor(private key: string, options?: Partial<GoogleOptions>) {
    L.Util.setOptions(this, options);
    // Backwards compatibility
    this.options.serviceUrl = (this.options as any).service_url || this.options.serviceUrl;
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    let params = {
      key: this.key,
      address: query
    };

    params = L.Util.extend(params, this.options.geocodingQueryParams);

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
    let params = {
      key: this.key,
      latlng: encodeURIComponent(location.lat) + ',' + encodeURIComponent(location.lng)
    };
    params = L.Util.extend(params, this.options.reverseQueryParams);

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

export function google(key: string, options?: Partial<GoogleOptions>) {
  return new Google(key, options);
}
