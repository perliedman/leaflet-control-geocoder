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
    const results: GeocodingResult[] = [];
    if (data.candidates && data.candidates.length) {
      for (let i = 0; i <= data.candidates.length - 1; i++) {
        const loc = data.candidates[i];
        const latLng = L.latLng(loc.location.y, loc.location.x);
        const latLngBounds = L.latLngBounds(
          L.latLng(loc.extent.ymax, loc.extent.xmax),
          L.latLng(loc.extent.ymin, loc.extent.xmin)
        );
        results[i] = {
          name: loc.address,
          bbox: latLngBounds,
          center: latLng
        };
      }
    }

    return results;
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
    const result: GeocodingResult[] = [];
    if (data && !data.error) {
      const center = L.latLng(data.location.y, data.location.x);
      const bbox = L.latLngBounds(center, center);
      result.push({
        name: data.address.Match_addr,
        center: center,
        bbox: bbox
      });
    }

    return result;
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

