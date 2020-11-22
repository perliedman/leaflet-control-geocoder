import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocodingCallback } from './interfaces';

export interface HereOptions {
  geocodeUrl: string;
  reverseGeocodeUrl: string;
  app_id: string;
  app_code: string;
  geocodingQueryParams?: Record<string, unknown>;
  reverseQueryParams?: Record<string, unknown>;
  reverseGeocodeProxRadius: null;
}

export class HERE implements GeocoderAPI {
  options: HereOptions = {
    geocodeUrl: 'https://geocoder.api.here.com/6.2/geocode.json',
    reverseGeocodeUrl: 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json',
    app_id: '<insert your app_id here>',
    app_code: '<insert your app_code here>',
    geocodingQueryParams: {},
    reverseQueryParams: {},
    reverseGeocodeProxRadius: null
  };

  constructor(options?: Partial<HereOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    var params = {
      searchtext: query,
      gen: 9,
      app_id: this.options.app_id,
      app_code: this.options.app_code,
      jsonattributes: 1
    };
    params = L.Util.extend(params, this.options.geocodingQueryParams);
    this.getJSON(this.options.geocodeUrl, params, cb, context);
  }

  reverse(
    location: L.LatLngLiteral,
    scale: number,
    cb: (result: any) => void,
    context?: any
  ): void {
    var _proxRadius = this.options.reverseGeocodeProxRadius
      ? this.options.reverseGeocodeProxRadius
      : null;
    var proxRadius = _proxRadius ? ',' + encodeURIComponent(_proxRadius) : '';
    var params = {
      prox: encodeURIComponent(location.lat) + ',' + encodeURIComponent(location.lng) + proxRadius,
      mode: 'retrieveAddresses',
      app_id: this.options.app_id,
      app_code: this.options.app_code,
      gen: 9,
      jsonattributes: 1
    };
    params = L.Util.extend(params, this.options.reverseQueryParams);
    this.getJSON(this.options.reverseGeocodeUrl, params, cb, context);
  }

  getJSON(url: string, params: any, cb: (result: any) => void, context?: any) {
    getJSON(url, params, function(data) {
      var results = [],
        loc,
        latLng,
        latLngBounds;
      if (data.response.view && data.response.view.length) {
        for (var i = 0; i <= data.response.view[0].result.length - 1; i++) {
          loc = data.response.view[0].result[i].location;
          latLng = L.latLng(loc.displayPosition.latitude, loc.displayPosition.longitude);
          latLngBounds = L.latLngBounds(
            L.latLng(loc.mapView.topLeft.latitude, loc.mapView.topLeft.longitude),
            L.latLng(loc.mapView.bottomRight.latitude, loc.mapView.bottomRight.longitude)
          );
          results[i] = {
            name: loc.address.label,
            properties: loc.address,
            bbox: latLngBounds,
            center: latLng
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
