import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFetchRequest } from './mockFetchRequest';
import { Photon, PhotonResponse } from '../src/geocoders/photon';
import { GeocodingResult } from '../src/geocoders/api';

describe('L.Control.Geocoder.Photon', () => {
  afterEach(() => vi.clearAllMocks());
  it('geocodes Innsbruck', async () => {
    const geocoder = new Photon();
    const result = await mockFetchRequest(
      'https://photon.komoot.io/api/?q=Innsbruck',
      {
        features: [
          {
            geometry: { coordinates: [11.3927685, 47.2654296], type: 'Point' },
            type: 'Feature',
            properties: {
              osm_id: 8182617,
              osm_type: 'R',
              extent: [11.3811871, 47.2808566, 11.4181209, 47.2583715],
              country: 'Austria',
              osm_key: 'place',
              city: 'Innsbruck',
              countrycode: 'AT',
              osm_value: 'city',
              name: 'Innsbruck',
              state: 'Tyrol',
              type: 'locality'
            }
          },
          {
            geometry: { coordinates: [11.3959095, 47.2690806], type: 'Point' },
            type: 'Feature',
            properties: {
              osm_id: 7323902269,
              country: 'Austria',
              city: 'Innsbruck',
              countrycode: 'AT',
              postcode: '6020',
              type: 'house',
              osm_type: 'N',
              osm_key: 'amenity',
              housenumber: '1',
              street: 'Universitätsstraße',
              district: 'Innenstadt',
              osm_value: 'music_school',
              name: 'Mozarteum Innsbruck',
              state: 'Tyrol'
            }
          }
        ],
        type: 'FeatureCollection'
      } satisfies PhotonResponse,
      () => geocoder.geocode('Innsbruck')
    );

    const feature: GeocodingResult = result[0];
    expect(feature.name).toBe('Innsbruck, Innsbruck, Tyrol, Austria');
    expect(feature.center).toStrictEqual({ lat: 47.2654296, lng: 11.3927685 });
    expect(feature.bbox).toStrictEqual({
      _northEast: { lat: 47.2808566, lng: 11.4181209 },
      _southWest: { lat: 47.2583715, lng: 11.3811871 }
    });
    expect([[result]]).toMatchSnapshot();
  });
});
