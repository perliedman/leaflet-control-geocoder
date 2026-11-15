import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import * as L from 'leaflet';
import Geocoder, { geocoder as geocoderFactory, geocoders } from '../src/index';
import { GeocoderControl } from '../src/control';
import type { GeocodingResult, IGeocoder } from '../src/geocoders/api';

function result(name: string, lat: number, lng: number): GeocodingResult {
  const center = new L.LatLng(lat, lng);
  return { name, center, bbox: center.toBounds(1000) };
}

const innsbruck = result('Innsbruck', 47.2654296, 11.3927685);
const vienna = result('Vienna', 48.2083537, 16.3725042);

function fakeGeocoder(results: GeocodingResult[]): IGeocoder {
  return { geocode: vi.fn(async () => results) };
}

function pressEnter(input: HTMLInputElement) {
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
}

describe(`GeocoderControl (Leaflet ${L.version})`, () => {
  let container: HTMLDivElement;
  let map: L.Map;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '400px';
    container.style.height = '300px';
    document.body.appendChild(container);
    map = new L.Map(container).setView([47, 11], 5);
  });

  afterEach(() => {
    map.remove();
    container.remove();
  });

  it('registers on L.Control', () => {
    expect((L.Control as any).Geocoder).toBe(GeocoderControl);
    expect((L.Control as any).geocoder).toBe(geocoderFactory);
    expect(Geocoder).toBe(GeocoderControl);
    expect((Geocoder as any).Nominatim).toBe(geocoders.Nominatim);
  });

  it('merges options with defaults', () => {
    const control = new GeocoderControl({ placeholder: 'Find…', position: 'topleft' });
    expect(control.options.placeholder).toBe('Find…');
    expect(control.options.position).toBe('topleft');
    expect(control.getPosition()).toBe('topleft');
    expect(control.options.collapsed).toBe(true);
    expect(control.options.geocoder).toBeInstanceOf(geocoders.Nominatim);
  });

  it('adds to and removes from the map', () => {
    const control = geocoderFactory({ geocoder: fakeGeocoder([]) }).addTo(map);
    const el = control.getContainer()!;
    expect(el.classList).toContain('leaflet-control-geocoder');
    expect(container.querySelector('.leaflet-top.leaflet-right')!.contains(el)).toBe(true);
    const input = el.querySelector('input')!;
    expect(input.type).toBe('search');
    expect(input.placeholder).toBe('Search...');

    control.remove();
    expect(container.contains(el)).toBe(false);
  });

  it('expands and collapses on mousedown', () => {
    const control = new GeocoderControl({ geocoder: fakeGeocoder([]) }).addTo(map);
    const el = control.getContainer()!;
    const expand = vi.fn();
    const collapse = vi.fn();
    control.on('expand', expand).on('collapse', collapse);

    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(el.classList).toContain('leaflet-control-geocoder-expanded');
    expect(expand).toHaveBeenCalledOnce();

    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(el.classList).not.toContain('leaflet-control-geocoder-expanded');
    expect(collapse).toHaveBeenCalledOnce();
  });

  it('geocodes a unique result and marks it on the map', async () => {
    const geocoder = fakeGeocoder([innsbruck]);
    const fitBounds = vi.spyOn(map, 'fitBounds');
    const control = new GeocoderControl({ geocoder }).addTo(map);
    const start = vi.fn();
    const finish = vi.fn();
    const mark = vi.fn();
    control.on('startgeocode', start).on('finishgeocode', finish).on('markgeocode', mark);

    const input = control.getContainer()!.querySelector('input')!;
    control.setQuery('Innsbruck');
    pressEnter(input);
    await vi.waitFor(() => expect(mark).toHaveBeenCalled());

    expect(geocoder.geocode).toHaveBeenCalledWith('Innsbruck', {
      map,
      signal: expect.any(AbortSignal)
    });
    expect(start.mock.calls[0][0]).toMatchObject({ input: 'Innsbruck' });
    expect(finish.mock.calls[0][0]).toMatchObject({ input: 'Innsbruck', results: [innsbruck] });
    expect(mark.mock.calls[0][0]).toMatchObject({ geocode: innsbruck });

    const markers: L.Marker[] = [];
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) markers.push(layer);
    });
    expect(markers).toHaveLength(1);
    expect(markers[0].getLatLng().equals(innsbruck.center)).toBe(true);
    expect(markers[0].getPopup()!.getContent()).toBe('Innsbruck');
    expect(fitBounds).toHaveBeenCalledWith(innsbruck.bbox);
  });

  it('lists multiple results and selects one by keyboard', async () => {
    const control = new GeocoderControl({ geocoder: fakeGeocoder([innsbruck, vienna]) }).addTo(map);
    const mark = vi.fn();
    control.on('markgeocode', mark);

    const el = control.getContainer()!;
    const input = el.querySelector('input')!;
    control.setQuery('Austria');
    pressEnter(input);
    await vi.waitFor(() =>
      expect(el.querySelectorAll('.leaflet-control-geocoder-alternatives li')).toHaveLength(2)
    );
    expect(el.classList).toContain('leaflet-control-geocoder-options-open');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    pressEnter(input);
    expect(mark).toHaveBeenCalledOnce();
    expect(mark.mock.calls[0][0]).toMatchObject({ geocode: vienna });
  });

  it('shows an error when nothing is found', async () => {
    const control = new GeocoderControl({ geocoder: fakeGeocoder([]) }).addTo(map);
    const el = control.getContainer()!;
    const finish = vi.fn();
    control.on('finishgeocode', finish);
    control.setQuery('nowhere');
    pressEnter(el.querySelector('input')!);
    await vi.waitFor(() => expect(finish).toHaveBeenCalled());
    expect(el.classList).toContain('leaflet-control-geocoder-options-error');
  });

  it('fires errorgeocode and stops the throbber when geocoding fails', async () => {
    const error = new Error('network down');
    const geocoder: IGeocoder = { geocode: vi.fn(async () => Promise.reject(error)) };
    const control = new GeocoderControl({ geocoder }).addTo(map);
    const el = control.getContainer()!;
    const onError = vi.fn();
    control.on('errorgeocode', onError);
    control.setQuery('Innsbruck');
    pressEnter(el.querySelector('input')!);
    await vi.waitFor(() => expect(onError).toHaveBeenCalled());
    expect(onError.mock.calls[0][0]).toMatchObject({ input: 'Innsbruck', error });
    expect(el.classList).not.toContain('leaflet-control-geocoder-throbber');
    expect(el.classList).toContain('leaflet-control-geocoder-options-error');
  });

  it('aborts a superseded request', async () => {
    const signals: AbortSignal[] = [];
    const geocoder: IGeocoder = {
      geocode: vi.fn(
        (query, context) =>
          new Promise<GeocodingResult[]>((resolve, reject) => {
            signals.push(context!.signal!);
            context!.signal!.addEventListener('abort', () => reject(context!.signal!.reason));
            if (query === 'Vienna') resolve([vienna]);
          })
      )
    };
    const control = new GeocoderControl({ geocoder }).addTo(map);
    const input = control.getContainer()!.querySelector('input')!;
    const mark = vi.fn();
    const onError = vi.fn();
    control.on('markgeocode', mark).on('errorgeocode', onError);

    control.setQuery('Innsbruck');
    pressEnter(input);
    control.setQuery('Vienna');
    pressEnter(input);
    await vi.waitFor(() => expect(mark).toHaveBeenCalledOnce());

    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
    expect(mark.mock.calls[0][0]).toMatchObject({ geocode: vienna });
    expect(onError).not.toHaveBeenCalled();
  });

  it('aborts a pending request when removed from the map', () => {
    let signal: AbortSignal | undefined;
    const geocoder: IGeocoder = {
      geocode: vi.fn((_query, context) => {
        signal = context!.signal;
        return new Promise<GeocodingResult[]>(() => {});
      })
    };
    const control = new GeocoderControl({ geocoder }).addTo(map);
    control.setQuery('Innsbruck');
    pressEnter(control.getContainer()!.querySelector('input')!);
    control.remove();
    expect(signal!.aborted).toBe(true);
  });
});
