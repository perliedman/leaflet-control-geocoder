import * as L from 'leaflet';
import { LatLng } from '../src/geocoders/latlng';

describe('LatLng', () => {
  // test cases from https://github.com/openstreetmap/openstreetmap-website/blob/master/test/controllers/geocoder_controller_test.rb
  let expected;
  beforeEach(() => {
    expected = L.latLng(50.06773, 14.37742);
  });

  it('geocodes basic lat/lon pairs', () => {
    geocode('50.06773 14.37742');
    geocode('50.06773, 14.37742');
    geocode('+50.06773 +14.37742');
    geocode('+50.06773, +14.37742');
  });

  it('does not geocode no-lat-lng', () => {
    const geocoder = new LatLng();
    const callback = jest.fn();
    geocoder.geocode('no-lat-lng', callback);
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('passes unsupported queries to the next geocoder', () => {
    const next = {
      geocode: (_query, cb) => cb('XXX')
    };
    const geocoder = new LatLng({ next: next });
    const callback = jest.fn();
    geocoder.geocode('no-lat-lng', callback);
    expect(callback).toHaveBeenCalledWith('XXX');
  });

  it('geocodes lat/lon pairs using N/E with degrees', () => {
    geocode('N50.06773 E14.37742');
    geocode('N50.06773, E14.37742');
    geocode('50.06773N 14.37742E');
    geocode('50.06773N, 14.37742E');
  });
  it('geocodes lat/lon pairs using N/W with degrees', () => {
    expected = L.latLng(50.06773, -14.37742);
    geocode('N50.06773 W14.37742');
    geocode('N50.06773, W14.37742');
    geocode('50.06773N 14.37742W');
    geocode('50.06773N, 14.37742W');
  });
  it('geocodes lat/lon pairs using S/E with degrees', () => {
    expected = L.latLng(-50.06773, 14.37742);
    geocode('S50.06773 E14.37742');
    geocode('S50.06773, E14.37742');
    geocode('50.06773S 14.37742E');
    geocode('50.06773S, 14.37742E');
  });
  it('geocodes lat/lon pairs using S/W with degrees', () => {
    expected = L.latLng(-50.06773, -14.37742);
    geocode('S50.06773 W14.37742');
    geocode('S50.06773, W14.37742');
    geocode('50.06773S 14.37742W');
    geocode('50.06773S, 14.37742W');
  });

  it('geocodes lat/lon pairs using N/E with degrees/mins', () => {
    expected = L.latLng(50.06773333333334, 14.377416666666667);
    geocode('N 50° 04.064 E 014° 22.645');
    geocode("N 50° 04.064' E 014° 22.645");
    geocode("N 50° 04.064', E 014° 22.645'");
    geocode('N50° 04.064 E14° 22.645');
    geocode('N 50 04.064 E 014 22.645');
    geocode('N50 4.064 E14 22.645');
    geocode("50° 04.064' N, 014° 22.645' E");
  });
  it('geocodes lat/lon pairs using N/W with degrees/mins', () => {
    expected = L.latLng(50.06773333333334, -14.377416666666667);
    geocode('N 50° 04.064 W 014° 22.645');
    geocode("N 50° 04.064' W 014° 22.645");
    geocode("N 50° 04.064', W 014° 22.645'");
    geocode('N50° 04.064 W14° 22.645');
    geocode('N 50 04.064 W 014 22.645');
    geocode('N50 4.064 W14 22.645');
    geocode("50° 04.064' N, 014° 22.645' W");
  });
  it('geocodes lat/lon pairs using S/E with degrees/mins', () => {
    expected = L.latLng(-50.06773333333334, 14.377416666666667);
    geocode('S 50° 04.064 E 014° 22.645');
    geocode("S 50° 04.064' E 014° 22.645");
    geocode("S 50° 04.064', E 014° 22.645'");
    geocode('S50° 04.064 E14° 22.645');
    geocode('S 50 04.064 E 014 22.645');
    geocode('S50 4.064 E14 22.645');
    geocode("50° 04.064' S, 014° 22.645' E");
  });
  it('geocodes lat/lon pairs using S/W with degrees/mins', () => {
    expected = L.latLng(-50.06773333333334, -14.377416666666667);
    geocode('S 50° 04.064 W 014° 22.645');
    geocode("S 50° 04.064' W 014° 22.645");
    geocode("S 50° 04.064', W 014° 22.645'");
    geocode('S50° 04.064 W14° 22.645');
    geocode('S 50 04.064 W 014 22.645');
    geocode('S50 4.064 W14 22.645');
    geocode("50° 04.064' S, 014° 22.645' W");
  });

  it('geocodes lat/lon pairs using N/E with degrees/mins/secs', () => {
    geocode('N 50° 4\' 03.828" E 14° 22\' 38.712"');
    geocode('N 50° 4\' 03.828", E 14° 22\' 38.712"');
    geocode('N 50° 4′ 03.828″, E 14° 22′ 38.712″');
    geocode('N50 4 03.828 E14 22 38.712');
    geocode('N50 4 03.828, E14 22 38.712');
    geocode('50°4\'3.828"N 14°22\'38.712"E');
  });
  it('geocodes lat/lon pairs using N/W with degrees/mins/secs', () => {
    expected = L.latLng(50.06773, -14.37742);
    geocode('N 50° 4\' 03.828" W 14° 22\' 38.712"');
    geocode('N 50° 4\' 03.828", W 14° 22\' 38.712"');
    geocode('N 50° 4′ 03.828″, W 14° 22′ 38.712″');
    geocode('N50 4 03.828 W14 22 38.712');
    geocode('N50 4 03.828, W14 22 38.712');
    geocode('50°4\'3.828"N 14°22\'38.712"W');
  });
  it('geocodes lat/lon pairs using S/E with degrees/mins/secs', () => {
    expected = L.latLng(-50.06773, 14.37742);
    geocode('S 50° 4\' 03.828" E 14° 22\' 38.712"');
    geocode('S 50° 4\' 03.828", E 14° 22\' 38.712"');
    geocode('S 50° 4′ 03.828″, E 14° 22′ 38.712″');
    geocode('S50 4 03.828 E14 22 38.712');
    geocode('S50 4 03.828, E14 22 38.712');
    geocode('50°4\'3.828"S 14°22\'38.712"E');
  });
  it('geocodes lat/lon pairs using S/W with degrees/mins/secs', () => {
    expected = L.latLng(-50.06773, -14.37742);
    geocode('S 50° 4\' 03.828" W 14° 22\' 38.712"');
    geocode('S 50° 4\' 03.828", W 14° 22\' 38.712"');
    geocode('S 50° 4′ 03.828″, W 14° 22′ 38.712″');
    geocode('S50 4 03.828 W14 22 38.712');
    geocode('S50 4 03.828, W14 22 38.712');
    geocode('50°4\'3.828"S 14°22\'38.712"W');
  });

  function geocode(query) {
    const geocoder = new LatLng();
    const callback = jest.fn();
    geocoder.geocode(query, callback);
    expect(callback).toBeCalledTimes(1);
    const feature = callback.mock.calls[0][0][0];
    expect(feature.name).toBe(query);
    expect(feature.center.lat).toBeCloseTo(expected.lat);
    expect(feature.center.lng).toBeCloseTo(expected.lng);
  }
});
