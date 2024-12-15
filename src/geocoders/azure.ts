import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocodingResult, IGeocoder } from './api';

export interface AzureMapsOptions {
  apiKey: string; // Azure Maps API Key
  serviceUrl: string; // Optional: Base URL for the Azure Maps API
}

/**
 * Implementation of [Azure Maps Geocoding](https://www.microsoft.com/en-us/maps/azure/location-services/geocoding)
 *
 * https://learn.microsoft.com/en-us/rest/api/maps/search?view=rest-maps-1.0
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

  /**
   * {@inheritdoc}
   * https://learn.microsoft.com/en-us/rest/api/maps/search/get-search-address?view=rest-maps-1.0&tabs=HTTP
   */
  async geocode(query: string): Promise<GeocodingResult[]> {
    const params = {
      'api-version': '1.0',
      query,
      'subscription-key': this.options.apiKey
    };
    const url = this.options.serviceUrl + '/address/json';
    const data = await getJSON<AzureMapsResponse>(url, params);

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

  /**
   * {@inheritdoc}
   * https://learn.microsoft.com/en-us/rest/api/maps/search/get-search-address-reverse?view=rest-maps-1.0&tabs=HTTP
   */
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

/**
 * @internal
 */
export interface AzureMapsResponse {
  summary: Summary;
  results: Result[];
}

interface Result {
  type: string;
  id: string;
  score: number;
  address: Address;
  position: Position;
  viewport: Viewport;
  entryPoints: EntryPoint[];
}

interface Address {
  streetNumber: string;
  streetName: string;
  municipalitySubdivision: string;
  municipality: string;
  countrySecondarySubdivision: string;
  countryTertiarySubdivision: string;
  countrySubdivisionCode: string;
  postalCode: string;
  extendedPostalCode: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  countrySubdivisionName: string;
}

interface EntryPoint {
  type: string;
  position: Position;
}

interface Position {
  lat: number;
  lon: number;
}

interface Viewport {
  topLeftPoint: Position;
  btmRightPoint: Position;
}

interface Summary {
  query: string;
  queryType: string;
  queryTime: number;
  numResults: number;
  offset: number;
  totalResults: number;
  fuzzyLevel: number;
}
