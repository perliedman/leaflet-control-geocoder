import { expect, vi } from 'vitest';

export function mockFetchRequest<T>(url: string, response: T, trigger: () => void) {
  const headers = { Accept: 'application/json' };
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response)
    })
  ) as any;
  trigger();
  expect(fetch).toBeCalledTimes(1);
  expect(fetch).toBeCalledWith(url, { headers });
}
