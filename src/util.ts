import * as L from 'leaflet';
/**
 * @internal
 */
let lastCallbackId = 0;

// Adapted from handlebars.js
// https://github.com/wycats/handlebars.js/
/**
 * @internal
 */
const badChars = /[&<>"'`]/g;
/**
 * @internal
 */
const possible = /[&<>"'`]/;
/**
 * @internal
 */
const escape: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
};

/**
 * @internal
 */
function escapeChar(chr: string) {
  return escape[chr];
}

/**
 * @internal
 */
export function htmlEscape(string?: string): string {
  if (string == null) {
    return '';
  } else if (!string) {
    return string + '';
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = '' + string;

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

/**
 * @internal
 */
export function jsonp(
  url: string,
  params: Record<string, any>,
  callback: (message: any) => void,
  context: any,
  jsonpParam?: string
) {
  const callbackId = '_l_geocoder_' + lastCallbackId++;
  params[jsonpParam || 'callback'] = callbackId;
  (window as any)[callbackId] = L.Util.bind(callback, context);
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url + getParamString(params);
  script.id = callbackId;
  document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * @internal
 */
export function getJSON(
  url: string,
  params: Record<string, unknown>,
  callback: (message: any) => void
): void {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState !== 4) {
      return;
    }
    let message;
    if (xmlHttp.status !== 200 && xmlHttp.status !== 304) {
      message = '';
    } else if (typeof xmlHttp.response === 'string') {
      // IE doesn't parse JSON responses even with responseType: 'json'.
      try {
        message = JSON.parse(xmlHttp.response);
      } catch (e) {
        // Not a JSON response
        message = xmlHttp.response;
      }
    } else {
      message = xmlHttp.response;
    }
    callback(message);
  };
  xmlHttp.open('GET', url + getParamString(params), true);
  xmlHttp.responseType = 'json';
  xmlHttp.setRequestHeader('Accept', 'application/json');
  xmlHttp.send(null);
}

/**
 * @internal
 */
export function template(str: string, data: Record<string, any>): string {
  return str.replace(/\{ *([\w_]+) *\}/g, (str, key) => {
    let value = data[key];
    if (value === undefined) {
      value = '';
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return htmlEscape(value);
  });
}

/**
 * @internal
 */
export function getParamString(
  obj: Record<string, unknown | unknown[]>,
  existingUrl?: string,
  uppercase?: boolean
): string {
  const params = [];
  for (const i in obj) {
    const key = encodeURIComponent(uppercase ? i.toUpperCase() : i);
    const value = obj[i];
    if (!Array.isArray(value)) {
      params.push(key + '=' + encodeURIComponent(String(value)));
    } else {
      for (let j = 0; j < value.length; j++) {
        params.push(key + '=' + encodeURIComponent(value[j]));
      }
    }
  }
  return (!existingUrl || existingUrl.indexOf('?') === -1 ? '?' : '&') + params.join('&');
}
