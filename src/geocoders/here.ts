import * as L from 'leaflet';
import { getJSON } from '../util';
import { IGeocoder, GeocoderOptions, geocodingParams, GeocodingResult, reverseParams } from './api';

export interface HereOptions extends GeocoderOptions {
  /**
   * Use `apiKey` and the new `HEREv2` geocoder
   * @deprecated
   */
  app_id: string;
  /**
   * Use `apiKey` and the new `HEREv2` geocoder
   * @deprecated
   */
  app_code: string;
  reverseGeocodeProxRadius?: any;
  apiKey: string;
  maxResults: number;
}

/**
 * Implementation of the [HERE Geocoder API](https://developer.here.com/documentation/geocoder/topics/introduction.html)
 */
export class HERE implements IGeocoder {
  options: HereOptions = {
    serviceUrl: 'https://geocoder.api.here.com/6.2/',
    app_id: '',
    app_code: '',
    apiKey: '',
    maxResults: 5
  };

  constructor(options?: Partial<HereOptions>) {
    L.Util.setOptions(this, options);
    if (options?.apiKey) throw Error('apiKey is not supported, use app_id/app_code instead!');
  }

  geocode(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, {
      searchtext: query,
      gen: 9,
      app_id: this.options.app_id,
      app_code: this.options.app_code,
      jsonattributes: 1,
      maxresults: this.options.maxResults
    });
    return this.getJSON(this.options.serviceUrl + 'geocode.json', params);
  }

  reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    let prox = location.lat + ',' + location.lng;
    if (this.options.reverseGeocodeProxRadius) {
      prox += ',' + this.options.reverseGeocodeProxRadius;
    }
    const params = reverseParams(this.options, {
      prox,
      mode: 'retrieveAddresses',
      app_id: this.options.app_id,
      app_code: this.options.app_code,
      gen: 9,
      jsonattributes: 1,
      maxresults: this.options.maxResults
    });
    return this.getJSON(this.options.serviceUrl + 'reversegeocode.json', params);
  }

  async getJSON(url: string, params: any): Promise<GeocodingResult[]> {
    const data = await getJSON<any>(url, params);
    return (data.response.view?.[0]?.result || []).map((result): GeocodingResult => {
      const loc = result.location;
      const center = new L.LatLng(loc.displayPosition.latitude, loc.displayPosition.longitude);
      const bbox = new L.LatLngBounds(
        new L.LatLng(loc.mapView.topLeft.latitude, loc.mapView.topLeft.longitude),
        new L.LatLng(loc.mapView.bottomRight.latitude, loc.mapView.bottomRight.longitude)
      );
      return {
        name: loc.address.label,
        properties: loc.address,
        bbox,
        center
      };
    });
  }
}

/**
 * Implementation of the new [HERE Geocoder API](https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html)
 */
export class HEREv2 implements IGeocoder {
  options: HereOptions = {
    serviceUrl: 'https://geocode.search.hereapi.com/v1',
    apiKey: '',
    app_id: '',
    app_code: '',
    maxResults: 10
  };

  constructor(options?: Partial<HereOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, {
      q: query,
      apiKey: this.options.apiKey,
      limit: this.options.maxResults
    });

    if (!params.at && !params.in) {
      throw Error(
        'at / in parameters not found. Please define coordinates (at=latitude,longitude) or other (in) in your geocodingQueryParams.'
      );
    }

    return this.getJSON(this.options.serviceUrl + '/discover', params);
  }

  reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      at: location.lat + ',' + location.lng,
      limit: this.options.reverseGeocodeProxRadius,
      apiKey: this.options.apiKey
    });
    return this.getJSON(this.options.serviceUrl + '/revgeocode', params);
  }

  async getJSON(url: string, params: any): Promise<GeocodingResult[]> {
    const data = await getJSON<HEREv2Response>(url, params);
    return (data.items || []).map((item): GeocodingResult => {
      const center = new L.LatLng(item.position.lat, item.position.lng);
      let bbox: L.LatLngBounds;
      if (item.mapView) {
        bbox = new L.LatLngBounds(
          new L.LatLng(item.mapView.south, item.mapView.west),
          new L.LatLng(item.mapView.north, item.mapView.east)
        );
      } else {
        // Using only position when not provided
        bbox = new L.LatLngBounds(
          new L.LatLng(item.position.lat, item.position.lng),
          new L.LatLng(item.position.lat, item.position.lng)
        );
      }
      return {
        name: item.address.label,
        properties: item.address,
        bbox,
        center
      };
    });
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link HERE}
 * @param options the options
 */
export function here(options?: Partial<HereOptions>) {
  if (options?.apiKey) {
    return new HEREv2(options);
  } else {
    return new HERE(options);
  }
}

/**
 * @internal
 */
export interface HEREv2Response {
  items: Item[];
}

interface Item {
  title: string;
  id: string;
  ontologyId: string;
  resultType: string;
  address: Address;
  mapView?: MapView;
  position: Position;
  access: Position[];
  distance: number;
  categories: Category[];
  references: Reference[];
  foodTypes: Category[];
  contacts: Contact[];
  openingHours: OpeningHour[];
}

interface MapView {
  east: number;
  north: number;
  south: number;
  west: number;
}

interface Position {
  lat: number;
  lng: number;
}

interface Address {
  label: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  state: string;
  county: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  houseNumber: string;
}

interface Category {
  id: string;
  name: string;
  primary?: boolean;
}

interface Contact {
  phone: Email[];
  fax: Email[];
  www: Email[];
  email: Email[];
}

interface Email {
  value: string;
}

interface OpeningHour {
  text: string[];
  isOpen: boolean;
  structured: Structured[];
}

interface Structured {
  start: string;
  duration: string;
  recurrence: string;
}

interface Reference {
  supplier: Supplier;
  id: string;
}

interface Supplier {
  id: string;
}
