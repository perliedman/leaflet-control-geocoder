import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderOptions, geocodingParams, GeocodingResult, IGeocoder, reverseParams } from './api';

export interface OpenGeocodingOptions extends GeocoderOptions {
  /**
   * Maximum number of reverse geocoding results
   */
  reverseLimit: number;
}

/**
 * Implementation of the [OpenGeocoding](https://opengeocoding.com/) API.
 *
 * Use a browser key restricted to your site's origins; the API rejects keys
 * in the URL, so the key is sent in the `x-api-key` header.
 *
 * Search returns at most one result. Suggestions are not wired up: the
 * autocomplete endpoint returns place IDs without coordinates.
 */
export class OpenGeocoding implements IGeocoder {
  options: OpenGeocodingOptions = {
    serviceUrl: 'https://api.opengeocoding.com/v1',
    reverseLimit: 1
  };

  constructor(options?: Partial<OpenGeocodingOptions>) {
    L.Util.setOptions(this, options);
    if (!this.options.apiKey) {
      throw new Error('OpenGeocoding requires an API key.');
    }
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, { addressString: query });
    const data = await getJSON<OpenGeocodingAddress>(
      this.options.serviceUrl + '/search',
      params,
      this._headers()
    );
    const result = this._parseAddress(data);
    return result ? [result] : [];
  }

  async reverse(location: L.LatLngLiteral, _scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      lat: location.lat,
      lon: location.lng,
      size: this.options.reverseLimit
    });
    const data = await getJSON<OpenGeocodingReverseResponse>(
      this.options.serviceUrl + '/reverse',
      params,
      this._headers()
    );
    return (data.results || [])
      .map(r => this._parseAddress(r.address, r))
      .filter((r): r is GeocodingResult => !!r);
  }

  private _headers() {
    return { 'x-api-key': this.options.apiKey! };
  }

  private _parseAddress(
    address: OpenGeocodingAddress | undefined,
    properties: unknown = address
  ): GeocodingResult | undefined {
    const c = address?.geoCoordinates;
    if (!c) {
      return undefined;
    }
    // Protobuf JSON omits zero values, so a missing lat or lon means 0.
    const center = new L.LatLng(c.lat ?? 0, c.lon ?? 0);
    const b = c.boundingBox;
    return {
      name: address!.displayName ?? '',
      center,
      bbox: b
        ? new L.LatLngBounds([b.minLat ?? 0, b.minLon ?? 0], [b.maxLat ?? 0, b.maxLon ?? 0])
        : new L.LatLngBounds(center, center),
      properties
    };
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link OpenGeocoding}
 * @param options the options
 */
export function opengeocoding(options?: Partial<OpenGeocodingOptions>) {
  return new OpenGeocoding(options);
}

/**
 * @internal
 */
export interface OpenGeocodingAddress {
  displayName?: string;
  goodMatch?: boolean;
  geoCoordinates?: {
    lat?: number;
    lon?: number;
    boundingBox?: { minLat?: number; minLon?: number; maxLat?: number; maxLon?: number };
  };
  addressDetails?: Record<string, unknown>;
}

/**
 * @internal
 */
export interface OpenGeocodingReverseResponse {
  results?: { address?: OpenGeocodingAddress; distanceM?: number; layer?: string }[];
}
