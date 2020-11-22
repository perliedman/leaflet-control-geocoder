import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocodingCallback } from './interfaces';

export interface OpenCageOptions {
  serviceUrl: string;
  geocodingQueryParams?: object;
  reverseQueryParams?: object;
}

export class OpenCage implements GeocoderAPI {
  options: OpenCageOptions = {
    serviceUrl: 'https://api.opencagedata.com/geocode/v1/json',
    geocodingQueryParams: {},
    reverseQueryParams: {}
  };

  constructor(private apiKey: string, options?: Partial<OpenCageOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    var params = {
      key: this.apiKey,
      q: query
    };
    params = L.Util.extend(params, this.options.geocodingQueryParams);
    getJSON(this.options.serviceUrl, params, function(data) {
      var results = [],
        latLng,
        latLngBounds,
        loc;
      if (data.results && data.results.length) {
        for (var i = 0; i < data.results.length; i++) {
          loc = data.results[i];
          latLng = L.latLng(loc.geometry);
          if (loc.annotations && loc.annotations.bounds) {
            latLngBounds = L.latLngBounds(
              L.latLng(loc.annotations.bounds.northeast),
              L.latLng(loc.annotations.bounds.southwest)
            );
          } else {
            latLngBounds = L.latLngBounds(latLng, latLng);
          }
          results.push({
            name: loc.formatted,
            bbox: latLngBounds,
            center: latLng
          });
        }
      }
      cb.call(context, results);
    });
  }

  suggest(query: string, cb: GeocodingCallback, context?: any): void {
    return this.geocode(query, cb, context);
  }

  reverse(location: L.LatLngLiteral, scale: number, cb: (result: any) => void, context?: any): void {
    var params = {
      key: this.apiKey,
      q: [location.lat, location.lng].join(',')
    };
    params = L.Util.extend(params, this.options.reverseQueryParams);
    getJSON(this.options.serviceUrl, params, function(data) {
      var results = [],
        latLng,
        latLngBounds,
        loc;
      if (data.results && data.results.length) {
        for (var i = 0; i < data.results.length; i++) {
          loc = data.results[i];
          latLng = L.latLng(loc.geometry);
          if (loc.annotations && loc.annotations.bounds) {
            latLngBounds = L.latLngBounds(
              L.latLng(loc.annotations.bounds.northeast),
              L.latLng(loc.annotations.bounds.southwest)
            );
          } else {
            latLngBounds = L.latLngBounds(latLng, latLng);
          }
          results.push({
            name: loc.formatted,
            bbox: latLngBounds,
            center: latLng
          });
        }
      }
      cb.call(context, results);
    });
  }
}

export function opencage(apiKey: string, options?: Partial<OpenCageOptions>) {
  return new OpenCage(apiKey, options);
}
