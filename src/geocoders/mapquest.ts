import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocodingCallback, GeocodingResult } from './interfaces';

export interface MapQuestOptions {
  serviceUrl: string;
}

export class MapQuest implements GeocoderAPI {
  options: MapQuestOptions = {
    serviceUrl: 'https://www.mapquestapi.com/geocoding/v1'
  };

  private _key: string;

  constructor(key: string, options?: Partial<MapQuestOptions>) {
    // MapQuest seems to provide URI encoded API keys,
    // so to avoid encoding them twice, we decode them here
    this._key = decodeURIComponent(key);

    L.Util.setOptions(this, options);
  }

  _formatName(...parts: string[]) {
    return parts.filter(s => !!s).join(', ');
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    getJSON(
      this.options.serviceUrl + '/address',
      {
        key: this._key,
        location: query,
        limit: 5,
        outFormat: 'json'
      },
      L.Util.bind(function(data) {
        const results: GeocodingResult[] = [];
        if (data.results && data.results[0].locations) {
          for (let i = data.results[0].locations.length - 1; i >= 0; i--) {
            const loc = data.results[0].locations[i];
            const center = L.latLng(loc.latLng);
            results[i] = {
              name: this._formatName(loc.street, loc.adminArea4, loc.adminArea3, loc.adminArea1),
              bbox: L.latLngBounds(center, center),
              center: center
            };
          }
        }

        cb.call(context, results);
      }, this)
    );
  }

  reverse(
    location: L.LatLngLiteral,
    scale: number,
    cb: (result: any) => void,
    context?: any
  ): void {
    getJSON(
      this.options.serviceUrl + '/reverse',
      {
        key: this._key,
        location: location.lat + ',' + location.lng,
        outputFormat: 'json'
      },
      L.Util.bind(function(data) {
        const results: GeocodingResult[] = [];
        if (data.results && data.results[0].locations) {
          for (let i = data.results[0].locations.length - 1; i >= 0; i--) {
            const loc = data.results[0].locations[i];
            const center = L.latLng(loc.latLng);
            results[i] = {
              name: this._formatName(loc.street, loc.adminArea4, loc.adminArea3, loc.adminArea1),
              bbox: L.latLngBounds(center, center),
              center: center
            };
          }
        }

        cb.call(context, results);
      }, this)
    );
  }
}

export function mapQuest(key: string, options?: Partial<MapQuestOptions>) {
  return new MapQuest(key, options);
}
