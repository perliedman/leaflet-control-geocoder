import * as L from 'leaflet';
import { getJSON } from '../util';
import {
  GeocoderAPI,
  GeocoderOptions,
  GeocodingCallback,
  geocodingParams,
  GeocodingResult,
  ReverseGeocodingResult
} from './api';

export interface ArcGisOptions extends GeocoderOptions {}

export class ArcGis implements GeocoderAPI {
  options: ArcGisOptions = {
    serviceUrl: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
    apiKey: ''
  };

  constructor(options?: Partial<ArcGisOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    const params = geocodingParams(this.options, {
      token: this.options.apiKey,
      SingleLine: query,
      outFields: 'Addr_Type',
      forStorage: false,
      maxLocations: 10,
      f: 'json'
    });

    getJSON(this.options.serviceUrl + '/findAddressCandidates', params, data => {
      const results: GeocodingResult[] = [];
      if (data.candidates && data.candidates.length) {
        for (let i = 0; i <= data.candidates.length - 1; i++) {
          const loc = data.candidates[i];
          const latLng = L.latLng(loc.location.y, loc.location.x);
          const latLngBounds = L.latLngBounds(
            L.latLng(loc.extent.ymax, loc.extent.xmax),
            L.latLng(loc.extent.ymin, loc.extent.xmin)
          );
          results[i] = {
            name: loc.address,
            bbox: latLngBounds,
            center: latLng
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
    const params = {
      location: encodeURIComponent(location.lng) + ',' + encodeURIComponent(location.lat),
      distance: 100,
      f: 'json'
    };

    getJSON(this.options.serviceUrl + '/reverseGeocode', params, data => {
      const result: ReverseGeocodingResult[] = [];
      if (data && !data.error) {
        const center = L.latLng(data.location.y, data.location.x);
        const bbox = L.latLngBounds(center, center);
        result.push({
          name: data.address.Match_addr,
          center: center,
          bbox: bbox,
          bounds: bbox
        });
      }

      cb.call(context, result);
    });
  }
}

export function arcgis(options?: Partial<ArcGisOptions>) {
  return new ArcGis(options);
}
