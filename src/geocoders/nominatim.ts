import * as L from 'leaflet';
import { template, getJSON } from '../util';
import {
  IGeocoder,
  GeocoderOptions,
  GeocodingCallback,
  geocodingParams,
  GeocodingResult,
  reverseParams
} from './api';

export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
  address: NominatimAddress;
}

export interface NominatimAddress {
  building?: string;
  city_district?: string;
  city?: string;
  country_code?: string;
  country?: string;
  county?: string;
  hamlet?: string;
  house_number?: string;
  neighbourhood?: string;
  postcode?: string;
  road?: string;
  state_district?: string;
  state?: string;
  suburb?: string;
  village?: string;
}

export interface NominatimOptions extends GeocoderOptions {
  /**
   * Additional URL parameters (strings) that will be added to geocoding requests; can be used to restrict results to a specific country for example, by providing the [`countrycodes`](https://wiki.openstreetmap.org/wiki/Nominatim#Parameters) parameter to Nominatim
   */
  geocodingQueryParams?: Record<string, unknown>;
  /**
   * A function that takes an GeocodingResult as argument and returns an HTML formatted string that represents the result. Default function breaks up address in parts from most to least specific, in attempt to increase readability compared to Nominatim's naming
   */
  htmlTemplate: (r: NominatimResult) => string;
}

/**
 * Implementation of the [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim) geocoder.
 *
 * This is the default geocoding service used by the control, unless otherwise specified in the options.
 *
 * Unless using your own Nominatim installation, please refer to the [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/).
 */
export class Nominatim implements IGeocoder {
  options: NominatimOptions = {
    serviceUrl: 'https://nominatim.openstreetmap.org/',
    htmlTemplate: function(r: NominatimResult) {
      const address = r.address;
      let className: string;
      const parts = [];
      if (address.road || address.building) {
        parts.push('{building} {road} {house_number}');
      }

      if (address.city || (address as any).town || address.village || address.hamlet) {
        className = parts.length > 0 ? 'leaflet-control-geocoder-address-detail' : '';
        parts.push(
          '<span class="' + className + '">{postcode} {city} {town} {village} {hamlet}</span>'
        );
      }

      if (address.state || address.country) {
        className = parts.length > 0 ? 'leaflet-control-geocoder-address-context' : '';
        parts.push('<span class="' + className + '">{state} {country}</span>');
      }

      return template(parts.join('<br/>'), address);
    }
  };

  constructor(options?: Partial<NominatimOptions>) {
    L.Util.setOptions(this, options || {});
  }

  geocode(query: string, cb: GeocodingCallback, context?: any) {
    const params = geocodingParams(this.options, {
      q: query,
      limit: 5,
      format: 'json',
      addressdetails: 1
    });
    getJSON(this.options.serviceUrl + 'search', params, data => {
      const results: GeocodingResult[] = [];
      for (let i = data.length - 1; i >= 0; i--) {
        const bbox = data[i].boundingbox;
        for (let j = 0; j < 4; j++) bbox[j] = +bbox[j];
        results[i] = {
          icon: data[i].icon,
          name: data[i].display_name,
          html: this.options.htmlTemplate ? this.options.htmlTemplate(data[i]) : undefined,
          bbox: L.latLngBounds([bbox[0], bbox[2]], [bbox[1], bbox[3]]),
          center: L.latLng(data[i].lat, data[i].lon),
          properties: data[i]
        };
      }
      cb.call(context, results);
    });
  }

  reverse(location: L.LatLngLiteral, scale: number, cb: GeocodingCallback, context?: any) {
    const params = reverseParams(this.options, {
      lat: location.lat,
      lon: location.lng,
      zoom: Math.round(Math.log(scale / 256) / Math.log(2)),
      addressdetails: 1,
      format: 'json'
    });
    getJSON(this.options.serviceUrl + 'reverse', params, data => {
      const result: GeocodingResult[] = [];
      if (data && data.lat && data.lon) {
        const center = L.latLng(data.lat, data.lon);
        const bbox = L.latLngBounds(center, center);
        result.push({
          name: data.display_name,
          html: this.options.htmlTemplate ? this.options.htmlTemplate(data) : undefined,
          center: center,
          bbox: bbox,
          properties: data
        });
      }
      cb.call(context, result);
    });
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Nominatim}
 * @param options the options
 */
export function nominatim(options?: Partial<NominatimOptions>) {
  return new Nominatim(options);
}
