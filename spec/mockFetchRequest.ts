import { expect, vi } from 'vitest';

export async function mockFetchRequest<T>(
  url: string,
  response: unknown,
  trigger: () => T
): Promise<T> {
  const headers = { Accept: 'application/json' };
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response)
    })
  ) as any;
  const result = await trigger();
  expect(fetch).toBeCalledTimes(1);
  expect(fetch).toBeCalledWith(url, { headers });
  return result;
}
