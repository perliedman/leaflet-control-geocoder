import * as L from 'leaflet';
import { getJSON } from '../util';
import {
  GeocoderOptions,
  GeocodingContext,
  geocodingParams,
  GeocodingResult,
  IGeocoder,
  reverseParams
} from './api';

export interface PhotonOptions extends GeocoderOptions {
  reverseUrl: string;
  nameProperties: string[];
  htmlTemplate?: (r: any) => string;
}

/**
 * Implementation of the [Photon](http://photon.komoot.io/) geocoder
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

  async geocode(query: string, context?: GeocodingContext): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, { q: query });
    const center = context?.map?.getCenter?.();
    if (center) {
      params.lat = center.lat;
      params.lon = center.lng;
    }
    const zoom = context?.map?.getZoom?.();
    if (zoom) {
      params.zoom = zoom;
    }
    const data = await getJSON<any>(this.options.serviceUrl, params);
    return this._parseResults(data);
  }

  suggest(query: string): Promise<GeocodingResult[]> {
    return this.geocode(query);
  }

  async reverse(latLng: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      lat: latLng.lat,
      lon: latLng.lng
    });
    const data = await getJSON<any>(this.options.reverseUrl, params);
    return this._parseResults(data);
  }

  _parseResults(data: GeoJSON.FeatureCollection<GeoJSON.Point>): GeocodingResult[] {
    return (data.features || []).map((f): GeocodingResult => {
      const c = f.geometry.coordinates;
      const center = new L.LatLng(c[1], c[0]);
      const extent = f.properties?.extent;

      const bbox = extent
        ? new L.LatLngBounds([extent[1], extent[0]], [extent[3], extent[2]])
        : new L.LatLngBounds(center, center);

      return {
        name: this._decodeFeatureName(f),
        html: this.options.htmlTemplate ? this.options.htmlTemplate(f) : undefined,
        center,
        bbox,
        properties: f.properties
      };
    });
  }

  _decodeFeatureName(f: GeoJSON.Feature) {
    return (this.options.nameProperties || [])
      .map(p => f.properties?.[p])
      .filter(v => !!v)
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

/**
 * @internal
 */
export type PhotonResponse = GeoJSON.FeatureCollection<GeoJSON.Geometry, PhotonProperties>;

interface PhotonProperties {
  osm_id: number;
  osm_type: string;
  extent?: number[];
  country: string;
  osm_key: string;
  city: string;
  countrycode: string;
  osm_value: string;
  name: string;
  state: string;
  type: string;
  postcode?: string;
  housenumber?: string;
  street?: string;
  district?: string;
}
