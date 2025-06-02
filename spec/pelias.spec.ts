import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFetchRequest } from './mockFetchRequest';
import { Openrouteservice, PeliasResponse } from '../src/geocoders/pelias';

describe('L.Control.Geocoder.Openrouteservice', () => {
  afterEach(() => vi.clearAllMocks());
  const geocoder = new Openrouteservice({ apiKey: '0123' });

  it('geocodes Innsbruck', async () => {
    const result = await mockFetchRequest(
      'https://api.openrouteservice.org/geocode/search?api_key=0123&text=innsbruck',
      {
        geocoding: {
          version: '0.2',
          attribution: 'openrouteservice.org | OpenStreetMap contributors | Geocoding by Pelias',
          query: {
            size: 10,
            lang:  {
              name: 'English',
              iso6391: 'en',
              iso6393: 'eng',
              via: 'header',
              defaulted: false
            }
          },
          warnings: [`performance optimization: excluding 'address' layer`],
          engine: { name: 'Pelias', author: 'Mapzen', version: '1.0' }
        },
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [11.407851, 47.272308] },
            properties: {
              id: '101748061',
              gid: 'whosonfirst:locality:101748061',
              layer: 'locality',
              source: 'whosonfirst',
              source_id: '101748061',
              country_code: 'AT',
              name: 'Innsbruck',
              distance: 739.011,
              accuracy: 'centroid',
              country: 'Austria',
              country_gid: 'whosonfirst:country:85632785',
              country_a: 'AUT',
              region: 'Tyrol',
              region_gid: 'whosonfirst:region:85681661',
              region_a: 'TR',
              county: 'Innsbruck',
              county_gid: 'whosonfirst:county:102049723',
              localadmin: 'Innsbruck',
              localadmin_gid: 'whosonfirst:localadmin:1108837687',
              locality: 'Innsbruck',
              locality_gid: 'whosonfirst:locality:101748061',
              continent: 'Europe',
              continent_gid: 'whosonfirst:continent:102191581',
              label: 'Innsbruck, TR, Austria',
              category: [
                'admin:admin2',
                'admin'
              ],
              addendum: {
                concordances: {
                  'dbp:id': 'Innsbruck',
                  'fb:id': 'en.innsbruck',
                  'gn:id': 2775220,
                  'gp:id': 550763,
                  'nyt:id': 'N21126484242539583751',
                  'qs_pg:id': 274233,
                  'wd:id': 'Q1735',
                  'wk:page': 'Innsbruck'
                }
              }
            },
            bbox: [11.3218091258, 47.2470573997, 11.452584553, 47.29398]
          }
        ],
        bbox: [10.9896885523, 46.9624806033, 11.7051690163, 47.4499185397]
      } satisfies PeliasResponse,
      () => geocoder.geocode('innsbruck')
    );

    const feature = result[0];
    expect(feature.name).toBe('Innsbruck, TR, Austria');
    expect(feature.center).toStrictEqual({ lat: 47.272308, lng: 11.407851 });
    expect(feature.bbox).toStrictEqual({
      _southWest: { lat: 47.2470573997, lng: 11.3218091258 },
      _northEast: { lat: 47.29398, lng: 11.452584553 }
    });
    expect([[result]]).toMatchSnapshot();
  });
});
