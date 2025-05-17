import * as L from 'leaflet';
import { getJSON } from '../util';
import { IGeocoder, GeocoderOptions, geocodingParams, GeocodingResult, reverseParams } from './api';

export interface OpenCageOptions extends GeocoderOptions {}

/**
 * Implementation of the [OpenCage Data API](https://opencagedata.com/)
 */
export class OpenCage implements IGeocoder {
  options: OpenCageOptions = {
    serviceUrl: 'https://api.opencagedata.com/geocode/v1/json'
  };

  constructor(options?: Partial<OpenCageOptions>) {
    L.Util.setOptions(this, options);
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, {
      key: this.options.apiKey,
      q: query
    });
    const data = await getJSON<any>(this.options.serviceUrl, params);
    return this._parseResults(data);
  }

  suggest(query: string): Promise<GeocodingResult[]> {
    return this.geocode(query);
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      key: this.options.apiKey,
      q: [location.lat, location.lng].join(',')
    });
    const data = await getJSON<any>(this.options.serviceUrl, params);
    return this._parseResults(data);
  }

  private _parseResults(data): GeocodingResult[] {
    return (data.results || []).map((loc): GeocodingResult => {
      const center = new L.LatLng(loc.geometry.lat, loc.geometry.lng);
      const bbox =
        loc.annotations && loc.annotations.bounds
          ? new L.LatLngBounds(
              new L.LatLng(loc.annotations.bounds.northeast.lat, loc.annotations.bounds.northeast.lng),
              new L.LatLng(loc.annotations.bounds.southwest.lat, loc.annotations.bounds.southwest.lng)
            )
          : new L.LatLngBounds(center, center);

      return {
        name: loc.formatted,
        bbox,
        center,
        properties: loc
      };
    });
  }
}

export function opencage(options?: Partial<OpenCageOptions>) {
  return new OpenCage(options);
}
