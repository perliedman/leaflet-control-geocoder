describe('L.Control.Geocoder.Nominatim', function() {
  var server;
  var geocoder = new L.Control.Geocoder.Nominatim();

  beforeEach(function() {
    server = sinon.fakeServer.create();
  });
  afterEach(function() {
    server.restore();
  });

  it('geocodes Innsbruck', function() {
    server.respondWith(
      'https://nominatim.openstreetmap.org/search?q=innsbruck&limit=5&format=json&addressdetails=1',
      JSON.stringify([
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
          icon:
            'https://nominatim.openstreetmap.org/images/mapicons/poi_boundary_administrative.p.20.png',
          address: {
            city_district: 'Innsbruck',
            city: 'Innsbruck',
            county: 'Innsbruck',
            state: 'Tyrol',
            country: 'Austria',
            country_code: 'at'
          }
        }
      ])
    );

    var callback = sinon.fake();
    geocoder.geocode('innsbruck', callback);
    server.respond();

    expect(callback.calledOnce).to.be.ok();
    expect(callback.lastArg).to.be.ok();
    expect(callback.lastArg.length).to.eql(1);
    expect(callback.lastArg[0].name).to.eql('Innsbruck, Tyrol, Austria');
    expect(callback.lastArg[0].html).to.eql(
      '<span class=""> Innsbruck   </span><br/><span class="leaflet-control-geocoder-address-context">Tyrol Austria</span>'
    );
    expect(callback.lastArg[0].properties.address).to.eql({
      city_district: 'Innsbruck',
      city: 'Innsbruck',
      county: 'Innsbruck',
      state: 'Tyrol',
      country: 'Austria',
      country_code: 'at'
    });
  });

  it('reverse geocodes 47.3/11.3', function() {
    server.respondWith(
      'https://nominatim.openstreetmap.org/reverse?lat=47.3&lon=11.3&zoom=9&addressdetails=1&format=json',
      JSON.stringify({
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
      })
    );

    var callback = sinon.fake();
    geocoder.reverse({ lat: 47.3, lng: 11.3 }, 131000, callback);
    server.respond();

    expect(callback.calledOnce).to.be.ok();
    expect(callback.lastArg).to.be.ok();
    expect(callback.lastArg.length).to.eql(1);
    expect(callback.lastArg[0].name).to.eql('Innsbruck-Land, Tyrol, Austria');
    expect(callback.lastArg[0].html).to.eql('<span class="">Tyrol Austria</span>');
    expect(callback.lastArg[0].properties.address).to.eql({
      county: 'Innsbruck-Land',
      state: 'Tyrol',
      country: 'Austria',
      country_code: 'at'
    });
  });
});
