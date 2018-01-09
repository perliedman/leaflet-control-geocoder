import L from 'leaflet';
var lastCallbackId = 0;

// Adapted from handlebars.js
// https://github.com/wycats/handlebars.js/
var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
};

function escapeChar(chr) {
  return escape[chr];
}

export function htmlEscape(string) {
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

export function jsonp(url, params, callback, context, jsonpParam) {
  var callbackId = '_l_geocoder_' + lastCallbackId++;
  params[jsonpParam || 'callback'] = callbackId;
  window[callbackId] = L.Util.bind(callback, context);
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url + L.Util.getParamString(params);
  script.id = callbackId;
  document.getElementsByTagName('head')[0].appendChild(script);
}

export function getJSON(url, params, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState !== 4) {
      return;
    }
    if (xmlHttp.status !== 200 && xmlHttp.status !== 304) {
      callback('');
      return;
    }
    callback(JSON.parse(xmlHttp.response));
  };
  xmlHttp.open('GET', url + L.Util.getParamString(params), true);
  xmlHttp.setRequestHeader('Accept', 'application/json');
  xmlHttp.send(null);
}

export function template(str, data) {
  return str.replace(/\{ *([\w_]+) *\}/g, function(str, key) {
    var value = data[key];
    if (value === undefined) {
      value = '';
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return htmlEscape(value);
  });
}
