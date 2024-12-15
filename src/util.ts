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
export function getJSON<T>(url: string, params: Record<string, unknown>): Promise<T> {
  const headers = { Accept: 'application/json' };
  const request = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    (Array.isArray(value) ? value : [value]).forEach(v => {
      request.searchParams.append(key, v);
    });
  });
  return fetch(request.toString(), { headers }).then(response => response.json());
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
