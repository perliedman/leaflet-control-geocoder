import { HttpError } from './geocoders/api';

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
export async function getJSON<T>(
  url: string,
  params: Record<string, unknown>,
  signal?: AbortSignal
): Promise<T> {
  const headers = { Accept: 'application/json' };
  const request = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    (Array.isArray(value) ? value : [value]).forEach(v => {
      if (v !== undefined && v !== null) {
        request.searchParams.append(key, String(v));
      }
    });
  });
  const response = await fetch(request.toString(), signal ? { headers, signal } : { headers });
  if (!response.ok) {
    throw new HttpError(response);
  }
  return response.json();
}

/**
 * Sets the HTML content of an element, sanitized by the Sanitizer API's `setHTML()` where
 * supported (removes scripts, event handlers and other XSS-unsafe markup), via `innerHTML` otherwise
 * @internal
 */
export function setSafeHTML(element: Element, html: string): void {
  if ('setHTML' in element) {
    (element as Element & { setHTML(html: string): void }).setHTML(html);
  } else {
    (element as Element).innerHTML = html;
  }
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
