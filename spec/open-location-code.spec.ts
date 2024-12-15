import { describe, expect, it, vi } from 'vitest';
// import './vendor/openlocationcode';
import * as OpenLocationCode from './vendor/openlocationcode';
import { OpenLocationCode as Geocoder } from '../src/geocoders/open-location-code';

describe('L.Control.Geocoder.OpenLocationCode', () => {
  const geocoder = new Geocoder({ OpenLocationCode: OpenLocationCode });

  it('geocodes 9C3XGW4F+5V', async () => {
    const result = await geocoder.geocode('9C3XGW4F+5V');
    const feature = result[0];
    expect(feature.name).toBe('9C3XGW4F+5V');
    expect(feature.center.lat).toBeCloseTo(51.505437499999985);
    expect(feature.center.lng).toBeCloseTo(-0.07531249999998124);
  });

  it('reverse geocodes 47.3/11.3', async () => {
    const result = await geocoder.reverse({ lat: 47.3, lng: 11.3 }, 131000);
    const feature = result[0];
    expect(feature.name).toBe('8FVH8822+22');
  });
});
