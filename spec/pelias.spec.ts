import { testXMLHttpRequest } from './mockXMLHttpRequest';
import { Openrouteservice } from '../src/geocoders/pelias';

describe('L.Control.Geocoder.Openrouteservice', () => {
  const geocoder = new Openrouteservice({ apiKey: '0123' });

  it('geocodes Innsbruck', () => {
    const callback = jest.fn();
    testXMLHttpRequest(
      'https://api.openrouteservice.org/geocode/search?api_key=0123&text=innsbruck',
      {
        geocoding: {
          version: '0.2',
          attribution: 'openrouteservice.org | OpenStreetMap contributors | Geocoding by Pelias',
          query: {},
          warnings: ["performance optimization: excluding 'address' layer"],
          engine: { name: 'Pelias', author: 'Mapzen', version: '1.0' }
        },
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [11.407851, 47.272308] },
            properties: {
              id: '101748061',
              layer: 'locality',
              source_id: '101748061',
              name: 'Innsbruck',
              confidence: 1,
              match_type: 'exact',
              accuracy: 'centroid',
              country: 'Austria',
              country_a: 'AUT',
              region: 'Tirol',
              region_a: 'TR',
              county: 'Innsbruck',
              county_a: 'IN',
              localadmin: 'Innsbruck',
              locality: 'Innsbruck',
              continent: 'Europe',
              label: 'Innsbruck, Austria'
            },
            bbox: [11.3218091258, 47.2470573997, 11.452584553, 47.29398]
          }
        ],
        bbox: [10.9896885523, 46.9624806033, 11.7051690163, 47.4499185397]
      },
      () => geocoder.geocode('innsbruck', callback)
    );

    const feature = callback.mock.calls[0][0][0];
    expect(feature.name).toBe('Innsbruck, Austria');
    expect(feature.center).toStrictEqual({ lat: 47.272308, lng: 11.407851 });
    expect(feature.bbox).toStrictEqual({
      _southWest: { lat: 47.2470573997, lng: 11.3218091258 },
      _northEast: { lat: 47.29398, lng: 11.452584553 }
    });
    expect(callback.mock.calls).toMatchSnapshot();
  });
});
