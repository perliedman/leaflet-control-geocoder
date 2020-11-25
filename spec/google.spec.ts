import { testXMLHttpRequest } from './mockXMLHttpRequest';
import { Google } from '../src/geocoders/google';
import { GeocodingResult } from '../src/geocoders/api';

describe('L.Control.Geocoder.Google', () => {
  it('geocodes Innsbruck', () => {
    const geocoder = new Google({ apiKey: '0123xyz' });
    const callback = jest.fn();
    testXMLHttpRequest(
      'https://maps.googleapis.com/maps/api/geocode/json?key=0123xyz&address=Innsbruck',
      {
        results: [
          {
            address_components: [
              {
                long_name: 'Innsbruck',
                short_name: 'Innsbruck',
                types: ['locality', 'political']
              },
              {
                long_name: 'Innsbruck',
                short_name: 'Innsbruck',
                types: ['administrative_area_level_2', 'political']
              },
              {
                long_name: 'Tyrol',
                short_name: 'Tyrol',
                types: ['administrative_area_level_1', 'political']
              },
              {
                long_name: 'Austria',
                short_name: 'AT',
                types: ['country', 'political']
              }
            ],
            formatted_address: 'Innsbruck, Austria',
            geometry: {
              bounds: {
                northeast: {
                  lat: 47.3599301,
                  lng: 11.45593
                },
                southwest: {
                  lat: 47.21098000000001,
                  lng: 11.3016499
                }
              },
              location: {
                lat: 47.2692124,
                lng: 11.4041024
              },
              location_type: 'APPROXIMATE',
              viewport: {
                northeast: {
                  lat: 47.3599301,
                  lng: 11.45593
                },
                southwest: {
                  lat: 47.21098000000001,
                  lng: 11.3016499
                }
              }
            },
            place_id: 'ChIJc8r44c9unUcRDZsdKH0cIJ0',
            types: ['locality', 'political']
          }
        ],
        status: 'OK'
      },
      () => geocoder.geocode('Innsbruck', callback)
    );

    const feature: GeocodingResult = callback.mock.calls[0][0][0];
    expect(feature.name).toBe('Innsbruck, Austria');
    expect(feature.center).toStrictEqual({ lat: 47.2692124, lng: 11.4041024 });
    expect(feature.bbox).toStrictEqual({
      _northEast: { lat: 47.3599301, lng: 11.45593 },
      _southWest: { lat: 47.21098000000001, lng: 11.3016499 }
    });
    expect(callback.mock.calls).toMatchSnapshot();
  });
});
