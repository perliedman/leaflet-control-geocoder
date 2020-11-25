import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocoderOptions, GeocodingCallback, GeocodingResult } from './api';

export interface OpenCageOptions extends GeocoderOptions {}

export class OpenCage implements GeocoderAPI {
  options: OpenCageOptions = {
    serviceUrl: 'https://api.opencagedata.com/geocode/v1/json'
  };

  constructor(options?: Partial<OpenCageOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    const params = L.Util.extend(
      { key: this.options.apiKey, q: query },
      this.options.geocodingQueryParams
    );
    getJSON(this.options.serviceUrl, params, data => {
      const results: GeocodingResult[] = [];
      if (data.results && data.results.length) {
        for (let i = 0; i < data.results.length; i++) {
          const loc = data.results[i];
          const center = L.latLng(loc.geometry);
          let bbox: L.LatLngBounds;
          if (loc.annotations && loc.annotations.bounds) {
            bbox = L.latLngBounds(
              L.latLng(loc.annotations.bounds.northeast),
              L.latLng(loc.annotations.bounds.southwest)
            );
          } else {
            bbox = L.latLngBounds(center, center);
          }
          results.push({
            name: loc.formatted,
            bbox: bbox,
            center: center
          });
        }
      }
      cb.call(context, results);
    });
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
    let params = {
      key: this.options.apiKey,
      q: [location.lat, location.lng].join(',')
    };
    params = L.Util.extend(params, this.options.reverseQueryParams);
    getJSON(this.options.serviceUrl, params, data => {
      const results: GeocodingResult[] = [];
      if (data.results && data.results.length) {
        for (let i = 0; i < data.results.length; i++) {
          const loc = data.results[i];
          const center = L.latLng(loc.geometry);
          let bbox: L.LatLngBounds;
          if (loc.annotations && loc.annotations.bounds) {
            bbox = L.latLngBounds(
              L.latLng(loc.annotations.bounds.northeast),
              L.latLng(loc.annotations.bounds.southwest)
            );
          } else {
            bbox = L.latLngBounds(center, center);
          }
          results.push({
            name: loc.formatted,
            bbox: bbox,
            center: center
          });
        }
      }
      cb.call(context, results);
    });
  }
}

export function opencage(options?: Partial<OpenCageOptions>) {
  return new OpenCage(options);
}
