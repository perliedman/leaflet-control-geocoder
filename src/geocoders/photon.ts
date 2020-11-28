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

export interface PhotonOptions extends GeocoderOptions {
  reverseUrl: string;
  nameProperties: string[];
  htmlTemplate?: (r: any) => string;
}

/**
 * Implementation of the [Photon](http://photon.komoot.de/) geocoder
 */
export class Photon implements IGeocoder {
  options: PhotonOptions = {
    serviceUrl: 'https://photon.komoot.io/api/',
    reverseUrl: 'https://photon.komoot.io/reverse/',
    nameProperties: ['name', 'street', 'suburb', 'hamlet', 'town', 'city', 'state', 'country']
  };

  constructor(options?: Partial<PhotonOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    const params = geocodingParams(this.options, { q: query });
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

  reverse(latLng: L.LatLngLiteral, scale: number, cb: GeocodingCallback, context?: any): void {
    const params = reverseParams(this.options, {
      lat: latLng.lat,
      lon: latLng.lng
    });
    getJSON(
      this.options.reverseUrl,
      params,
      L.Util.bind(function(data) {
        cb.call(context, this._decodeFeatures(data));
      }, this)
    );
  }

  _decodeFeatures(data: GeoJSON.FeatureCollection<GeoJSON.Point>) {
    const results: GeocodingResult[] = [];

    if (data && data.features) {
      for (let i = 0; i < data.features.length; i++) {
        const f = data.features[i];
        const c = f.geometry.coordinates;
        const center = L.latLng(c[1], c[0]);
        const extent = f.properties.extent;

        const bbox = extent
          ? L.latLngBounds([extent[1], extent[0]], [extent[3], extent[2]])
          : L.latLngBounds(center, center);

        results.push({
          name: this._decodeFeatureName(f),
          html: this.options.htmlTemplate ? this.options.htmlTemplate(f) : undefined,
          center: center,
          bbox: bbox,
          properties: f.properties
        });
      }
    }

    return results;
  }

  _decodeFeatureName(f: GeoJSON.Feature) {
    return (this.options.nameProperties || [])
      .map(p => {
        return f.properties[p];
      })
      .filter(v => {
        return !!v;
      })
      .join(', ');
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Photon}
 * @param options the options
 */
export function photon(options?: Partial<PhotonOptions>) {
  return new Photon(options);
}
