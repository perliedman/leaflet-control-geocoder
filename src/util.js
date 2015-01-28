(function() {
    'use strict';

    var L = require('leaflet');
    require('./control');

    L.Control.Geocoder._callbackId = 0;
    L.Control.Geocoder._jsonp = function(url, params, callback, context, jsonpParam) {
        var callbackId = '_l_geocoder_' + (L.Control.Geocoder._callbackId++);
        params[jsonpParam || 'callback'] = callbackId;
        window[callbackId] = L.Util.bind(callback, context);
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url + L.Util.getParamString(params);
        script.id = callbackId;
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    L.Control.Geocoder.template = function (str, data, htmlEscape) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            var value = data[key];
            if (value === undefined) {
                value = '';
            } else if (typeof value === 'function') {
                value = value(data);
            }
            return L.Control.Geocoder.htmlEscape(value);
        });
    };

    // Adapted from handlebars.js
    // https://github.com/wycats/handlebars.js/
    L.Control.Geocoder.htmlEscape = (function() {
        var badChars = /[&<>"'`]/g;
        var possible = /[&<>"'`]/;
        var escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#x27;',
            '`': '&#x60;'
        };

        function escapeChar(chr) {
            return escape[chr];
        }

        return function(string) {
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
        };
    })();

    module.exports = L.Control.Geocoder;
})();
