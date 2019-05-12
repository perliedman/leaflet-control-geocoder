describe('L.Control.Geocoder.Openrouteservice', function() {
  var server;
  var geocoder = new L.Control.Geocoder.Openrouteservice('0123');

  beforeEach(function() {
    server = sinon.fakeServer.create();
  });
  afterEach(function() {
    server.restore();
  });

  it('geocodes Innsbruck', function() {
    server.respondWith(
      'https://api.openrouteservice.org/geocode/search?api_key=0123&text=innsbruck',
      JSON.stringify({
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
      })
    );

    var callback = sinon.fake();
    geocoder.geocode('innsbruck', callback);
    server.respond();

    expect(callback.calledOnce).to.be.ok();
    expect(callback.lastArg).to.be.ok();
    expect(callback.lastArg.length).to.eql(1);
    expect(callback.lastArg[0].name).to.eql('Innsbruck, Austria');
    expect(callback.lastArg[0].center).to.eql({ lat: 47.272308, lng: 11.407851 });
    expect(callback.lastArg[0].bbox).to.eql(
      L.latLngBounds([
        { lat: 47.2470573997, lng: 11.3218091258 },
        { lat: 47.29398, lng: 11.452584553 }
      ])
    );
  });
});
