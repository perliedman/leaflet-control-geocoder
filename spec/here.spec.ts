import { testXMLHttpRequest } from './mockXMLHttpRequest';
import { HERE } from '../src/geocoders/here';
import { HEREv2 } from '../src/geocoders/here';
import { GeocodingResult } from '../src/geocoders/api';

describe('L.Control.Geocoder.HERE', () => {
  it('geocodes Innsbruck', () => {
    const geocoder = new HERE({ app_id: 'xxx', app_code: 'yyy' });
    const callback = jest.fn();
    testXMLHttpRequest(
      'https://geocoder.api.here.com/6.2/geocode.json?searchtext=Innsbruck&gen=9&app_id=xxx&app_code=yyy&jsonattributes=1&maxresults=5',
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

describe('L.Control.Geocoder.HEREv2', () => {
  it('geocodes Innsbruck', () => {
    const geocodingParams = { at: '50.62925,3.057256' };
    const geocoder = new HEREv2({ apiKey: 'xxx', geocodingQueryParams: geocodingParams });
    const callback = jest.fn();
    testXMLHttpRequest(
      'https://geocode.search.hereapi.com/v1/discover?q=Innsbruck&apiKey=xxx&limit=10&at=50.62925%2C3.057256',
      {
        items: [
          {
            title: 'Salumeria Italiana',
            id: 'here:pds:place:840drt3p-898f6ee434794fe59895e71ccf9381e1',
            ontologyId: 'here:cm:ontology:restaurant',
            resultType: 'place',
            address: {
              label: 'Salumeria Italiana, 151 Richmond St, Boston, MA 02109, United States',
              countryCode: 'USA',
              countryName: 'United States',
              stateCode: 'MA',
              state: 'Massachusetts',
              county: 'Suffolk',
              city: 'Boston',
              district: 'North End',
              street: 'Richmond St',
              postalCode: '02109',
              houseNumber: '151'
            },
            position: { lat: 42.36355, lng: -71.05439 },
            access: [{ lat: 42.3635, lng: -71.05448 }],
            distance: 11,
            categories: [
              { id: '600-6300-0066', name: 'Grocery', primary: true },
              { id: '100-1000-0000', name: 'Restaurant' },
              { id: '100-1000-0006', name: 'Deli' },
              { id: '600-6300-0067', name: 'Specialty Food Store' }
            ],
            references: [
              { supplier: { id: 'core' }, id: '31213861' },
              { supplier: { id: 'tripadvisor' }, id: '3172680' },
              { supplier: { id: 'yelp' }, id: 'JNx0DlfndRurT-8KhSym7g' },
              { supplier: { id: 'yelp' }, id: 'P44VNcZUUNZfiFy-c4SUJw' }
            ],
            foodTypes: [
              { id: '304-000', name: 'Italian', primary: true },
              { id: '800-057', name: 'Pizza' },
              { id: '800-060', name: 'Sandwich' }
            ],
            contacts: [
              {
                phone: [
                  { value: '+16175234946' },
                  { value: '+16175238743' },
                  { value: '+16177204243' }
                ],
                fax: [{ value: '+16175234946' }],
                www: [{ value: 'http://www.salumeriaitaliana.com' }],
                email: [{ value: 'contact@salumeriaitaliana.com' }]
              }
            ],
            openingHours: [
              {
                text: ['Mon-Sat: 08:00 - 17:00', 'Sun: 10:00 - 16:00'],
                isOpen: false,
                structured: [
                  {
                    start: 'T080000',
                    duration: 'PT11H00M',
                    recurrence: 'FREQ:DAILY;BYDAY:MO,TU,WE,TH,FR,SA'
                  },
                  { start: 'T100000', duration: 'PT06H00M', recurrence: 'FREQ:DAILY;BYDAY:SU' }
                ]
              }
            ]
          }
        ]
      },
      () => geocoder.geocode('Innsbruck', callback)
    );

    const feature: GeocodingResult = callback.mock.calls[0][0][0];
    expect(feature.name).toBe(
      'Salumeria Italiana, 151 Richmond St, Boston, MA 02109, United States'
    );
    expect(feature.center).toStrictEqual({ lat: 42.36355, lng: -71.05439 });
    expect(callback.mock.calls).toMatchSnapshot();
  });
});
