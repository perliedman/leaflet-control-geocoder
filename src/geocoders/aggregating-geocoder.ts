import * as L from 'leaflet';
import { LatLngLiteral } from 'leaflet';
import { IGeocoder, GeocodingContext, GeocodingResult } from './api';

export interface AgregatorOptions {
  geocoders: IGeocoder[];
}

/**
 * Implementation of a geocoder that takes other geocoders and aggregates their results together.
 **/
export class AggregatingGeocoder implements IGeocoder {
  options: AgregatorOptions = {
    geocoders: []
  }

  constructor(options?: Partial<AgregatorOptions>) {
    L.Util.setOptions(this, options)
  }

  private async combineResults(queries: Array<Promise<GeocodingResult[]>>): Promise<GeocodingResult[]> {
    const queryResults: Array<GeocodingResult[]> = await Promise.all(queries);
    const results: Array<GeocodingResult> = [];
    for(const r of queryResults) {
      results.push(...r);
    }
    return results;
  }

  geocode(query: string, context?: GeocodingContext): Promise<GeocodingResult[]> {
    const queries: Promise<GeocodingResult[]>[] = [];
    for(const geocoder of this.options.geocoders) {
      queries.push(geocoder.geocode(query, context));
    }
    return this.combineResults(queries);
  }

  suggest?(query: string, context?: GeocodingContext): Promise<GeocodingResult[]> {
    const queries: Promise<GeocodingResult[]>[] = [];
	  for(const geocoder of this.options.geocoders) {
      if (geocoder.suggest) {
	      queries.push(geocoder.suggest(query, context));
      }
	  }
    return this.combineResults(queries);
  }

  reverse?(location: LatLngLiteral, scale: number): Promise<GeocodingResult[]> {
    const queries: Promise<GeocodingResult[]>[] = [];
    for(const geocoder of this.options.geocoders) {
      if (geocoder.reverse) {
	      queries.push(geocoder.reverse(location, scale));
      }
    }
    return this.combineResults(queries);
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link AggregatingGeocoder}
 * @param options the services to aggregate together.
 */
export function aggregatingGeocoder(options: Partial<AgregatorOptions>) {
  return new AggregatingGeocoder(options);
}
