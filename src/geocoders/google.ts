import * as L from 'leaflet';
import { getJSON } from '../util';
import { IGeocoder, GeocoderOptions, geocodingParams, GeocodingResult, reverseParams } from './api';

/**
 * Implementation of the [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/)
 */
export interface GoogleOptions extends GeocoderOptions {}

export class Google implements IGeocoder {
  options: GoogleOptions = {
    serviceUrl: 'https://maps.googleapis.com/maps/api/geocode/json'
  };

  constructor(options?: Partial<GoogleOptions>) {
    L.Util.setOptions(this, options);
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, {
      key: this.options.apiKey,
      address: query
    });
    const data = await getJSON<GoogleResponse>(this.options.serviceUrl, params);
    return this._parseResults(data);
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      key: this.options.apiKey,
      latlng: location.lat + ',' + location.lng
    });
    const data = await getJSON<any>(this.options.serviceUrl, params);
    return this._parseResults(data);
  }

  private _parseResults(data: GoogleResponse) {
    return (data.results || [])?.map((loc): GeocodingResult => {
      const center = new L.LatLng(loc.geometry.location.lat, loc.geometry.location.lng);
      const bbox = new L.LatLngBounds(
        new L.LatLng(loc.geometry.viewport.northeast.lat, loc.geometry.viewport.northeast.lng),
        new L.LatLng(loc.geometry.viewport.southwest.lat, loc.geometry.viewport.southwest.lng)
      );
      return {
        name: loc.formatted_address,
        bbox,
        center,
        properties: loc.address_components
      };
    });
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Google}
 * @param options the options
 */
export function google(options?: Partial<GoogleOptions>) {
  return new Google(options);
}

/**
 * @internal
 */
export interface GoogleResponse {
  results: Result[];
  status: string;
}

interface Result {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Geometry {
  bounds: Bounds;
  location: Location;
  location_type: string;
  viewport: Bounds;
}

interface Bounds {
  northeast: Location;
  southwest: Location;
}

interface Location {
  lat: number;
  lng: number;
}
