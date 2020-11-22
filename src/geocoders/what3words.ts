import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocodingCallback } from './interfaces';

export class What3Words implements GeocoderAPI {
  options = {
    serviceUrl: 'https://api.what3words.com/v2/'
  };

  constructor(private accessToken: string) {}

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    //get three words and make a dot based string
    getJSON(
      this.options.serviceUrl + 'forward',
      {
        key: this.accessToken,
        addr: query.split(/\s+/).join('.')
      },
      function(data) {
        var results = [],
          latLng,
          latLngBounds;
        if (data.geometry) {
          latLng = L.latLng(data.geometry['lat'], data.geometry['lng']);
          latLngBounds = L.latLngBounds(latLng, latLng);
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
      {
        key: this.accessToken,
        coords: [location.lat, location.lng].join(',')
      },
      function(data) {
        var results = [],
          latLng,
          latLngBounds;
        if (data.status.status == 200) {
          latLng = L.latLng(data.geometry['lat'], data.geometry['lng']);
          latLngBounds = L.latLngBounds(latLng, latLng);
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
}

export function what3words(accessToken: string) {
  return new What3Words(accessToken);
}
