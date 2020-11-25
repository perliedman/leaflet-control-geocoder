import { testXMLHttpRequest } from './mockXMLHttpRequest';
import { HERE } from '../src/geocoders/here';
import { GeocodingResult } from '../src/geocoders/api';

describe('L.Control.Geocoder.HERE', () => {
  it('geocodes Innsbruck', () => {
    const geocoder = new HERE({ app_id: 'xxx', app_code: 'yyy' });
    const callback = jest.fn();
    testXMLHttpRequest(
      'https://geocoder.api.here.com/6.2/geocode.json?searchtext=Innsbruck&gen=9&app_id=xxx&app_code=yyy&jsonattributes=1',
      {
        response: {
          view: [
            {
              result: [
                {
                  relevance: 1,
                  matchLevel: 'city',
                  matchQuality: {
                    city: 1
                  },
                  location: {
                    locationId: 'NT_Q9dJCLiAU-LWKKq1nkKnGD',
                    locationType: 'area',
                    displayPosition: {
                      latitude: 47.268,
                      longitude: 11.3913
                    },
                    navigationPosition: [
                      {
                        latitude: 47.268,
                        longitude: 11.3913
                      }
                    ],
                    mapView: {
                      topLeft: {
                        latitude: 47.35922,
                        longitude: 11.30194
                      },
                      bottomRight: {
                        latitude: 47.21082,
                        longitude: 11.45587
                      }
                    },
                    address: {
                      label: 'Innsbruck, Tirol, Österreich',
                      country: 'AUT',
                      state: 'Tirol',
                      county: 'Innsbruck-Stadt',
                      city: 'Innsbruck',
                      postalCode: '6020',
                      additionalData: [
                        {
                          value: 'Österreich',
                          key: 'CountryName'
                        },
                        {
                          value: 'Tirol',
                          key: 'StateName'
                        },
                        {
                          value: 'Innsbruck-Stadt',
                          key: 'CountyName'
                        }
                      ]
                    }
                  }
                }
              ],
              viewId: 0
            }
          ]
        }
      },
      () => geocoder.geocode('Innsbruck', callback)
    );

    const feature: GeocodingResult = callback.mock.calls[0][0][0];
    expect(feature.name).toBe('Innsbruck, Tirol, Österreich');
    expect(feature.center).toStrictEqual({ lat: 47.268, lng: 11.3913 });
    expect(feature.bbox).toStrictEqual({
      _northEast: { lat: 47.35922, lng: 11.45587 },
      _southWest: { lat: 47.21082, lng: 11.30194 }
    });
    expect(callback.mock.calls).toMatchSnapshot();
  });
});
