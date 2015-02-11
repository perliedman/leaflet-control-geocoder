(function() {
    'use strict';

    var L = require('leaflet'),
        corslite = require('corslite');
    require('./control');

    L.Control.Geocoder._callbackId = 0;
    L.Control.Geocoder._getJSON = function(url, params, callback, context) {
        corslite(url + L.Util.getParamString(params), function(err, resp) {
            if (!err) {
                callback.call(context, undefined, JSON.parse(resp.responseText));
            } else {
                callback.call(context, {
                    status: -1,
                    message: 'HTTP request failed (' + resp.responseText + ')',
                    context: resp
                });
            }
        });
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
