import * as L from 'leaflet';
import { jsonp } from '../util';
import {
  GeocoderAPI,
  GeocoderOptions,
  GeocodingCallback,
  geocodingParams,
  GeocodingResult,
  reverseParams
} from './api';

export interface BingOptions extends GeocoderOptions {}

export class Bing implements GeocoderAPI {
  options: BingOptions = {
    serviceUrl: 'https://dev.virtualearth.net/REST/v1/Locations'
  };

  constructor(options?: Partial<BingOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    const params = geocodingParams(this.options, {
      query: query,
      key: this.options.apiKey
    });
    jsonp(
      this.options.apiKey,
      params,
      data => {
        const results: GeocodingResult[] = [];
        if (data.resourceSets.length > 0) {
          for (let i = data.resourceSets[0].resources.length - 1; i >= 0; i--) {
            const resource = data.resourceSets[0].resources[i],
              bbox = resource.bbox;
            results[i] = {
              name: resource.name,
              bbox: L.latLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
              center: L.latLng(resource.point.coordinates)
            };
          }
        }
        cb.call(context, results);
      },
      this,
      'jsonp'
    );
  }

  reverse(
    location: L.LatLngLiteral,
    scale: number,
    cb: (result: any) => void,
    context?: any
  ): void {
    const params = reverseParams(this.options, {
      key: this.options.apiKey
    });
    jsonp(
      this.options.serviceUrl + location.lat + ',' + location.lng,
      params,
      data => {
        const results: GeocodingResult[] = [];
        for (let i = data.resourceSets[0].resources.length - 1; i >= 0; i--) {
          const resource = data.resourceSets[0].resources[i],
            bbox = resource.bbox;
          results[i] = {
            name: resource.name,
            bbox: L.latLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
            center: L.latLng(resource.point.coordinates)
          };
        }
        cb.call(context, results);
      },
      this,
      'jsonp'
    );
  }
}

export function bing(options?: Partial<BingOptions>) {
  return new Bing(options);
}
