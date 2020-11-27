import * as L from 'leaflet';
import { IGeocoder, GeocodingCallback, GeocodingResult } from './api';

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

export class OpenLocationCode implements IGeocoder {
  options: OpenLocationCodeOptions;
  constructor(options?: Partial<OpenLocationCodeOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any) {
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
      cb.call(context, [result]);
    } catch (e) {
      console.warn(e); // eslint-disable-line no-console
      cb.call(context, []);
    }
  }
  reverse(location: L.LatLngLiteral, scale: number, cb: (result: any) => void, context?: any) {
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
      cb.call(context, [result]);
    } catch (e) {
      console.warn(e); // eslint-disable-line no-console
      cb.call(context, []);
    }
  }
}

export function openLocationCode(options?: Partial<OpenLocationCodeOptions>) {
  return new OpenLocationCode(options);
}
