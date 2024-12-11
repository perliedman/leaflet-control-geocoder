import { expect, vi } from 'vitest';

export function mockXMLHttpRequest<T>(response: T): XMLHttpRequest {
  const xhrMock: Partial<XMLHttpRequest> = {
    open: vi.fn(),
    send: vi.fn(),
    setRequestHeader: vi.fn(),
    readyState: 4,
    status: 200,
    response
  };
  vi.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock as XMLHttpRequest);
  return xhrMock as XMLHttpRequest;
}

export function testXMLHttpRequest<T>(url: string, response: T, trigger: () => void) {
  const xhrMock = mockXMLHttpRequest(response);
  trigger();
  expect(xhrMock.open).toBeCalledWith('GET', url, true);
  expect(xhrMock.setRequestHeader).toBeCalledWith('Accept', 'application/json');
  (xhrMock.onreadystatechange as EventListener)(new Event(''));
}
