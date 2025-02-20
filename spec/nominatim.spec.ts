import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFetchRequest } from './mockFetchRequest';
import { Nominatim, NominatimResponse } from '../src/geocoders/nominatim';

describe('L.Control.Geocoder.Nominatim', () => {
  afterEach(() => vi.clearAllMocks());
  const geocoder = new Nominatim();

  it('geocodes Innsbruck', async () => {
    const result = await mockFetchRequest(
      'https://nominatim.openstreetmap.org/search?q=innsbruck&limit=5&format=json&addressdetails=1',
      [
        {
          place_id: 199282228,
          licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
          osm_type: 'relation',
          osm_id: 8182617,
          boundingbox: ['47.2583715', '47.2808566', '11.3811871', '11.418183'],
          lat: '47.26951525',
          lon: '11.3971372042211',
          display_name: 'Innsbruck, Tyrol, Austria',
          class: 'boundary',
          type: 'administrative',
          importance: 0.763909048330467,
          icon: 'https://nominatim.openstreetmap.org/images/mapicons/poi_boundary_administrative.p.20.png',
          address: {
            city_district: 'Innsbruck',
            city: 'Innsbruck',
            county: 'Innsbruck',
            state: 'Tyrol',
            country: 'Austria',
            country_code: 'at'
          }
        }
      ] satisfies NominatimResponse,
      () => geocoder.geocode('innsbruck')
    );

    const feature = result[0];
    expect(feature.name).toBe('Innsbruck, Tyrol, Austria');
    expect(feature.html).toBe(
      '<span class=""> Innsbruck   </span><br/><span class="leaflet-control-geocoder-address-context">Tyrol Austria</span>'
    );
    expect(feature.properties.address).toStrictEqual({
      city_district: 'Innsbruck',
      city: 'Innsbruck',
      county: 'Innsbruck',
      state: 'Tyrol',
      country: 'Austria',
      country_code: 'at'
    });
    expect([[result]]).toMatchSnapshot();
  });

  it('geocodes Innsbruck using a custom htmlTemplate', async () => {
    const geocoder2 = new Nominatim({
      htmlTemplate(result) {
        const osm = [result.osm_type, result.osm_id].join('/');
        return `${result.display_name} <a href="https://www.openstreetmap.org/${osm}">${osm}</a>`;
      }
    });
    const result = await mockFetchRequest(
      'https://nominatim.openstreetmap.org/search?q=innsbruck&limit=5&format=json&addressdetails=1',
      [
        {
          place_id: 199282228,
          licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
          osm_type: 'relation',
          osm_id: 8182617,
          boundingbox: ['47.2583715', '47.2808566', '11.3811871', '11.418183'],
          lat: '47.26951525',
          lon: '11.3971372042211',
          display_name: 'Innsbruck, Tyrol, Austria',
          class: 'boundary',
          type: 'administrative',
          importance: 0.763909048330467,
          icon: 'https://nominatim.openstreetmap.org/images/mapicons/poi_boundary_administrative.p.20.png',
          address: {
            city_district: 'Innsbruck',
            city: 'Innsbruck',
            county: 'Innsbruck',
            state: 'Tyrol',
            country: 'Austria',
            country_code: 'at'
          }
        }
      ] satisfies NominatimResponse,
      () => geocoder2.geocode('innsbruck')
    );
    const feature = result[0];
    expect(feature.html).toBe(
      'Innsbruck, Tyrol, Austria <a href="https://www.openstreetmap.org/relation/8182617">relation/8182617</a>'
    );
    expect([[result]]).toMatchSnapshot();
  });

  it('reverse geocodes 47.3/11.3', async () => {
    const result = await mockFetchRequest(
      'https://nominatim.openstreetmap.org/reverse?lat=47.3&lon=11.3&zoom=9&addressdetails=1&format=json',
      {
        place_id: 197718025,
        licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
        osm_type: 'relation',
        osm_id: 78251,
        lat: '47.2065094',
        lon: '11.3836945900354',
        display_name: 'Innsbruck-Land, Tyrol, Austria',
        address: {
          county: 'Innsbruck-Land',
          state: 'Tyrol',
          country: 'Austria',
          country_code: 'at'
        },
        boundingbox: ['46.9624854', '47.4499229', '10.9896868', '11.7051742']
      } satisfies NominatimResponse[number],
      () => geocoder.reverse({ lat: 47.3, lng: 11.3 }, 131000)
    );

    const feature = result[0];
    expect(feature.name).toBe('Innsbruck-Land, Tyrol, Austria');
    expect(feature.html).toBe('<span class="">Tyrol Austria</span>');
    expect(feature.properties.address).toStrictEqual({
      county: 'Innsbruck-Land',
      state: 'Tyrol',
      country: 'Austria',
      country_code: 'at'
    });
    expect([[result]]).toMatchSnapshot();
  });
});
