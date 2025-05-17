import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFetchRequest } from './mockFetchRequest';
import { OpenCage } from '../src/geocoders/opencage';

describe('L.Control.Geocoder.OpenCage', () => {
  afterEach(() => vi.clearAllMocks());
  it('geocodes Eiffel Tower', async () => {
    const geocoder = new OpenCage({ apiKey: '0123xyz' });
    const result = await mockFetchRequest(
      'https://api.opencagedata.com/geocode/v1/json?key=0123xyz&q=Eiffel+Tower',
      {
        documentation: 'https://opencagedata.com/geosearch',
        licenses: [
          {
            name: 'see attribution guide',
            url: 'https://opencagedata.com/credits'
          }
        ],
        results: [
          {
            bounds: {
              northeast: {
                lat: '48.859830',
                lng: '2.296873'
              },
              southwest: {
                lat: '48.856690',
                lng: '2.292125'
              }
            },
            formatted: 'Eiffel Tower, Paris, Ile-de-France, France',
            geometry: {
              lat: '48.858260',
              lng: '2.294499'
            },
            name: 'Eiffel Tower'
          },
          {
            bounds: {
              northeast: {
                lat: '36.112760',
                lng: '-115.171728'
              },
              southwest: {
                lat: '36.112166',
                lng: '-115.172608'
              }
            },
            formatted: 'Eiffel Tower Restaurant, Clark County, Nevada, USA',
            geometry: {
              lat: '36.112463',
              lng: '-115.172168'
            },
            name: 'Eiffel Tower Restaurant'
          }
        ],
        status: {
          code: 200,
          message: 'OK'
        },
        stay_informed: {
          blog: 'https://blog.opencagedata.com',
          mastodon: 'https://en.osm.town/@opencage'
        },
        thanks: 'For using an OpenCage API',
        timestamp: {
          created_http: 'Sat, 17 May 2025 20:08:23 GMT',
          created_unix: 1747512503
        },
        total_results: 2
      },
      () => geocoder.geocode('Eiffel Tower')
    );

    expect([[result]]).toMatchSnapshot();
  });
});
