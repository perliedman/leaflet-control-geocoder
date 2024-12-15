import * as L from 'leaflet';

/**
 * An object that represents a result from a geocoding query
 */
export interface GeocodingResult {
  /**
   * Name of found location
   */
  name: string;
  /**
   * The bounds of the location
   */
  bbox: L.LatLngBounds;
  /**
   * The center coordinate of the location
   */
  center: L.LatLng;
  /**
   * URL for icon representing result; optional
   */
  icon?: string;
  /**
   * HTML formatted representation of the name
   */
  html?: string;
  /**
   * Additional properties returned by the geocoder
   */
  properties?: any;
}

/**
 * An interface implemented to respond to geocoding queries
 */
export interface IGeocoder {
  /**
   * Performs a geocoding query and returns the results as promise
   * @param query the query
   */
  geocode(query: string): Promise<GeocodingResult[]>;
  /**
   * Performs a geocoding query suggestion (this happens while typing) and returns the results as promise
   * @param query the query
   */
  suggest?(query: string): Promise<GeocodingResult[]>;
  /**
   * Performs a reverse geocoding query and returns the results as promise
   * @param location the coordinate to reverse geocode
   * @param scale the map scale possibly used for reverse geocoding
   */
  reverse?(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]>;
}

export interface GeocoderOptions {
  /**
   * URL of the service
   */
  serviceUrl: string;
  /**
   * Additional URL parameters (strings) that will be added to geocoding requests
   */
  geocodingQueryParams?: Record<string, unknown>;
  /**
   * Additional URL parameters (strings) that will be added to reverse geocoding requests
   */
  reverseQueryParams?: Record<string, unknown>;
  /**
   * API key to use this service
   */
  apiKey?: string;
}

/**
 * @internal
 */
export function geocodingParams(
  options: GeocoderOptions,
  params: Record<string, unknown>
): Record<string, unknown> {
  return L.Util.extend(params, options.geocodingQueryParams);
}

/**
 * @internal
 */
export function reverseParams(
  options: GeocoderOptions,
  params: Record<string, unknown>
): Record<string, unknown> {
  return L.Util.extend(params, options.reverseQueryParams);
}
