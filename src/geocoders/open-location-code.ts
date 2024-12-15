import * as L from 'leaflet';
import { IGeocoder, GeocodingResult } from './api';

export interface OpenLocationCodeOptions {
  OpenLocationCode: OpenLocationCodeApi;
  codeLength?: number;
}

export interface OpenLocationCodeApi {
  encode(latitude: number, longitude: number, codeLength?: number): string;
  decode(code: string): CodeArea;
}

export interface CodeArea {
  latitudeLo: number;
  longitudeLo: number;
  latitudeHi: number;
  longitudeHi: number;
  latitudeCenter: number;
  longitudeCenter: number;
  codeLength: number;
}

/**
 * Implementation of the [Plus codes](https://plus.codes/) (formerly OpenLocationCode) (requires [open-location-code](https://www.npmjs.com/package/open-location-code))
 */
export class OpenLocationCode implements IGeocoder {
  options = {} as OpenLocationCodeOptions;
  constructor(options?: Partial<OpenLocationCodeOptions>) {
    L.Util.setOptions(this, options);
  }

  async geocode(query: string) {
    try {
      const decoded = this.options.OpenLocationCode.decode(query);
      const result: GeocodingResult = {
        name: query,
        center: L.latLng(decoded.latitudeCenter, decoded.longitudeCenter),
        bbox: L.latLngBounds(
          L.latLng(decoded.latitudeLo, decoded.longitudeLo),
          L.latLng(decoded.latitudeHi, decoded.longitudeHi)
        )
      };
      return [result];
    } catch (e) {
      console.warn(e); // eslint-disable-line no-console
      return [];
    }
  }
  async reverse(location: L.LatLngLiteral, scale: number) {
    try {
      const code = this.options.OpenLocationCode.encode(
        location.lat,
        location.lng,
        this.options.codeLength
      );
      const result = {
        name: code,
        center: L.latLng(location.lat, location.lng),
        bbox: L.latLngBounds(
          L.latLng(location.lat, location.lng),
          L.latLng(location.lat, location.lng)
        )
      };
      return [result];
    } catch (e) {
      console.warn(e); // eslint-disable-line no-console
      return [];
    }
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link OpenLocationCode}
 * @param options the options
 */
export function openLocationCode(options?: Partial<OpenLocationCodeOptions>) {
  return new OpenLocationCode(options);
}
