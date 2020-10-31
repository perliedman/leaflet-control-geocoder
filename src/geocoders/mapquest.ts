import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocodingResult } from './interfaces';

export interface MapQuestOptions {
  serviceUrl: string;
}

export class MapQuest implements GeocoderAPI {
  options: MapQuestOptions = {
    serviceUrl: 'https://www.mapquestapi.com/geocoding/v1'
  };

  private _key: string;

  constructor(key: string, options: Partial<MapQuestOptions>) {
    // MapQuest seems to provide URI encoded API keys,
    // so to avoid encoding them twice, we decode them here
    this._key = decodeURIComponent(key);

    L.Util.setOptions(this, options);
  }

  _formatName() {
    var r = [],
      i;
    for (i = 0; i < arguments.length; i++) {
      if (arguments[i]) {
        r.push(arguments[i]);
      }
    }

    return r.join(', ');
  }

  geocode(query: string, cb: (result: GeocodingResult[]) => void, context?: any): void {
    getJSON(
      this.options.serviceUrl + '/address',
      {
        key: this._key,
        location: query,
        limit: 5,
        outFormat: 'json'
      },
      L.Util.bind(function(data) {
        var results = [],
          loc,
          latLng;
        if (data.results && data.results[0].locations) {
          for (var i = data.results[0].locations.length - 1; i >= 0; i--) {
            loc = data.results[0].locations[i];
            latLng = L.latLng(loc.latLng);
            results[i] = {
              name: this._formatName(loc.street, loc.adminArea4, loc.adminArea3, loc.adminArea1),
              bbox: L.latLngBounds(latLng, latLng),
              center: latLng
            };
          }
        }

        cb.call(context, results);
      }, this)
    );
  }

  reverse(location: L.LatLng, scale: number, cb: (result: any) => void, context?: any): void {
    getJSON(
      this.options.serviceUrl + '/reverse',
      {
        key: this._key,
        location: location.lat + ',' + location.lng,
        outputFormat: 'json'
      },
      L.Util.bind(function(data) {
        var results = [],
          loc,
          latLng;
        if (data.results && data.results[0].locations) {
          for (var i = data.results[0].locations.length - 1; i >= 0; i--) {
            loc = data.results[0].locations[i];
            latLng = L.latLng(loc.latLng);
            results[i] = {
              name: this._formatName(loc.street, loc.adminArea4, loc.adminArea3, loc.adminArea1),
              bbox: L.latLngBounds(latLng, latLng),
              center: latLng
            };
          }
        }

        cb.call(context, results);
      }, this)
    );
  }
}

export function mapQuest(key: string, options: Partial<MapQuestOptions>) {
  return new MapQuest(key, options);
}
