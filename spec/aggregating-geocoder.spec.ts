import { describe, expect, it, vi } from 'vitest';
import { AggregatingGeocoder, AgregatorOptions } from '../src/geocoders/aggregating-geocoder';
import { LatLngLiteral } from 'leaflet';

describe('L.Control.Geocoder.AggregatingGeocoder', () => {
  it('geocde returns empty when no geocoders', async () => {
    const options: AgregatorOptions = {
      geocoders: []
    }
    const geocoder = new AggregatingGeocoder(options);

    const results = await geocoder.geocode('foo');
    expect(results).toEqual([]);
  });

  it('suggest returns empty when no geocoders', async () => {
	  const options: AgregatorOptions = {
	    geocoders: []
	  }
	  const geocoder = new AggregatingGeocoder(options);

	  const results = await geocoder.suggest('foo');
	  expect(results).toEqual([]);
  });

  it('reverse returns emtpy when no geocoders', async () => {
    const options: AgregatorOptions = {
	    geocoders: []
    }
    const geocoder = new AggregatingGeocoder(options);

    const loc: LatLngLiteral = {
      lat: 0,
      lng: 0
    };
    const results = await geocoder.reverse(loc, 1);
    expect(results).toEqual([]);
  });
});
