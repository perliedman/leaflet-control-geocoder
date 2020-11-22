export function mockXMLHttpRequest<T>(response: T): XMLHttpRequest {
  const xhrMock: Partial<XMLHttpRequest> = {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    readyState: 4,
    status: 200,
    response
  };
  jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock as XMLHttpRequest);
  return xhrMock as XMLHttpRequest;
}

export function testXMLHttpRequest<T>(url: string, response: T, trigger: () => void) {
  const xhrMock = mockXMLHttpRequest(response);
  trigger();
  expect(xhrMock.open).toBeCalledWith('GET', url, true);
  expect(xhrMock.setRequestHeader).toBeCalledWith('Accept', 'application/json');
  (xhrMock.onreadystatechange as EventListener)(new Event(''));
}
