import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFetchRequest } from './mockFetchRequest';
import { Bing } from '../src/geocoders/bing';
import { GeocodingResult } from '../src/geocoders/api';

describe('L.Control.Geocoder.Bing', () => {
  afterEach(() => vi.clearAllMocks());
  it('geocodes Microsoft Way, Redmond', async () => {
    const geocoder = new Bing({ apiKey: '0123xyz' });
    const result = await mockFetchRequest(
      'https://dev.virtualearth.net/REST/v1/Locations/?query=Microsoft+Way%2C+Redmond&key=0123xyz',
      {
        authenticationResultCode: 'ValidCredentials',
        brandLogoUri: 'http:\/\/dev.virtualearth.net\/Branding\/logo_powered_by.png',
        copyright:
          'Copyright © 2011 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.',
        resourceSets: [
          {
            estimatedTotal: 1,
            resources: [
              {
                __type: 'Location:http:\/\/schemas.microsoft.com\/search\/local\/ws\/rest\/v1',
                bbox: [
                  47.636257744012461, -122.13735364288299, 47.643983179153814, -122.12206713944467
                ],
                name: '1 Microsoft Way, Redmond, WA 98052',
                point: {
                  type: 'Point',
                  coordinates: [47.640120461583138, -122.12971039116383]
                },
                address: {
                  addressLine: '1 Microsoft Way',
                  adminDistrict: 'WA',
                  adminDistrict2: 'King Co.',
                  countryRegion: 'United States',
                  formattedAddress: '1 Microsoft Way, Redmond, WA 98052',
                  locality: 'Redmond',
                  postalCode: '98052'
                },
                confidence: 'High',
                entityType: 'Address',
                geocodePoints: [
                  {
                    type: 'Point',
                    coordinates: [47.640120461583138, -122.12971039116383],
                    calculationMethod: 'InterpolationOffset',
                    usageTypes: ['Display']
                  },
                  {
                    type: 'Point',
                    coordinates: [47.640144601464272, -122.12976671755314],
                    calculationMethod: 'Interpolation',
                    usageTypes: ['Route']
                  }
                ],
                matchCodes: ['Good']
              }
            ]
          }
        ],
        statusCode: 200,
        statusDescription: 'OK',
        traceId: 'b0b1286504404eafa7e7dad3e749d570'
      },
      () => geocoder.geocode('Microsoft Way, Redmond')
    );

    const feature: GeocodingResult = result[0];
    expect(feature.name).toBe('1 Microsoft Way, Redmond, WA 98052');
    expect(feature.center).toStrictEqual({ lat: 47.64012046158314, lng: -122.12971039116383 });
    expect([[result]]).toMatchSnapshot();
  });
});
