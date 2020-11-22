import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocodingCallback, GeocodingResult } from './interfaces';

export interface MapboxOptions {
  serviceUrl: string;
  geocodingQueryParams: any;
  reverseQueryParams: any;
}

export class Mapbox implements GeocoderAPI {
  options: MapboxOptions = {
    serviceUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
    geocodingQueryParams: {},
    reverseQueryParams: {}
  };

  constructor(accessToken: string, options?: Partial<MapboxOptions>) {
    L.Util.setOptions(this, options);
    this.options.geocodingQueryParams.access_token = accessToken;
    this.options.reverseQueryParams.access_token = accessToken;
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    const params = this.options.geocodingQueryParams;
    if (
      params.proximity !== undefined &&
      params.proximity.lat !== undefined &&
      params.proximity.lng !== undefined
    ) {
      params.proximity = params.proximity.lng + ',' + params.proximity.lat;
    }
    getJSON(this.options.serviceUrl + encodeURIComponent(query) + '.json', params, data => {
      const results: GeocodingResult[] = [];
      if (data.features && data.features.length) {
        for (let i = 0; i <= data.features.length - 1; i++) {
          const loc = data.features[i];
          const center = L.latLng(loc.center.reverse());
          let bbox: L.LatLngBounds;
          if (loc.bbox) {
            bbox = L.latLngBounds(
              L.latLng(loc.bbox.slice(0, 2).reverse()),
              L.latLng(loc.bbox.slice(2, 4).reverse())
            );
          } else {
            bbox = L.latLngBounds(center, center);
          }

          const properties = {
            text: loc.text,
            address: loc.address
          };

          for (let j = 0; j < (loc.context || []).length; j++) {
            const id = loc.context[j].id.split('.')[0];
            properties[id] = loc.context[j].text;

            // Get country code when available
            if (loc.context[j].short_code) {
              properties['countryShortCode'] = loc.context[j].short_code;
            }
          }

          results[i] = {
            name: loc.place_name,
            bbox: bbox,
            center: center,
            properties: properties
          };
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
    getJSON(
      this.options.serviceUrl +
        encodeURIComponent(location.lng) +
        ',' +
        encodeURIComponent(location.lat) +
        '.json',
      this.options.reverseQueryParams,
      data => {
        const results: GeocodingResult[] = [];
        if (data.features && data.features.length) {
          for (let i = 0; i <= data.features.length - 1; i++) {
            const loc = data.features[i];
            const center = L.latLng(loc.center.reverse());
            let bbox: L.LatLngBounds;
            if (loc.bbox) {
              bbox = L.latLngBounds(
                L.latLng(loc.bbox.slice(0, 2).reverse()),
                L.latLng(loc.bbox.slice(2, 4).reverse())
              );
            } else {
              bbox = L.latLngBounds(center, center);
            }
            results[i] = {
              name: loc.place_name,
              bbox: bbox,
              center: center
            };
          }
        }

        cb.call(context, results);
      }
    );
  }
}

export function mapbox(accessToken: string, options?: Partial<MapboxOptions>) {
  return new Mapbox(accessToken, options);
}
