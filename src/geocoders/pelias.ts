import * as L from 'leaflet';
import { getJSON } from '../util';
import { IGeocoder, GeocoderOptions, geocodingParams, GeocodingResult, reverseParams } from './api';

export interface PeliasOptions extends GeocoderOptions {}

/**
 * Implementation of the [Pelias](https://pelias.io/), [geocode.earth](https://geocode.earth/) geocoder (formerly Mapzen Search)
 */
export class Pelias implements IGeocoder {
  options: PeliasOptions = {
    serviceUrl: 'https://api.geocode.earth/v1'
  };

  constructor(options?: Partial<PeliasOptions>) {
    L.Util.setOptions(this, options);
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, {
      api_key: this.options.apiKey,
      text: query
    });
    const data = await getJSON<any>(this.options.serviceUrl + '/search', params);
    return this._parseResults(data, 'bbox');
  }

  async suggest(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, {
      api_key: this.options.apiKey,
      text: query
    });
    const data = await getJSON<any>(this.options.serviceUrl + '/autocomplete', params);
    return this._parseResults(data, 'bbox');
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      api_key: this.options.apiKey,
      'point.lat': location.lat,
      'point.lon': location.lng
    });
    const data = await getJSON<any>(this.options.serviceUrl + '/reverse', params);
    return this._parseResults(data, 'bounds');
  }

  _parseResults(data, bboxname): GeocodingResult[] {
    const results: GeocodingResult[] = [];
    new L.GeoJSON(data, {
      pointToLayer(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 10});
      },
      onEachFeature(feature, layer: any) {
        const result = {} as GeocodingResult;
        let bbox;
        let center;

        if (layer.getBounds) {
          bbox = layer.getBounds();
          center = bbox.getCenter();
        } else if (layer.feature.bbox) {
          center = layer.getLatLng();
          bbox = new L.LatLngBounds(
            L.GeoJSON.coordsToLatLng(layer.feature.bbox.slice(0, 2)),
            L.GeoJSON.coordsToLatLng(layer.feature.bbox.slice(2, 4))
          );
        } else {
          center = layer.getLatLng();
          bbox = new L.LatLngBounds(center, center);
        }

        result.name = layer.feature.properties.label;
        result.center = center;
        result[bboxname] = bbox;
        result.properties = layer.feature.properties;
        results.push(result);
      }
    });
    return results;
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Pelias}
 * @param options the options
 */
export function pelias(options?: Partial<PeliasOptions>) {
  return new Pelias(options);
}

export const GeocodeEarth = Pelias;
export const geocodeEarth = pelias;

/**
 * r.i.p.
 * @deprecated
 */
export const Mapzen = Pelias;
/**
 * r.i.p.
 * @deprecated
 */
export const mapzen = pelias;

/**
 * Implementation of the [Openrouteservice](https://openrouteservice.org/dev/#/api-docs/geocode) geocoder
 */
export class Openrouteservice extends Pelias {
  constructor(options?: Partial<PeliasOptions>) {
    super(
      Object.assign(
        {
          serviceUrl: 'https://api.openrouteservice.org/geocode'
        },
        options
      )
    );
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Openrouteservice}
 * @param options the options
 */
export function openrouteservice(options?: Partial<PeliasOptions>) {
  return new Openrouteservice(options);
}

/**
 * @internal
 */
export type PeliasResponse = GeoJSON.FeatureCollection<GeoJSON.Geometry, Properties> & {
  geocoding: Geocoding;
};

interface Properties {
  id:         string;
  layer:      string;
  source_id:  string;
  name:       string;
  confidence: number;
  match_type: string;
  accuracy:   string;
  country:    string;
  country_a:  string;
  region:     string;
  region_a:   string;
  county:     string;
  county_a:   string;
  localadmin: string;
  locality:   string;
  continent:  string;
  label:      string;
}

interface Geocoding {
  version:     string;
  attribution: string;
  query:       Query;
  warnings:    string[];
  engine:      Engine;
}

interface Engine {
  name:    string;
  author:  string;
  version: string;
}

interface Query {
}
