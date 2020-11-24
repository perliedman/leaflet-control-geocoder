import * as L from 'leaflet';

export interface GeocodingResult {
  name: string;
  bbox: L.LatLngBounds;
  center: L.LatLng;
  icon?: string;
  html?: string;
  properties?: any;
}

export interface ReverseGeocodingResult extends GeocodingResult {
  /**
   * @deprecated
   */
  bounds: L.LatLngBounds;
}

export type GeocodingCallback = (result: GeocodingResult[]) => void;

export interface GeocoderAPI {
  geocode(query: string, cb: GeocodingCallback, context?: any): void;
  suggest?(query: string, cb: GeocodingCallback, context?: any): void;
  reverse?(
    location: L.LatLngLiteral,
    scale: number,
    cb: (result: any) => void,
    context?: any
  ): void;
}

export interface GeocoderOptions {
  serviceUrl: string;
  geocodingQueryParams?: Record<string, unknown>;
  reverseQueryParams?: Record<string, unknown>;
  apiKey?: string;
}
