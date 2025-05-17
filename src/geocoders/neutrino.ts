import * as L from 'leaflet';
import { getJSON } from '../util';
import { IGeocoder, GeocoderOptions, geocodingParams, GeocodingResult, reverseParams } from './api';

export interface NeutrinoOptions extends GeocoderOptions {
  userId: string;
}

/**
 * Implementation of the [Neutrino API](https://www.neutrinoapi.com/api/geocode-address/)
 */
export class Neutrino implements IGeocoder {
  options: NeutrinoOptions = {
    userId: '',
    apiKey: '',
    serviceUrl: 'https://neutrinoapi.com/'
  };

  constructor(options?: Partial<NeutrinoOptions>) {
    L.Util.setOptions(this, options);
  }

  // https://www.neutrinoapi.com/api/geocode-address/
  async geocode(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, {
      apiKey: this.options.apiKey,
      userId: this.options.userId,
      //get three words and make a dot based string
      address: query.split(/\s+/).join('.')
    });
    const data = await getJSON<any>(this.options.serviceUrl + 'geocode-address', params);
    if (!data.locations) {
      return [];
    }
    data.geometry = data.locations[0];
    const center = new L.LatLng(data.geometry.latitude, data.geometry.longitude);
    const bbox = new L.LatLngBounds(center, center);
    return [
      {
        name: data.geometry.address,
        bbox,
        center
      }
    ];
  }

  suggest(query: string): Promise<GeocodingResult[]> {
    return this.geocode(query);
  }

  // https://www.neutrinoapi.com/api/geocode-reverse/
  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      apiKey: this.options.apiKey,
      userId: this.options.userId,
      latitude: location.lat,
      longitude: location.lng
    });
    const data = await getJSON<any>(this.options.serviceUrl + 'geocode-reverse', params);
    if (data.status.status !== 200 || !data.found) {
      return [];
    }
    const center = new L.LatLng(location.lat, location.lng);
    const bbox = new L.LatLngBounds(center, center);
    return [
      {
        name: data.address,
        bbox,
        center
      }
    ];
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Neutrino}
 * @param options the options
 */
export function neutrino(options?: Partial<NeutrinoOptions>) {
  return new Neutrino(options);
}
