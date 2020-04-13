import * as L from 'leaflet';
import { Nominatim } from './geocoders/index';

export interface GeocoderOptions extends L.ControlOptions {
  collapsed: boolean;
  expand: string;
  placeholder: string;
  errorMessage: string;
  iconLabel: string;
  geocoder: any; // TODO
  showUniqueResult: boolean;
  showResultIcons: boolean;
  suggestMinLength: number;
  suggestTimeout: number;
  query: string;
  queryMinLength: number;
  defaultMarkGeocode: boolean;
}

export interface GeocoderControl {
  _map?: L.Map;
  _requestCount?: number;
  _container?: HTMLElement;
  _form?: HTMLElement;
  _input?: HTMLInputElement;
  _errorElement?: HTMLElement;
  _alts?: HTMLElement;
  _preventBlurCollapse?: boolean;
  _results?: any;
  _lastGeocode?: any;
  _selection?: any;
  _geocodeMarker?: L.Marker;
  _suggestTimeout?: number;

  options: GeocoderOptions;
  includes: L.Evented;
  initialize: (options: GeocoderOptions) => void;
  addThrobberClass: () => void;
  removeThrobberClass: () => void;
  onAdd: (map: L.Map) => HTMLElement;
  setQuery: (string: string) => GeocoderControl;
  _geocodeResult: (results: any, suggest?: boolean) => void;
  markGeocode: (result: any) => GeocoderControl;
  _geocode: (suggest?: boolean) => void;
  _geocodeResultSelected: (result: any) => void;
  _toggle: () => void;
  _expand: () => void;
  _collapse: () => void;
  _clearResults: () => void;
  _createAlt: (result: any, index: any) => HTMLElement;
  _keydown: (e: Event) => void;
  _change: () => void;
}

export const GeocoderControl = L.Control.extend<GeocoderControl>({
  options: {
    geocoder: undefined,
    showUniqueResult: true,
    showResultIcons: false,
    collapsed: true,
    expand: 'touch', // options: touch, click, anythingelse
    position: 'topright',
    placeholder: 'Search...',
    errorMessage: 'Nothing found.',
    iconLabel: 'Initiate a new search',
    query: '',
    queryMinLength: 1,
    suggestMinLength: 3,
    suggestTimeout: 250,
    defaultMarkGeocode: true
  } as GeocoderOptions,

  includes: L.Evented.prototype || (L as any).Mixin.Events,

  initialize: function(options: GeocoderOptions) {
    L.Util.setOptions(this, options);
    if (!this.options.geocoder) {
      this.options.geocoder = new Nominatim();
    }

    this._requestCount = 0;
  },

  addThrobberClass: function() {
    L.DomUtil.addClass(this._container!, 'leaflet-control-geocoder-throbber');
  },

  removeThrobberClass: function() {
    L.DomUtil.removeClass(this._container!, 'leaflet-control-geocoder-throbber');
  },

  onAdd: function(map: L.Map) {
    var className = 'leaflet-control-geocoder';
    var container = L.DomUtil.create('div', className + ' leaflet-bar');
    var icon = L.DomUtil.create('button', className + '-icon', container) as HTMLButtonElement;
    var form = (this._form = L.DomUtil.create('div', className + '-form', container));

    this._map = map;
    this._container = container;

    icon.innerHTML = '&nbsp;';
    icon.type = 'button';
    icon.setAttribute('aria-label', this.options.iconLabel);

    var input = (this._input = L.DomUtil.create('input', '', form) as HTMLInputElement);
    input.type = 'text';
    input.value = this.options.query;
    input.placeholder = this.options.placeholder;
    L.DomEvent.disableClickPropagation(input);

    this._errorElement = L.DomUtil.create('div', className + '-form-no-error', container);
    this._errorElement.innerHTML = this.options.errorMessage;

    this._alts = L.DomUtil.create(
      'ul',
      className + '-alternatives leaflet-control-geocoder-alternatives-minimized',
      container
    );
    L.DomEvent.disableClickPropagation(this._alts);

    L.DomEvent.addListener(input, 'keydown', this._keydown, this);
    if (this.options.geocoder.suggest) {
      L.DomEvent.addListener(input, 'input', this._change, this);
    }
    L.DomEvent.addListener(input, 'blur', () => {
      if (this.options.collapsed && !this._preventBlurCollapse) {
        this._collapse();
      }
      this._preventBlurCollapse = false;
    });

    if (this.options.collapsed) {
      if (this.options.expand === 'click') {
        L.DomEvent.addListener(container, 'click', (e: Event) => {
          if ((e as MouseEvent).button === 0 && (e as MouseEvent).detail !== 2) {
            this._toggle();
          }
        });
      } else if (this.options.expand === 'touch') {
        L.DomEvent.addListener(
          container,
          L.Browser.touch ? 'touchstart mousedown' : 'mousedown',
          (e: Event) => {
            this._toggle();
            e.preventDefault(); // mobile: clicking focuses the icon, so UI expands and immediately collapses
            e.stopPropagation();
          },
          this
        );
      } else {
        L.DomEvent.addListener(container, 'mouseover', this._expand, this);
        L.DomEvent.addListener(container, 'mouseout', this._collapse, this);
        this._map.on('movestart', this._collapse, this);
      }
    } else {
      this._expand();
      if (L.Browser.touch) {
        L.DomEvent.addListener(container, 'touchstart', () => this._geocode());
      } else {
        L.DomEvent.addListener(container, 'click', () => this._geocode());
      }
    }

    if (this.options.defaultMarkGeocode) {
      this.on('markgeocode', this.markGeocode, this);
    }

    this.on('startgeocode', this.addThrobberClass, this);
    this.on('finishgeocode', this.removeThrobberClass, this);
    this.on('startsuggest', this.addThrobberClass, this);
    this.on('finishsuggest', this.removeThrobberClass, this);

    L.DomEvent.disableClickPropagation(container);

    return container;
  },

  setQuery: function(string: string) {
    this._input!.value = string;
    return this;
  },

  _geocodeResult: function(results, suggest) {
    if (!suggest && this.options.showUniqueResult && results.length === 1) {
      this._geocodeResultSelected(results[0]);
    } else if (results.length > 0) {
      this._alts!.innerHTML = '';
      this._results = results;
      L.DomUtil.removeClass(this._alts!, 'leaflet-control-geocoder-alternatives-minimized');
      L.DomUtil.addClass(this._container!, 'leaflet-control-geocoder-options-open');
      for (var i = 0; i < results.length; i++) {
        this._alts!.appendChild(this._createAlt(results[i], i));
      }
    } else {
      L.DomUtil.addClass(this._container!, 'leaflet-control-geocoder-options-error');
      L.DomUtil.addClass(this._errorElement!, 'leaflet-control-geocoder-error');
    }
  },

  markGeocode: function(result) {
    result = result.geocode || result;

    this._map!.fitBounds(result.bbox);

    if (this._geocodeMarker) {
      this._map!.removeLayer(this._geocodeMarker);
    }

    this._geocodeMarker = new L.Marker(result.center)
      .bindPopup(result.html || result.name)
      .addTo(this._map!)
      .openPopup();

    return this;
  },

  _geocode: function(suggest) {
    var value = this._input!.value;
    if (!suggest && value.length < this.options.queryMinLength) {
      return;
    }

    var requestCount = ++this._requestCount!,
      mode = suggest ? 'suggest' : 'geocode',
      eventData = { input: value, results: undefined };

    this._lastGeocode = value;
    if (!suggest) {
      this._clearResults();
    }

    this.fire('start' + mode, eventData);
    this.options.geocoder[mode](value, (results: any) => {
      if (requestCount === this._requestCount) {
        eventData.results = results;
        this.fire('finish' + mode, eventData);
        this._geocodeResult(results, suggest);
      }
    });
  },

  _geocodeResultSelected: function(result) {
    this.fire('markgeocode', { geocode: result });
  },

  _toggle: function() {
    if (L.DomUtil.hasClass(this._container!, 'leaflet-control-geocoder-expanded')) {
      this._collapse();
    } else {
      this._expand();
    }
  },

  _expand: function() {
    L.DomUtil.addClass(this._container!, 'leaflet-control-geocoder-expanded');
    this._input!.select();
    this.fire('expand');
  },

  _collapse: function() {
    L.DomUtil.removeClass(this._container!, 'leaflet-control-geocoder-expanded');
    L.DomUtil.addClass(this._alts!, 'leaflet-control-geocoder-alternatives-minimized');
    L.DomUtil.removeClass(this._errorElement!, 'leaflet-control-geocoder-error');
    L.DomUtil.removeClass(this._container!, 'leaflet-control-geocoder-options-open');
    L.DomUtil.removeClass(this._container!, 'leaflet-control-geocoder-options-error');
    this._input!.blur(); // mobile: keyboard shouldn't stay expanded
    this.fire('collapse');
  },

  _clearResults: function() {
    L.DomUtil.addClass(this._alts!, 'leaflet-control-geocoder-alternatives-minimized');
    this._selection = null;
    L.DomUtil.removeClass(this._errorElement!, 'leaflet-control-geocoder-error');
    L.DomUtil.removeClass(this._container!, 'leaflet-control-geocoder-options-open');
    L.DomUtil.removeClass(this._container!, 'leaflet-control-geocoder-options-error');
  },

  _createAlt: function(result, index) {
    var li = L.DomUtil.create('li', ''),
      a = L.DomUtil.create('a', '', li),
      icon =
        this.options.showResultIcons && result.icon
          ? (L.DomUtil.create('img', '', a) as HTMLImageElement)
          : null,
      text = result.html ? undefined : document.createTextNode(result.name),
      mouseDownHandler = (e: Event) => {
        // In some browsers, a click will fire on the map if the control is
        // collapsed directly after mousedown. To work around this, we
        // wait until the click is completed, and _then_ collapse the
        // control. Messy, but this is the workaround I could come up with
        // for #142.
        this._preventBlurCollapse = true;
        L.DomEvent.stop(e);
        this._geocodeResultSelected(result);
        L.DomEvent.on(li, 'click touchend', () => {
          if (this.options.collapsed) {
            this._collapse();
          } else {
            this._clearResults();
          }
        });
      };

    if (icon) {
      icon.src = result.icon;
    }

    li.setAttribute('data-result-index', index);

    if (result.html) {
      a.innerHTML = a.innerHTML + result.html;
    } else if (text) {
      a.appendChild(text);
    }

    // Use mousedown and not click, since click will fire _after_ blur,
    // causing the control to have collapsed and removed the items
    // before the click can fire.
    L.DomEvent.addListener(li, 'mousedown touchstart', mouseDownHandler, this);

    return li;
  },

  _keydown: function(e) {
    var select = (dir: number) => {
      if (this._selection) {
        L.DomUtil.removeClass(this._selection, 'leaflet-control-geocoder-selected');
        this._selection = this._selection[dir > 0 ? 'nextSibling' : 'previousSibling'];
      }
      if (!this._selection) {
        this._selection = this._alts![dir > 0 ? 'firstChild' : 'lastChild'];
      }

      if (this._selection) {
        L.DomUtil.addClass(this._selection, 'leaflet-control-geocoder-selected');
      }
    };

    switch ((e as KeyboardEvent).keyCode) {
      // Escape
      case 27:
        if (this.options.collapsed) {
          this._collapse();
        } else {
          this._clearResults();
        }
        break;
      // Up
      case 38:
        select(-1);
        break;
      // Up
      case 40:
        select(1);
        break;
      // Enter
      case 13:
        if (this._selection) {
          var index = parseInt(this._selection.getAttribute('data-result-index'), 10);
          this._geocodeResultSelected(this._results[index]);
          this._clearResults();
        } else {
          this._geocode();
        }
        break;
      default:
        return;
    }

    L.DomEvent.preventDefault(e);
  },
  _change: function() {
    var v = this._input!.value;
    if (v !== this._lastGeocode) {
      clearTimeout(this._suggestTimeout);
      if (v.length >= this.options.suggestMinLength) {
        this._suggestTimeout = setTimeout(() => this._geocode(true), this.options.suggestTimeout);
      } else {
        this._clearResults();
      }
    }
  }
});

export function geocoder(options?: GeocoderOptions) {
  return new GeocoderControl(options);
}
