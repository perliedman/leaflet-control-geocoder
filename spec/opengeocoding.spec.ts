import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { mockFetchRequest } from './mockFetchRequest';
import {
  OpenGeocoding,
  OpenGeocodingAddress,
  OpenGeocodingReverseResponse
} from '../src/geocoders/opengeocoding';

describe('L.Control.Geocoder.OpenGeocoding', () => {
  afterEach(() => vi.clearAllMocks());
  const apiKey = { 'x-api-key': 'og_browser' };

  it('requires an API key', () => {
    expect(() => new OpenGeocoding()).toThrow('OpenGeocoding requires an API key.');
  });

  it('geocodes Rådhuspladsen 1 with the key in a header', async () => {
    const geocoder = new OpenGeocoding({ apiKey: 'og_browser' });
    const address = {
      displayName: 'Rådhuspladsen 1, 1550 København V, Danmark',
      goodMatch: true,
      geoCoordinates: { lat: 55.6759, lon: 12.5694 }
    } satisfies OpenGeocodingAddress;
    const result = await mockFetchRequest(
      'https://api.opengeocoding.com/v1/search?addressString=R%C3%A5dhuspladsen+1%2C+K%C3%B8benhavn',
      address,
      () => geocoder.geocode('Rådhuspladsen 1, København'),
      apiKey
    );

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Rådhuspladsen 1, 1550 København V, Danmark');
    expect(result[0].center).toStrictEqual({ lat: 55.6759, lng: 12.5694 });
    expect(result[0].bbox).toStrictEqual({
      _northEast: { lat: 55.6759, lng: 12.5694 },
      _southWest: { lat: 55.6759, lng: 12.5694 }
    });
    expect(result[0].properties).toStrictEqual(address);
  });

  it('returns no results for an empty response', async () => {
    const geocoder = new OpenGeocoding({ apiKey: 'og_browser' });
    const result = await mockFetchRequest(
      'https://api.opengeocoding.com/v1/search?addressString=xqzjvw',
      {},
      () => geocoder.geocode('xqzjvw'),
      apiKey
    );
    expect(result).toStrictEqual([]);
  });

  it('reads omitted zero coordinates as 0 and uses the bounding box', async () => {
    const geocoder = new OpenGeocoding({ apiKey: 'og_browser' });
    const result = await mockFetchRequest(
      'https://api.opengeocoding.com/v1/search?addressString=Gulf+of+Guinea',
      {
        displayName: 'Gulf of Guinea',
        geoCoordinates: {
          lon: 1.5,
          boundingBox: { minLat: -2, minLon: -1, maxLat: 2, maxLon: 4 }
        }
      } satisfies OpenGeocodingAddress,
      () => geocoder.geocode('Gulf of Guinea'),
      apiKey
    );
    expect(result[0].center).toStrictEqual({ lat: 0, lng: 1.5 });
    expect(result[0].bbox).toStrictEqual({
      _northEast: { lat: 2, lng: 4 },
      _southWest: { lat: -2, lng: -1 }
    });
  });

  it('reverse geocodes with the configured limit', async () => {
    const geocoder = new OpenGeocoding({ apiKey: 'og_browser', reverseLimit: 2 });
    const response = {
      results: [
        {
          address: {
            displayName: 'Rådhuspladsen 1, 1550 København V, Danmark',
            geoCoordinates: { lat: 55.6759, lon: 12.5694 }
          },
          distanceM: 4.2,
          layer: 'address'
        },
        { address: { displayName: 'No coordinates' }, layer: 'address' }
      ]
    } satisfies OpenGeocodingReverseResponse;
    const result = await mockFetchRequest(
      'https://api.opengeocoding.com/v1/reverse?lat=55.676&lon=12.569&size=2',
      response,
      () => geocoder.reverse({ lat: 55.676, lng: 12.569 }, 1),
      apiKey
    );

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Rådhuspladsen 1, 1550 København V, Danmark');
    expect(result[0].center).toStrictEqual({ lat: 55.6759, lng: 12.5694 });
    expect(result[0].properties).toStrictEqual(response.results[0]);
  });
});
