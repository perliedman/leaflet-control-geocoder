import * as L from 'leaflet';
import { getJSON } from '../util';
import { GeocoderOptions, geocodingParams, GeocodingResult, IGeocoder, reverseParams } from './api';

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
    return this._parseResults(data);
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      key: this.options.apiKey
    });
    const data = await getJSON<any>(
      this.options.serviceUrl + location.lat + ',' + location.lng,
      params
    );
    return this._parseResults(data);
  }

  private _parseResults(data) {
    return data.resourceSets[0].resources.map((resource): GeocodingResult => {
      const bbox = resource.bbox;
      return {
        name: resource.name,
        bbox: new L.LatLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
        center: new L.LatLng(...resource.point.coordinates as [number,number])
      };
    });
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Bing}
 * @param options the options
 */
export function bing(options?: Partial<BingOptions>) {
  return new Bing(options);
}
