import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { getJSON, template } from '../src/util';
import { HttpError } from '../src/geocoders/api';

describe('getJSON', () => {
  afterEach(() => vi.restoreAllMocks());

  it('omits undefined and null parameters', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ ok: 1 }));
    await expect(
      getJSON('https://example.com/search', {
        q: 'x',
        key: undefined,
        n: null,
        a: [1, 2],
        b: false
      })
    ).resolves.toEqual({ ok: 1 });
    expect(fetch).toHaveBeenCalledWith('https://example.com/search?q=x&a=1&a=2&b=false', {
      headers: { Accept: 'application/json' }
    });
  });

  it('rejects with HttpError on HTTP error status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{"error":"denied"}', { status: 403, statusText: 'Forbidden' })
    );
    const promise = getJSON('https://example.com/search', {});
    await expect(promise).rejects.toBeInstanceOf(HttpError);
    await expect(promise).rejects.toMatchObject({ response: { status: 403 } });
  });

  it('passes the abort signal to fetch', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json([]));
    const { signal } = new AbortController();
    await getJSON('https://example.com/search', {}, signal);
    expect(fetch).toHaveBeenCalledWith('https://example.com/search', {
      headers: { Accept: 'application/json' },
      signal
    });
  });
});

describe('template', () => {
  it('escapes HTML in values', () => {
    expect(template('<b>{name}</b>', { name: '<img src=x onerror=alert(1)>' })).toBe(
      '<b>&lt;img src=x onerror=alert(1)&gt;</b>'
    );
  });
});
