describe('L.Control.Geocoder.LatLng', function() {
  // test cases from https://github.com/openstreetmap/openstreetmap-website/blob/master/test/controllers/geocoder_controller_test.rb
  var expected;
  beforeEach(function() {
    expected = L.latLng(50.06773, 14.37742);
  });

  it('geocodes basic lat/lon pairs', function() {
    geocode('50.06773 14.37742');
    geocode('50.06773, 14.37742');
    geocode('+50.06773 +14.37742');
    geocode('+50.06773, +14.37742');
  });

  it('does not geocode no-lat-lng', function() {
    var geocoder = new L.Control.Geocoder.LatLng();
    var callback = sinon.fake();
    geocoder.geocode('no-lat-lng', callback);
    expect(callback.calledOnce).to.not.be.ok();
  });

  it('passes unsupported queries to the next geocoder', function() {
    var next = {
      geocode: function(_query, cb) {
        cb('XXX');
      }
    };
    var geocoder = new L.Control.Geocoder.LatLng({ next: next });
    var callback = sinon.fake();
    geocoder.geocode('no-lat-lng', callback);
    expect(callback.calledOnce).to.be.ok();
    expect(callback.lastArg).to.be.ok();
    expect(callback.lastArg).to.eql('XXX');
  });

  it('geocodes lat/lon pairs using N/E with degrees', function() {
    geocode('N50.06773 E14.37742');
    geocode('N50.06773, E14.37742');
    geocode('50.06773N 14.37742E');
    geocode('50.06773N, 14.37742E');
  });
  it('geocodes lat/lon pairs using N/W with degrees', function() {
    expected = L.latLng(50.06773, -14.37742);
    geocode('N50.06773 W14.37742');
    geocode('N50.06773, W14.37742');
    geocode('50.06773N 14.37742W');
    geocode('50.06773N, 14.37742W');
  });
  it('geocodes lat/lon pairs using S/E with degrees', function() {
    expected = L.latLng(-50.06773, 14.37742);
    geocode('S50.06773 E14.37742');
    geocode('S50.06773, E14.37742');
    geocode('50.06773S 14.37742E');
    geocode('50.06773S, 14.37742E');
  });
  it('geocodes lat/lon pairs using S/W with degrees', function() {
    expected = L.latLng(-50.06773, -14.37742);
    geocode('S50.06773 W14.37742');
    geocode('S50.06773, W14.37742');
    geocode('50.06773S 14.37742W');
    geocode('50.06773S, 14.37742W');
  });

  it('geocodes lat/lon pairs using N/E with degrees/mins', function() {
    expected = L.latLng(50.06773333333334, 14.377416666666667);
    geocode('N 50° 04.064 E 014° 22.645');
    geocode("N 50° 04.064' E 014° 22.645");
    geocode("N 50° 04.064', E 014° 22.645'");
    geocode('N50° 04.064 E14° 22.645');
    geocode('N 50 04.064 E 014 22.645');
    geocode('N50 4.064 E14 22.645');
    geocode("50° 04.064' N, 014° 22.645' E");
  });
  it('geocodes lat/lon pairs using N/W with degrees/mins', function() {
    expected = L.latLng(50.06773333333334, -14.377416666666667);
    geocode('N 50° 04.064 W 014° 22.645');
    geocode("N 50° 04.064' W 014° 22.645");
    geocode("N 50° 04.064', W 014° 22.645'");
    geocode('N50° 04.064 W14° 22.645');
    geocode('N 50 04.064 W 014 22.645');
    geocode('N50 4.064 W14 22.645');
    geocode("50° 04.064' N, 014° 22.645' W");
  });
  it('geocodes lat/lon pairs using S/E with degrees/mins', function() {
    expected = L.latLng(-50.06773333333334, 14.377416666666667);
    geocode('S 50° 04.064 E 014° 22.645');
    geocode("S 50° 04.064' E 014° 22.645");
    geocode("S 50° 04.064', E 014° 22.645'");
    geocode('S50° 04.064 E14° 22.645');
    geocode('S 50 04.064 E 014 22.645');
    geocode('S50 4.064 E14 22.645');
    geocode("50° 04.064' S, 014° 22.645' E");
  });
  it('geocodes lat/lon pairs using S/W with degrees/mins', function() {
    expected = L.latLng(-50.06773333333334, -14.377416666666667);
    geocode('S 50° 04.064 W 014° 22.645');
    geocode("S 50° 04.064' W 014° 22.645");
    geocode("S 50° 04.064', W 014° 22.645'");
    geocode('S50° 04.064 W14° 22.645');
    geocode('S 50 04.064 W 014 22.645');
    geocode('S50 4.064 W14 22.645');
    geocode("50° 04.064' S, 014° 22.645' W");
  });

  it('geocodes lat/lon pairs using N/E with degrees/mins/secs', function() {
    geocode('N 50° 4\' 03.828" E 14° 22\' 38.712"');
    geocode('N 50° 4\' 03.828", E 14° 22\' 38.712"');
    geocode('N 50° 4′ 03.828″, E 14° 22′ 38.712″');
    geocode('N50 4 03.828 E14 22 38.712');
    geocode('N50 4 03.828, E14 22 38.712');
    geocode('50°4\'3.828"N 14°22\'38.712"E');
  });
  it('geocodes lat/lon pairs using N/W with degrees/mins/secs', function() {
    expected = L.latLng(50.06773, -14.37742);
    geocode('N 50° 4\' 03.828" W 14° 22\' 38.712"');
    geocode('N 50° 4\' 03.828", W 14° 22\' 38.712"');
    geocode('N 50° 4′ 03.828″, W 14° 22′ 38.712″');
    geocode('N50 4 03.828 W14 22 38.712');
    geocode('N50 4 03.828, W14 22 38.712');
    geocode('50°4\'3.828"N 14°22\'38.712"W');
  });
  it('geocodes lat/lon pairs using S/E with degrees/mins/secs', function() {
    expected = L.latLng(-50.06773, 14.37742);
    geocode('S 50° 4\' 03.828" E 14° 22\' 38.712"');
    geocode('S 50° 4\' 03.828", E 14° 22\' 38.712"');
    geocode('S 50° 4′ 03.828″, E 14° 22′ 38.712″');
    geocode('S50 4 03.828 E14 22 38.712');
    geocode('S50 4 03.828, E14 22 38.712');
    geocode('50°4\'3.828"S 14°22\'38.712"E');
  });
  it('geocodes lat/lon pairs using S/W with degrees/mins/secs', function() {
    expected = L.latLng(-50.06773, -14.37742);
    geocode('S 50° 4\' 03.828" W 14° 22\' 38.712"');
    geocode('S 50° 4\' 03.828", W 14° 22\' 38.712"');
    geocode('S 50° 4′ 03.828″, W 14° 22′ 38.712″');
    geocode('S50 4 03.828 W14 22 38.712');
    geocode('S50 4 03.828, W14 22 38.712');
    geocode('50°4\'3.828"S 14°22\'38.712"W');
  });

  function geocode(query) {
    var geocoder = new L.Control.Geocoder.LatLng();
    var callback = sinon.fake();
    geocoder.geocode(query, callback);
    expect(callback.calledOnce).to.be.ok();
    expect(callback.lastArg).to.be.ok();
    expect(callback.lastArg).to.have.length(1);
    expect(callback.lastArg[0].name).to.eql(query);
    expect(callback.lastArg[0].center).to.eql(expected);
  }
});
