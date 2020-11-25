import * as L from 'leaflet';
import { getJSON } from '../util';
import {
  GeocoderAPI,
  GeocoderOptions,
  GeocodingCallback,
  geocodingParams,
  GeocodingResult,
  reverseParams
} from './api';

export interface HereOptions extends GeocoderOptions {
  app_id: string;
  app_code: string;
  reverseGeocodeProxRadius: null;
}

export class HERE implements GeocoderAPI {
  options: HereOptions = {
    serviceUrl: 'https://geocoder.api.here.com/6.2/',
    app_id: '',
    app_code: '',
    reverseGeocodeProxRadius: null
  };

  constructor(options?: Partial<HereOptions>) {
    L.Util.setOptions(this, options);
    if (options.apiKey) throw Error('apiKey is not supported, use app_id/app_code instead!');
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    const params = geocodingParams(this.options, {
      searchtext: query,
      gen: 9,
      app_id: this.options.app_id,
      app_code: this.options.app_code,
      jsonattributes: 1
    });
    this.getJSON(this.options.serviceUrl + 'geocode.json', params, cb, context);
  }

  reverse(
    location: L.LatLngLiteral,
    scale: number,
    cb: (result: any) => void,
    context?: any
  ): void {
    const _proxRadius = this.options.reverseGeocodeProxRadius
      ? this.options.reverseGeocodeProxRadius
      : null;
    const proxRadius = _proxRadius ? ',' + encodeURIComponent(_proxRadius) : '';
    const params = reverseParams(this.options, {
      prox: encodeURIComponent(location.lat) + ',' + encodeURIComponent(location.lng) + proxRadius,
      mode: 'retrieveAddresses',
      app_id: this.options.app_id,
      app_code: this.options.app_code,
      gen: 9,
      jsonattributes: 1
    });
    this.getJSON(this.options.serviceUrl + 'reversegeocode.json', params, cb, context);
  }

  getJSON(url: string, params: any, cb: (result: any) => void, context?: any) {
    getJSON(url, params, data => {
      const results: GeocodingResult[] = [];
      if (data.response.view && data.response.view.length) {
        for (let i = 0; i <= data.response.view[0].result.length - 1; i++) {
          const loc = data.response.view[0].result[i].location;
          const center = L.latLng(loc.displayPosition.latitude, loc.displayPosition.longitude);
          const bbox = L.latLngBounds(
            L.latLng(loc.mapView.topLeft.latitude, loc.mapView.topLeft.longitude),
            L.latLng(loc.mapView.bottomRight.latitude, loc.mapView.bottomRight.longitude)
          );
          results[i] = {
            name: loc.address.label,
            properties: loc.address,
            bbox: bbox,
            center: center
          };
        }
      }
      cb.call(context, results);
    });
  }
}

export function here(options?: Partial<HereOptions>) {
  return new HERE(options);
}
