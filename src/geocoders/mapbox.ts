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

export interface MapboxOptions extends GeocoderOptions {}

/**
 * Implementation of the [Mapbox Geocoding](https://www.mapbox.com/api-documentation/#geocoding)
 */
export class Mapbox implements IGeocoder {
  options: MapboxOptions = {
    serviceUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
  };

  constructor(options?: Partial<MapboxOptions>) {
    L.Util.setOptions(this, options);
  }

  _getProperties(loc) {
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
    return properties;
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    const params: any = geocodingParams(this.options, {
      access_token: this.options.apiKey
    });
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

          results[i] = {
            name: loc.place_name,
            bbox: bbox,
            center: center,
            properties: this._getProperties(loc)
          };
        }
      }

      cb.call(context, results);
    });
  }

  suggest(query: string, cb: GeocodingCallback, context?: any): void {
    return this.geocode(query, cb, context);
  }

  reverse(location: L.LatLngLiteral, scale: number, cb: GeocodingCallback, context?: any): void {
    const url = this.options.serviceUrl + location.lng + ',' + location.lat + '.json';
    const param = reverseParams(this.options, {
      access_token: this.options.apiKey
    });
    getJSON(url, param, data => {
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
            center: center,
            properties: this._getProperties(loc)
          };
        }
      }

      cb.call(context, results);
    });
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Mapbox}
 * @param options the options
 */
export function mapbox(options?: Partial<MapboxOptions>) {
  return new Mapbox(options);
}
