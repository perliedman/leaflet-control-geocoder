import * as L from 'leaflet';
import { getJSON } from '../util';
import { IGeocoder, GeocoderOptions, geocodingParams, GeocodingResult, reverseParams } from './api';

export interface MapQuestOptions extends GeocoderOptions {}

/**
 * Implementation of the [MapQuest Geocoding API](http://developer.mapquest.com/web/products/dev-services/geocoding-ws)
 */
export class MapQuest implements IGeocoder {
  options: MapQuestOptions = {
    serviceUrl: 'https://www.mapquestapi.com/geocoding/v1'
  };

  constructor(options?: Partial<MapQuestOptions>) {
    L.Util.setOptions(this, options);
    // MapQuest seems to provide URI encoded API keys,
    // so to avoid encoding them twice, we decode them here
    this.options.apiKey = decodeURIComponent(this.options.apiKey!);
  }

  _formatName(...parts: string[]) {
    return parts.filter(s => !!s).join(', ');
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, {
      key: this.options.apiKey,
      location: query,
      limit: 5,
      outFormat: 'json'
    });
    const data = await getJSON<any>(this.options.serviceUrl + '/address', params);
    return this._parseResults(data);
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      key: this.options.apiKey,
      location: location.lat + ',' + location.lng,
      outputFormat: 'json'
    });
    const data = await getJSON<any>(this.options.serviceUrl + '/reverse', params);
    return this._parseResults(data);
  }

  private _parseResults(data): GeocodingResult[] {
    const locations = data.results?.[0]?.locations || [];
    return locations.map((loc): GeocodingResult => {
      const center = new L.LatLng(loc.latLng.lat, loc.latLng.lng);
      return {
        name: this._formatName(loc.street, loc.adminArea4, loc.adminArea3, loc.adminArea1),
        bbox: new L.LatLngBounds(center, center),
        center
      };
    });
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link MapQuest}
 * @param options the options
 */
export function mapQuest(options?: Partial<MapQuestOptions>) {
  return new MapQuest(options);
}
