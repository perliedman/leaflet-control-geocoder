import * as L from 'leaflet';
import { jsonp } from '../util';
import { GeocoderAPI, GeocodingCallback, GeocodingResult } from './interfaces';

export class Bing implements GeocoderAPI {
  constructor(private key: string) {}

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    jsonp(
      'https://dev.virtualearth.net/REST/v1/Locations',
      {
        query: query,
        key: this.key
      },
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
    jsonp(
      '//dev.virtualearth.net/REST/v1/Locations/' + location.lat + ',' + location.lng,
      {
        key: this.key
      },
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

export function bing(key: string) {
  return new Bing(key);
}
