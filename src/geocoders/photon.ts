import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderAPI, GeocodingCallback } from './interfaces';

export interface PhotonOptions {
  serviceUrl: string;
  reverseUrl: string;
  nameProperties: string[];
  geocodingQueryParams?: object;
  reverseQueryParams?: object;
  htmlTemplate?: (r: any) => string;
}

export class Photon implements GeocoderAPI {
  options: PhotonOptions = {
    serviceUrl: 'https://photon.komoot.io/api/',
    reverseUrl: 'https://photon.komoot.io/reverse/',
    nameProperties: ['name', 'street', 'suburb', 'hamlet', 'town', 'city', 'state', 'country']
  };

  constructor(options: Partial<PhotonOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    var params = L.Util.extend(
      {
        q: query
      },
      this.options.geocodingQueryParams
    );

    getJSON(
      this.options.serviceUrl,
      params,
      L.Util.bind(function(data) {
        cb.call(context, this._decodeFeatures(data));
      }, this)
    );
  }

  suggest(query: string, cb: GeocodingCallback, context?: any): void {
    return this.geocode(query, cb, context);
  }

  reverse(latLng: L.LatLng, scale: number, cb: (result: any) => void, context?: any): void {
    var params = L.Util.extend(
      {
        lat: latLng.lat,
        lon: latLng.lng
      },
      this.options.reverseQueryParams
    );

    getJSON(
      this.options.reverseUrl,
      params,
      L.Util.bind(function(data) {
        cb.call(context, this._decodeFeatures(data));
      }, this)
    );
  }

  _decodeFeatures(data: GeoJSON.FeatureCollection<GeoJSON.Point>) {
    var results = [],
      i,
      f,
      c,
      latLng,
      extent,
      bbox;

    if (data && data.features) {
      for (i = 0; i < data.features.length; i++) {
        f = data.features[i];
        c = f.geometry.coordinates;
        latLng = L.latLng(c[1], c[0]);
        extent = f.properties.extent;

        if (extent) {
          bbox = L.latLngBounds([extent[1], extent[0]], [extent[3], extent[2]]);
        } else {
          bbox = L.latLngBounds(latLng, latLng);
        }

        results.push({
          name: this._decodeFeatureName(f),
          html: this.options.htmlTemplate ? this.options.htmlTemplate(f) : undefined,
          center: latLng,
          bbox: bbox,
          properties: f.properties
        });
      }
    }

    return results;
  }

  _decodeFeatureName(f: GeoJSON.Feature) {
    return (this.options.nameProperties || [])
      .map(function(p) {
        return f.properties[p];
      })
      .filter(function(v) {
        return !!v;
      })
      .join(', ');
  }
}

export function photon(options: Partial<PhotonOptions>) {
  return new Photon(options);
}
