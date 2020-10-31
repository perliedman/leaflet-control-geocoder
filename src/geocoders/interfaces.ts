import * as L from 'leaflet';

export interface GeocodingResult {
  name: string;
  bbox: L.LatLngBounds;
  center: L.LatLng;
  icon?: string;
  html?: string;
  properties?: any;
}

export type GeocodingCallback = (result: GeocodingResult[]) => void;

export interface GeocoderAPI {
  geocode(query: string, cb: GeocodingCallback, context?: any): void;
  suggest?(query: string, cb: GeocodingCallback, context?: any): void;
  reverse?(location: L.LatLng, scale: number, cb: (result: any) => void, context?: any): void;
}
