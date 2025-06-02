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
    return this._parseResults(data);
  }

  async suggest(query: string): Promise<GeocodingResult[]> {
    const params = geocodingParams(this.options, {
      api_key: this.options.apiKey,
      text: query
    });
    const data = await getJSON<any>(this.options.serviceUrl + '/autocomplete', params);
    return this._parseResults(data);
  }

  async reverse(location: L.LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const params = reverseParams(this.options, {
      api_key: this.options.apiKey,
      'point.lat': location.lat,
      'point.lon': location.lng
    });
    const data = await getJSON<any>(this.options.serviceUrl + '/reverse', params);
    return this._parseResults(data);
  }

  _parseResults(data: GeoJSON.FeatureCollection<GeoJSON.Point>): GeocodingResult[] {
    return (data.features || []).map((f): GeocodingResult => {
      const c = f.geometry.coordinates;
      const center = new L.LatLng(c[1], c[0]);

      const bbox =
        Array.isArray(f.bbox) && f.bbox.length === 4
          ? new L.LatLngBounds([f.bbox[1], f.bbox[0]], [f.bbox[3], f.bbox[2]])
          : new L.LatLngBounds(center, center);

      return {
        name: f.properties!.label,
        center,
        bbox,
        properties: f.properties
      };
    });
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

interface Identity {
  id: string;
  gid: string;
  layer: string;
  source: string;
  source_id: string;
}

interface Labels {
  name: string;
  label: string;
  category?: string[];
}

interface Hierarchy {
  country_code?: string;

  ocean?: string;
  ocean_gid?: string;
  ocean_a?: string;

  marinearea?: string;
  marinearea_gid?: string;
  marinearea_a?: string;

  continent?: string;
  continent_gid?: string;
  continent_a?: string;

  empire?: string;
  empire_gid?: string;
  empire_a?: string;

  country?: string;
  country_gid?: string;
  country_a?: string;

  dependency?: string;
  dependency_gid?: string;
  dependency_a?: string;

  macroregion?: string;
  macroregion_gid?: string;
  macroregion_a?: string;

  region?: string;
  region_gid?: string;
  region_a?: string;

  macrocounty?: string;
  macrocounty_gid?: string;
  macrocounty_a?: string;

  county?: string;
  county_gid?: string;
  county_a?: string;

  localadmin?: string;
  localadmin_gid?: string;
  localadmin_a?: string;

  locality?: string;
  locality_gid?: string;
  locality_a?: string;

  borough?: string;
  borough_gid?: string;
  borough_a?: string;

  neighbourhood?: string;
  neighbourhood_gid?: string;
  neighbourhood_a?: string;

  postalcode?: string;
  postalcode_gid?: string;
  postalcode_a?: string;
}

interface Address {
  unit?: string;
  housenumber?: string;
  street?: string;
  postalcode?: string;
}

interface Scoring {
  accuracy: string;
  confidence?: number;
  distance?: number;
  match_type?: string;
}

interface Addendum {
  addendum?: Record<string, Object>;
}

interface Properties extends Identity, Labels, Scoring, Address, Hierarchy, Addendum {}

interface Geocoding {
  version: string;
  attribution: string;
  query: Query;
  warnings: string[];
  engine: Engine;
}

interface Engine {
  name: string;
  author: string;
  version: string;
}

interface Query {
  size: number;
  lang: {
    name: string;
    iso6391: string;
    iso6393: string;
    via: string;
    defaulted: boolean
  }
  text?: string;
  parser?: string;
  parsed_text?: Record<string, string>;
  sources?: string[];
  layers?: string[];
}
