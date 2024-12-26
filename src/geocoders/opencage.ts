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
      const center = L.latLng(loc.geometry);
      const bbox =
        loc.annotations && loc.annotations.bounds
          ? L.latLngBounds(
              L.latLng(loc.annotations.bounds.northeast),
              L.latLng(loc.annotations.bounds.southwest)
            )
          : L.latLngBounds(center, center);

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
