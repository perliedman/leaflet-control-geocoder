import * as L from 'leaflet';
import { getJSON } from '../util';
import { IGeocoder, GeocoderOptions, geocodingParams, GeocodingResult, reverseParams } from './api';

export interface What3WordsOptions extends GeocoderOptions {}

/**
 * Implementation of the What3Words service
 */
export class What3Words implements IGeocoder {
  options: What3WordsOptions = {
    serviceUrl: 'https://api.what3words.com/v2/'
  };

  constructor(options: Partial<What3WordsOptions>) {
    L.Util.setOptions(this, options);
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    const data = await getJSON<any>(
      this.options.serviceUrl + 'forward',
      geocodingParams(this.options, {
        key: this.options.apiKey,
        //get three words and make a dot based string
        addr: query.split(/\s+/).join('.')
      })
    );
    if (!data.geometry) {
      return [];
    }
    const center = new L.LatLng(data.geometry['lat'], data.geometry['lng']);
    const bbox = new L.LatLngBounds(center, center);
    return [
      {
        name: data.words,
        bbox,
        center
      }
    ];
  }

  suggest(query: string): Promise<GeocodingResult[]> {
    return this.geocode(query);
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const data = await getJSON<any>(
      this.options.serviceUrl + 'reverse',
      reverseParams(this.options, {
        key: this.options.apiKey,
        coords: [location.lat, location.lng].join(',')
      })
    );
    if (data.status.status != 200) {
      return [];
    }
    const center = new L.LatLng(data.geometry['lat'], data.geometry['lng']);
    const bbox = new L.LatLngBounds(center, center);
    return [
      {
        name: data.words,
        bbox,
        center
      }
    ];
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link What3Words}
 * @param options the options
 */
export function what3words(options: Partial<What3WordsOptions>) {
  return new What3Words(options);
}
