import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocodingResult, IGeocoder } from './api';

export interface AzureMapsOptions {
  apiKey: string; // Azure Maps API Key
  serviceUrl: string; // Optional: Base URL for the Azure Maps API
}

/**
 * Azure Maps Geocoder class
 */
export class AzureMaps implements IGeocoder {
  private options: AzureMapsOptions = {
    apiKey: '',
    serviceUrl: 'https://atlas.microsoft.com/search'
  };

  constructor(options: Partial<AzureMapsOptions>) {
    L.Util.setOptions(this, options);
    if (!this.options.apiKey) {
      throw new Error('Azure Maps Geocoder requires an API key.');
    }
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    const params = {
      'api-version': '1.0',
      query,
      'subscription-key': this.options.apiKey
    };
    const url = this.options.serviceUrl + '/address/json';
    const data = await getJSON<any>(url, params);

    const results: GeocodingResult[] = [];
    if (data.results && data.results.length > 0) {
      for (const result of data.results) {
        results.push({
          name: result.address.freeformAddress,
          bbox: L.latLngBounds(
            [result.viewport.topLeftPoint.lat, result.viewport.topLeftPoint.lon],
            [result.viewport.btmRightPoint.lat, result.viewport.btmRightPoint.lon]
          ),
          center: L.latLng(result.position.lat, result.position.lon)
        });
      }
    }
    return results;
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = {
      'api-version': '1.0',
      query: location.lat + ',' + location.lng,
      'subscription-key': this.options.apiKey
    };
    const url = this.options.serviceUrl + '/address/reverse/json';
    const data = await getJSON<any>(url, params);

    const results: GeocodingResult[] = [];
    if (data.addresses && data.addresses.length > 0) {
      for (const address of data.addresses) {
        results.push({
          name: address.address.freeformAddress,
          bbox: L.latLngBounds(
            [address.viewport.topLeftPoint.lat, address.viewport.topLeftPoint.lon],
            [address.viewport.btmRightPoint.lat, address.viewport.btmRightPoint.lon]
          ),
          center: L.latLng(location.lat, location.lng)
        });
      }
    }
    return results;
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Azure}
 * @param options the options
 */
export function azure(options: AzureMapsOptions) {
  return new AzureMaps(options);
}
