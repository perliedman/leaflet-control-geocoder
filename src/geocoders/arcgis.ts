import * as L from 'leaflet';
import { getJSON } from '../util';
import { IGeocoder, GeocoderOptions, geocodingParams, GeocodingResult, reverseParams } from './api';

export interface ArcGisOptions extends GeocoderOptions {}

/**
 * Implementation of the [ArcGIS geocoder](https://developers.arcgis.com/features/geocoding/)
 */
export class ArcGis implements IGeocoder {
  options: ArcGisOptions = {
    serviceUrl: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
    apiKey: ''
  };

  constructor(options?: Partial<ArcGisOptions>) {
    L.Util.setOptions(this, options);
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, {
      token: this.options.apiKey,
      SingleLine: query,
      outFields: 'Addr_Type',
      forStorage: false,
      maxLocations: 10,
      f: 'json'
    });

    const data = await getJSON<ArcGisResponse>(
      this.options.serviceUrl + '/findAddressCandidates',
      params
    );
    return data.candidates.map((loc): GeocodingResult => {
      const center = new L.LatLng(loc.location.y, loc.location.x);
      const bbox = new L.LatLngBounds(
        new L.LatLng(loc.extent.ymax, loc.extent.xmax),
        new L.LatLng(loc.extent.ymin, loc.extent.xmin)
      );
      return {
        name: loc.address,
        bbox,
        center
      };
    });
  }

  suggest(query: string): Promise<GeocodingResult[]> {
    return this.geocode(query);
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      location: location.lng + ',' + location.lat,
      distance: 100,
      f: 'json'
    });
    const data = await getJSON<any>(this.options.serviceUrl + '/reverseGeocode', params);
    if (!data || data.error) {
      return [];
    }
    const center = new L.LatLng(data.location.y, data.location.x);
    const bbox = new L.LatLngBounds(center, center);
    return [
      {
        name: data.address.Match_addr,
        center,
        bbox
      }
    ];
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link ArcGis}
 * @param options the options
 */
export function arcgis(options?: Partial<ArcGisOptions>) {
  return new ArcGis(options);
}

/**
 * @internal
 */
export interface ArcGisResponse {
  spatialReference: {
    wkid: number;
    latestWkid: number;
  };
  candidates: Candidate[];
}

interface Candidate {
  address: string;
  location: {
    x: number;
    y: number;
  };
  score: number;
  attributes: {
    Addr_Type: string;
  };
  extent: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}
