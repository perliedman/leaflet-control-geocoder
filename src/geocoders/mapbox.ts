import * as L from 'leaflet';
import { getJSON } from '../util';
import { IGeocoder, GeocoderOptions, geocodingParams, GeocodingResult, reverseParams } from './api';

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

  _getProperties(loc: Feature) {
    const properties = {
      text: loc.text,
      address: loc.address
    };

    (loc.context || []).forEach(context => {
      const id = context.id.split('.')[0];
      properties[id] = context.text;

      // Get country code when available
      if (context.short_code) {
        properties['countryShortCode'] = context.short_code;
      }
    });
    return properties;
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    const url = this.options.serviceUrl + encodeURIComponent(query) + '.json';
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
    const data = await getJSON<MapboxResponse>(url, params);
    return this._parseResults(data);
  }

  suggest(query: string): Promise<GeocodingResult[]> {
    return this.geocode(query);
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const url = this.options.serviceUrl + location.lng + ',' + location.lat + '.json';
    const param = reverseParams(this.options, {
      access_token: this.options.apiKey
    });
    const data = await getJSON<MapboxResponse>(url, param);
    return this._parseResults(data);
  }

  private _parseResults(data: MapboxResponse): any[] | GeocodingResult[] {
    if (!data.features?.length) {
      return [];
    }
    return data.features.map((loc): GeocodingResult => {
      const center = new L.LatLng(...loc.center.reverse() as [number, number]);
      let bbox: L.LatLngBounds;
      if (loc.bbox) {
        bbox = new L.LatLngBounds(
          new L.LatLng(...loc.bbox.slice(0, 2).reverse() as [number, number]),
          new L.LatLng(...loc.bbox.slice(2, 4).reverse() as [number, number])
        );
      } else {
        bbox = new L.LatLngBounds(center, center);
      }
      return {
        name: loc.place_name,
        bbox,
        center,
        properties: this._getProperties(loc)
      };
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

/**
 * @internal
 */
export interface MapboxResponse {
  type: string;
  query: string[];
  features: Feature[];
  attribution: string;
}

interface Feature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: Properties;
  text: string;
  place_name: string;
  matching_text: string;
  matching_place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
  geometry: Geometry;
  address: string;
  context: Context[];
}

interface Context {
  id: string;
  text: string;
  wikidata?: string;
  short_code?: string;
}

interface Geometry {
  type: string;
  coordinates: number[];
  interpolated: boolean;
  omitted: boolean;
}

interface Properties {}
