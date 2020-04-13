import * as L from 'leaflet';
import { template, getJSON } from '../util';
import { GeocoderAPI, GeocodingResult } from './interfaces';

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
  address: Address;
}

export interface Address {
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

export interface NominatimOptions {
  serviceUrl: string;
  geocodingQueryParams?: object;
  reverseQueryParams?: object;
  htmlTemplate: (r: NominatimResult) => string;
}

export class Nominatim implements GeocoderAPI {
  options: NominatimOptions;

  constructor(options?: NominatimOptions) {
    this.options = L.Util.extend(
      {
        serviceUrl: 'https://nominatim.openstreetmap.org/',
        geocodingQueryParams: {},
        reverseQueryParams: {},
        htmlTemplate: function(r: NominatimResult) {
          var a = r.address,
            className,
            parts = [];
          if (a.road || a.building) {
            parts.push('{building} {road} {house_number}');
          }

          if (a.city || (a as any).town || a.village || a.hamlet) {
            className = parts.length > 0 ? 'leaflet-control-geocoder-address-detail' : '';
            parts.push(
              '<span class="' + className + '">{postcode} {city} {town} {village} {hamlet}</span>'
            );
          }

          if (a.state || a.country) {
            className = parts.length > 0 ? 'leaflet-control-geocoder-address-context' : '';
            parts.push('<span class="' + className + '">{state} {country}</span>');
          }

          return template(parts.join('<br/>'), a);
        }
      },
      options
    );
  }

  geocode(query: string, cb: (result: GeocodingResult[]) => void, context?: any) {
    getJSON(
      this.options.serviceUrl + 'search',
      L.Util.extend(
        {
          q: query,
          limit: 5,
          format: 'json',
          addressdetails: 1
        },
        this.options.geocodingQueryParams
      ),
      data => {
        var results = [] as GeocodingResult[];
        for (var i = data.length - 1; i >= 0; i--) {
          var bbox = data[i].boundingbox;
          for (var j = 0; j < 4; j++) bbox[j] = parseFloat(bbox[j]);
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
      }
    );
  }

  reverse(location: L.LatLng, scale: number, cb: (result: any) => void, context?: any) {
    getJSON(
      this.options.serviceUrl + 'reverse',
      L.Util.extend(
        {
          lat: location.lat,
          lon: location.lng,
          zoom: Math.round(Math.log(scale / 256) / Math.log(2)),
          addressdetails: 1,
          format: 'json'
        },
        this.options.reverseQueryParams
      ),
      data => {
        var result = [],
          loc;

        if (data && data.lat && data.lon) {
          loc = L.latLng(data.lat, data.lon);
          result.push({
            name: data.display_name,
            html: this.options.htmlTemplate ? this.options.htmlTemplate(data) : undefined,
            center: loc,
            bounds: L.latLngBounds(loc, loc),
            properties: data
          });
        }
        cb.call(context, result);
      }
    );
  }
}

export function nominatim(options: NominatimOptions) {
  return new Nominatim(options);
}
