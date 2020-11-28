import * as L from 'leaflet';
import { getJSON } from '../util';
import {
  IGeocoder,
  GeocoderOptions,
  GeocodingCallback,
  geocodingParams,
  GeocodingResult,
  reverseParams
} from './api';

export interface PeliasOptions extends GeocoderOptions {}

/**
 * Implementation of the [Pelias](https://pelias.io/), [geocode.earth](https://geocode.earth/) geocoder (formerly Mapzen Search)
 */
export class Pelias implements IGeocoder {
  options: PeliasOptions = {
    serviceUrl: 'https://api.geocode.earth/v1'
  };

  private _lastSuggest = 0;

  constructor(options?: Partial<PeliasOptions>) {
    L.Util.setOptions(this, options);
  }

  geocode(query: string, cb: GeocodingCallback, context?: any): void {
    const params = geocodingParams(this.options, {
      api_key: this.options.apiKey,
      text: query
    });
    getJSON(this.options.serviceUrl + '/search', params, data => {
      cb.call(context, this._parseResults(data, 'bbox'));
    });
  }

  suggest(query: string, cb: GeocodingCallback, context?: any): void {
    const params = geocodingParams(this.options, {
      api_key: this.options.apiKey,
      text: query
    });
    getJSON(this.options.serviceUrl + '/autocomplete', params, data => {
      if (data.geocoding.timestamp > this._lastSuggest) {
        this._lastSuggest = data.geocoding.timestamp;
        cb.call(context, this._parseResults(data, 'bbox'));
      }
    });
  }

  reverse(location: L.LatLngLiteral, scale: number, cb: GeocodingCallback, context?: any): void {
    const params = reverseParams(this.options, {
      api_key: this.options.apiKey,
      'point.lat': location.lat,
      'point.lon': location.lng
    });
    getJSON(this.options.serviceUrl + '/reverse', params, data => {
      cb.call(context, this._parseResults(data, 'bounds'));
    });
  }

  _parseResults(data, bboxname) {
    const results: GeocodingResult[] = [];
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      onEachFeature: function(feature, layer: any) {
        const result = {} as GeocodingResult;
        let bbox;
        let center;

        if (layer.getBounds) {
          bbox = layer.getBounds();
          center = bbox.getCenter();
        } else if (layer.feature.bbox) {
          center = layer.getLatLng();
          bbox = L.latLngBounds(
            L.GeoJSON.coordsToLatLng(layer.feature.bbox.slice(0, 2)),
            L.GeoJSON.coordsToLatLng(layer.feature.bbox.slice(2, 4))
          );
        } else {
          center = layer.getLatLng();
          bbox = L.latLngBounds(center, center);
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
      L.Util.extend(
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
