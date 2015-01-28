(function() {
    'use strict';

    var L = require('leaflet');
    var Autocomplete = require('./autocomplete');

    L.Control.Geocoder = L.Control.extend({
        options: {
            showResultIcons: false,
            collapsed: true,
            expand: 'click',
            position: 'topright',
            placeholder: 'Search...',
            errorMessage: 'Nothing found.'
        },

        initialize: function (options) {
            L.Util.setOptions(this, options);
            if (!this.options.geocoder) {
                this.options.geocoder = new L.Control.Geocoder.Nominatim();
            }
        },

        onAdd: function (map) {
            var className = 'leaflet-control-geocoder',
                container = L.DomUtil.create('div', 'leaflet-bar leaflet-control ' + className),
                icon = L.DomUtil.create('a', 'leaflet-control-geocoder-icon', container),
                input;

            this._map = map;
            this._container = container;
            icon.href = '#';
            input = this._input = L.DomUtil.create('input');
            input.type = 'text';
            input.placeholder = this.options.placeholder;
            new Autocomplete(input, this._geocodeResultSelected, this, {
                resultFn: this.options.geocoder.geocode,
                resultContext: this.options.geocoder,
                autocompleteFn: this.options.geocoder.suggest,
                autocompleteContext: this.options.geocoder
            });

            container.appendChild(input);

            if (this.options.collapsed) {
                if (this.options.expand === 'click') {
                    L.DomEvent.addListener(icon, 'click', function(e) {
                        // TODO: touch
                        if (e.button === 0 && e.detail !== 2) {
                            this._toggle();
                        }
                    }, this);
                } else {
                    L.DomEvent.addListener(icon, 'mouseover', this._expand, this);
                    L.DomEvent.addListener(icon, 'mouseout', this._collapse, this);
                    this._map.on('movestart', this._collapse, this);
                }
            } else {
                this._expand();
            }

            L.DomEvent.disableClickPropagation(container);

            return container;
        },

        markGeocode: function(result) {
            this._map.fitBounds(result.bbox);

            if (this._geocodeMarker) {
                this._map.removeLayer(this._geocodeMarker);
            }

            this._geocodeMarker = new L.Marker(result.center)
                .bindPopup(result.html || result.name)
                .addTo(this._map)
                .openPopup();

            return this;
        },

        _geocodeResultSelected: function(result) {
            if (this.options.collapsed) {
                this._collapse();
            } else {
                this._clearResults();
            }
            this.markGeocode(result);
        },

        _toggle: function() {
            if (L.DomUtil.hasClass(this._container, 'leaflet-control-geocoder-expanded')) {
                this._collapse();
            } else {
                this._expand();
            }
        },

        _expand: function () {
            L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-expanded');
            this._input.select();
        },

        _collapse: function () {
            this._container.className = this._container.className.replace('leaflet-control-geocoder-expanded', '');
        }
    });

    L.control.geocoder = function(options) {
        return new L.Control.Geocoder(options);
    };

    require('./providers/nominatim');
    require('./providers/google');
    require('./providers/bing');
    require('./providers/mapquest');

    module.exports = L.Control.Geocoder;
})();
