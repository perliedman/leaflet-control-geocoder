import { testXMLHttpRequest } from './mockXMLHttpRequest';
import { ArcGis } from '../src/geocoders/arcgis';

describe('L.Control.Geocoder.ArcGis', () => {
  it('geocodes Innsbruck', () => {
    const geocoder = new ArcGis();
    const callback = jest.fn();
    testXMLHttpRequest(
      'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?token=&SingleLine=Innsbruck&outFields=Addr_Type&forStorage=false&maxLocations=10&f=json',
      {
        spatialReference: { wkid: 4326, latestWkid: 4326 },
        candidates: [
          {
            address: 'Innsbruck, Innsbruck-Stadt, Tirol',
            location: { x: 11.391300000000058, y: 47.268000000000029 },
            score: 100,
            attributes: { Addr_Type: 'Locality' },
            extent: {
              xmin: 11.315300000000057,
              ymin: 47.192000000000029,
              xmax: 11.467300000000058,
              ymax: 47.34400000000003
            }
          }
        ]
      },
      () => geocoder.geocode('Innsbruck', callback)
    );

    const feature = callback.mock.calls[0][0][0];
    expect(feature.name).toBe('Innsbruck, Innsbruck-Stadt, Tirol');
    expect(feature.center).toStrictEqual({ lat: 47.26800000000003, lng: 11.391300000000058 });
    expect(feature.bbox).toStrictEqual({
      _northEast: { lat: 47.34400000000003, lng: 11.467300000000058 },
      _southWest: { lat: 47.19200000000003, lng: 11.315300000000057 }
    });
    expect(callback.mock.calls).toMatchSnapshot();
  });
});
