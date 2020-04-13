import * as L from 'leaflet';
import { GeocoderAPI, GeocodingResult } from './interfaces';

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

export class OpenLocationCode implements GeocoderAPI {
  options: OpenLocationCodeOptions;
  constructor(options: OpenLocationCodeOptions) {
    this.options = options;
  }

  geocode(query: string, cb: (result: GeocodingResult[]) => void, context?: any) {
    try {
      var decoded = this.options.OpenLocationCode.decode(query);
      var result: GeocodingResult = {
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
  reverse?(location: L.LatLng, scale: number, cb: (result: any) => void, context?: any) {
    try {
      var code = this.options.OpenLocationCode.encode(
        location.lat,
        location.lng,
        this.options.codeLength
      );
      var result = {
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

export function openLocationCode(options: OpenLocationCodeOptions) {
  return new OpenLocationCode(options);
}
