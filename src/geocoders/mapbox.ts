import * as L from 'leaflet';
import { getJSON } from '../util';
import { IGeocoder, GeocoderOptions, geocodingParams, GeocodingResult, reverseParams } from './api';

export interface MapboxOptions extends GeocoderOptions {}

/**
 * Implementation of the [Mapbox Geocoding](https://www.mapbox.com/api-documentation/#geocoding)
 */
export class Mapbox implements IGeocoder {
  options: MapboxOptions = {
    serviceUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
  };

  constructor(options?: Partial<MapboxOptions>) {
    L.Util.setOptions(this, options);
  }

  _getProperties(loc) {
    const properties = {
      text: loc.text,
      address: loc.address
    };

    for (let j = 0; j < (loc.context || []).length; j++) {
      const id = loc.context[j].id.split('.')[0];
      properties[id] = loc.context[j].text;

      // Get country code when available
      if (loc.context[j].short_code) {
        properties['countryShortCode'] = loc.context[j].short_code;
      }
    }
    return properties;
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    const url = this.options.serviceUrl + encodeURIComponent(query) + '.json';
    const params: any = geocodingParams(this.options, {
      access_token: this.options.apiKey
    });
    if (
      params.proximity !== undefined &&
      params.proximity.lat !== undefined &&
      params.proximity.lng !== undefined
    ) {
      params.proximity = params.proximity.lng + ',' + params.proximity.lat;
    }
    const data = await getJSON<any>(url, params);
    return this._parseResults(data);
  }

  suggest(query: string): Promise<GeocodingResult[]> {
    return this.geocode(query);
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const url = this.options.serviceUrl + location.lng + ',' + location.lat + '.json';
    const param = reverseParams(this.options, {
      access_token: this.options.apiKey
    });
    const data = await getJSON<any>(url, param);
    return this._parseResults(data);
  }

  private _parseResults(data): any[] | GeocodingResult[] {
    if (!data.features?.length) {
      return [];
    }
    const results: GeocodingResult[] = [];
    for (let i = 0; i <= data.features.length - 1; i++) {
      const loc = data.features[i];
      const center = L.latLng(loc.center.reverse());
      let bbox: L.LatLngBounds;
      if (loc.bbox) {
        bbox = L.latLngBounds(
          L.latLng(loc.bbox.slice(0, 2).reverse()),
          L.latLng(loc.bbox.slice(2, 4).reverse())
        );
      } else {
        bbox = L.latLngBounds(center, center);
      }
      results[i] = {
        name: loc.place_name,
        bbox: bbox,
        center: center,
        properties: this._getProperties(loc)
      };
    }

    return results;
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Mapbox}
 * @param options the options
 */
export function mapbox(options?: Partial<MapboxOptions>) {
  return new Mapbox(options);
}
