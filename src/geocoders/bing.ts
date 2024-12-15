import * as L from 'leaflet';
import { getJSON } from '../util';
import { IGeocoder, GeocoderOptions, geocodingParams, GeocodingResult, reverseParams } from './api';

export interface BingOptions extends GeocoderOptions {}

/**
 * Implementation of the [Bing Locations API](https://docs.microsoft.com/en-us/bingmaps/rest-services/locations/)
 *
 * Bing Maps for Enterprise is deprecated and will be retired.
 * Free (Basic) account customers can continue to use Bing Maps for Enterprise services until June 30th, 2025.
 * Enterprise account customers can continue to use Bing Maps for Enterprise services until June 30th, 2028.
 */
export class Bing implements IGeocoder {
  options: BingOptions = {
    serviceUrl: 'https://dev.virtualearth.net/REST/v1/Locations/'
  };

  constructor(options?: Partial<BingOptions>) {
    L.Util.setOptions(this, options);
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, {
      query: query,
      key: this.options.apiKey
    });
    const data = await getJSON<any>(this.options.serviceUrl, params);
    const results: GeocodingResult[] = [];
    if (data.resourceSets.length > 0) {
      for (let i = data.resourceSets[0].resources.length - 1; i >= 0; i--) {
        const resource = data.resourceSets[0].resources[i],
          bbox = resource.bbox;
        results[i] = {
          name: resource.name,
          bbox: L.latLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
          center: L.latLng(resource.point.coordinates)
        };
      }
    }
    return results;
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      key: this.options.apiKey
    });
    const data = await getJSON<any>(
      this.options.serviceUrl + location.lat + ',' + location.lng,
      params
    );
    const results: GeocodingResult[] = [];
    for (let i = data.resourceSets[0].resources.length - 1; i >= 0; i--) {
      const resource = data.resourceSets[0].resources[i],
        bbox = resource.bbox;
      results[i] = {
        name: resource.name,
        bbox: L.latLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
        center: L.latLng(resource.point.coordinates)
      };
    }
    return results;
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Bing}
 * @param options the options
 */
export function bing(options?: Partial<BingOptions>) {
  return new Bing(options);
}
