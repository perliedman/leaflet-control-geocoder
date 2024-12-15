import { afterEach, describe, expect, it, vi } from 'vitest';
import { GeocodingResult } from '../src/geocoders/api';
import { AzureMaps } from '../src/geocoders/azure';
import { mockFetchRequest } from './mockFetchRequest';

describe('L.Control.Geocoder.AzureMaps', () => {
  afterEach(() => vi.clearAllMocks());
  it('geocodes', async () => {
    const geocoder = new AzureMaps({ apiKey: 'xxx' });
    const result = await mockFetchRequest(
      'https://atlas.microsoft.com/search/address/json?api-version=1.0&query=15127+NE+24th+Street%2C+Redmond%2C+WA+98052&subscription-key=xxx',
      {
        summary: {
          query: '15127 NE 24th Street, Redmond, WA 98052',
          queryType: 'NON_NEAR',
          queryTime: 58,
          numResults: 1,
          offset: 0,
          totalResults: 1,
          fuzzyLevel: 1
        },
        results: [
          {
            type: 'Point Address',
            id: 'US/PAD/p0/19173426',
            score: 14.51,
            address: {
              streetNumber: '15127',
              streetName: 'NE 24th St',
              municipalitySubdivision: 'Redmond',
              municipality: 'Redmond, Adelaide, Ames Lake, Avondale, Earlmount',
              countrySecondarySubdivision: 'King',
              countryTertiarySubdivision: 'Seattle East',
              countrySubdivisionCode: 'WA',
              postalCode: '98052',
              extendedPostalCode: '980525544',
              countryCode: 'US',
              country: 'United States Of America',
              countryCodeISO3: 'USA',
              freeformAddress: '15127 NE 24th St, Redmond, WA 980525544',
              countrySubdivisionName: 'Washington'
            },
            position: {
              lat: 47.6308,
              lon: -122.1385
            },
            viewport: {
              topLeftPoint: {
                lat: 47.6317,
                lon: -122.13983
              },
              btmRightPoint: {
                lat: 47.6299,
                lon: -122.13717
              }
            },
            entryPoints: [
              {
                type: 'main',
                position: {
                  lat: 47.6315,
                  lon: -122.13852
                }
              }
            ]
          }
        ]
      },
      () => geocoder.geocode('15127 NE 24th Street, Redmond, WA 98052')
    );

    const feature: GeocodingResult = result[0];
    expect(feature.name).toBe('15127 NE 24th St, Redmond, WA 980525544');
    expect(feature.center).toStrictEqual({ lat: 47.6308, lng: -122.1385 });
    expect(feature.bbox).toStrictEqual({
      _northEast: { lat: 47.6317, lng: -122.13717 },
      _southWest: { lat: 47.6299, lng: -122.13983 }
    });
    expect([[result]]).toMatchSnapshot();
  });
});
