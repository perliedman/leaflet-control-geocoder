import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFetchRequest } from './mockFetchRequest';
import { MapQuest } from '../src/geocoders/mapquest';

describe('L.Control.Geocoder.MapQuest', () => {
  afterEach(() => vi.clearAllMocks());
  it('geocodes Washington', async () => {
    const geocoder = new MapQuest({ apiKey: '0123xyz' });
    const result = await mockFetchRequest(
      'https://www.mapquestapi.com/geocoding/v1/address?key=0123xyz&location=Washington%2C+DC&limit=5&outFormat=json',
      {
        info: {
          statuscode: 0,
          copyright: {
            text: '© 2023 MapQuest, Inc.',
            imageUrl: 'https://api.mqcdn.com/res/mqlogo.gif',
            imageAltText: '© 2023 MapQuest, Inc.'
          },
          messages: []
        },
        options: {
          maxResults: -1,
          thumbMaps: true,
          ignoreLatLngInput: false
        },
        results: [
          {
            providedLocation: {
              location: 'Washington,DC'
            },
            locations: [
              {
                street: '',
                adminArea6: '',
                adminArea6Type: 'Neighborhood',
                adminArea5: 'Washington',
                adminArea5Type: 'City',
                adminArea4: 'District of Columbia',
                adminArea4Type: 'County',
                adminArea3: 'DC',
                adminArea3Type: 'State',
                adminArea1: 'US',
                adminArea1Type: 'Country',
                postalCode: '',
                geocodeQualityCode: 'A5XAX',
                geocodeQuality: 'CITY',
                dragPoint: false,
                sideOfStreet: 'N',
                linkId: '282772166',
                unknownInput: '',
                type: 's',
                latLng: {
                  lat: 38.892062,
                  lng: -77.019912
                },
                displayLatLng: {
                  lat: 38.892062,
                  lng: -77.019912
                },
                mapUrl:
                  'https://www.mapquestapi.com/staticmap/v5/getmap?key=KEY&type=map&size=225,160&pois=purple-1,38.892062,-77.019912,0,0,|&center=38.892062,-77.019912&zoom=12&rand=306744981'
              }
            ]
          }
        ]
      },
      () => geocoder.geocode('Washington, DC')
    );

    expect([[result]]).toMatchSnapshot();
  });
});
