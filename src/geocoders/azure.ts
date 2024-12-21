import * as L from 'leaflet';
import { GeocodingCallback, GeocodingResult, IGeocoder } from './api';

export interface AzureMapsOptions {
  apiKey: string; // Azure Maps API Key
  serviceUrl?: string; // Optional: Base URL for the Azure Maps API
}

/**
 * Azure Maps Geocoder class
 */
export class AzureMapsGeocoder implements IGeocoder {
  private options: AzureMapsOptions;

  constructor(options: AzureMapsOptions) {
    this.options = {
      serviceUrl: 'https://atlas.microsoft.com/search',
      ...options,
    };

    if (!this.options.apiKey) {
      throw new Error('Azure Maps Geocoder requires an API key.');
    }
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    const params = {
      'api-version': '1.0',
      query: query,
      'subscription-key': this.options.apiKey,
    };

    const url = `${this.options.serviceUrl}/address/json?${new URLSearchParams(params).toString()}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const results: GeocodingResult[] = [];

        if (data.results && data.results.length > 0) {
          for (const result of data.results) {
            console.log(result);
            results.push({
              name: result.address.freeformAddress,
              bbox: L.latLngBounds(
                [result.viewport.topLeftPoint.lat, result.viewport.topLeftPoint.lon],
                [result.viewport.btmRightPoint.lat, result.viewport.btmRightPoint.lon]
              ),
              center: L.latLng(result.position.lat, result.position.lon),
            });
          }
        }

        cb.call(context, results);
      })
      .catch(error => {
        console.error('Geocoding error:', error);
        cb.call(context, []);
      });
  }

  reverse(location: L.LatLngLiteral, scale: number, cb: GeocodingCallback, context?: any): void {
    const params = {
      'api-version': '1.0',
      query: `${location.lat},${location.lng}`,
      'subscription-key': this.options.apiKey,
    };

    const url = `${this.options.serviceUrl}/address/reverse/json?${new URLSearchParams(
      params
    ).toString()}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const results: GeocodingResult[] = [];

        if (data.addresses && data.addresses.length > 0) {
          for (const address of data.addresses) {
            results.push({
              name: address.address.freeformAddress,
              bbox: L.latLngBounds(
                [address.viewport.topLeftPoint.lat, address.viewport.topLeftPoint.lon],
                [address.viewport.btmRightPoint.lat, address.viewport.btmRightPoint.lon]
              ),
              center: L.latLng(location.lat, location.lng),
            });
          }
        }

        cb.call(context, results);
      })
      .catch(error => {
        console.error('Reverse geocoding error:', error);
        cb.call(context, []);
      });
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Azure}
 * @param options the options
 */
export function azure(options: AzureMapsOptions) {
  return new AzureMapsGeocoder(options);
}