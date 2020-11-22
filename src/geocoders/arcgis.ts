import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocodingCallback } from './interfaces';

export interface ArcGisOptions {
  geocodingQueryParams?: any;
  service_url: string;
}

export class ArcGis implements GeocoderAPI {
  options: ArcGisOptions = {
    service_url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
  };

  constructor(private accessToken: string, options?: Partial<ArcGisOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    var params = {
      token: this.accessToken,
      SingleLine: query,
      outFields: 'Addr_Type',
      forStorage: false,
      maxLocations: 10,
      f: 'json'
    };

    getJSON(
      this.options.service_url + '/findAddressCandidates',
      L.Util.extend(params, this.options.geocodingQueryParams),
      function(data) {
        var results = [],
          loc,
          latLng,
          latLngBounds;

        if (data.candidates && data.candidates.length) {
          for (var i = 0; i <= data.candidates.length - 1; i++) {
            loc = data.candidates[i];
            latLng = L.latLng(loc.location.y, loc.location.x);
            latLngBounds = L.latLngBounds(
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
    var params = {
      location: encodeURIComponent(location.lng) + ',' + encodeURIComponent(location.lat),
      distance: 100,
      f: 'json'
    };

    getJSON(this.options.service_url + '/reverseGeocode', params, function(data) {
      var result = [],
        loc;

      if (data && !data.error) {
        loc = L.latLng(data.location.y, data.location.x);
        result.push({
          name: data.address.Match_addr,
          center: loc,
          bounds: L.latLngBounds(loc, loc)
        });
      }

      cb.call(context, result);
    });
  }
}

export function arcgis(accessToken: string, options?: Partial<ArcGisOptions>) {
  return new ArcGis(accessToken, options);
}
