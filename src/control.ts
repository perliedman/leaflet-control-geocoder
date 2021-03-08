import * as L from 'leaflet';
import { Nominatim } from './geocoders/index';
import { IGeocoder, GeocodingResult } from './geocoders/api';

export interface GeocoderControlOptions extends L.ControlOptions {
  /**
   * Collapse control unless hovered/clicked
   */
  collapsed: boolean;
  /**
   * How to expand a collapsed control: `touch` or `click` or `hover`
   */
  expand: 'touch' | 'click' | 'hover';
  /**
   * Placeholder text for text input
   */
  placeholder: string;
  /**
   * Message when no result found / geocoding error occurs
   */
  errorMessage: string;
  /**
   * Accessibility label for the search icon used by screen readers
   */
  iconLabel: string;
  /**
   * Object to perform the actual geocoding queries
   */
  geocoder?: IGeocoder;
  /**
   * Immediately show the unique result without prompting for alternatives
   */
  showUniqueResult: boolean;
  /**
   * Show icons for geocoding results (if available); supported by Nominatim
   */
  showResultIcons: boolean;
  /**
   * Minimum number characters before suggest functionality is used (if available from geocoder)
   */
  suggestMinLength: number;
  /**
   * Number of milliseconds after typing stopped before suggest functionality is used (if available from geocoder)
   */
  suggestTimeout: number;
  /**
   * Initial query string for text input
   */
  query: string;
  /**
   * Minimum number of characters in search text before performing a query
   */
  queryMinLength: number;
  /**
   * Whether to mark a geocoding result on the map by default
   */
  defaultMarkGeocode: boolean;
}

/**
 * Event is fired when selecting a geocode result.
 * By default, the control will center the map on it and place a marker at its location.
 * To remove the control's default handler for marking a result, set {@link GeocoderControlOptions.defaultMarkGeocode} to `false`.
 */
export type MarkGeocodeEvent = { geocode: GeocodingResult };
export type MarkGeocodeEventHandlerFn = (event: MarkGeocodeEvent) => void;

/**
 * Event is fired before invoking {@link IGeocoder.geocode} (or {@link IGeocoder.suggest}).
 * The event data contains the query string as `input`.
 */
export type StartGeocodeEvent = { input: string };
export type StartGeocodeEventHandlerFn = (event: StartGeocodeEvent) => void;

/**
 * Event is fired before after receiving results from {@link IGeocoder.geocode} (or {@link IGeocoder.suggest}).
 * The event data contains the query string as `input` and the geocoding `results`.
 */
export type FinishGeocodeEvent = { input: string; results: GeocodingResult[] };
export type FinishGeocodeEventHandlerFn = (event: FinishGeocodeEvent) => void;

declare module 'leaflet' {
  interface Evented {
    on(type: 'markgeocode', fn: MarkGeocodeEventHandlerFn, context?: any): this;
    on(type: 'startgeocode', fn: StartGeocodeEventHandlerFn, context?: any): this;
    on(type: 'startsuggest', fn: StartGeocodeEventHandlerFn, context?: any): this;
    on(type: 'finishsuggest', fn: FinishGeocodeEventHandlerFn, context?: any): this;
    on(type: 'finishgeocode', fn: FinishGeocodeEventHandlerFn, context?: any): this;
  }
}

/**
 * Leaflet mixins https://leafletjs.com/reference-1.7.1.html#class-includes
 * for TypeScript https://www.typescriptlang.org/docs/handbook/mixins.html
 * @internal
 */
class EventedControl {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(...args: any[]) {
    // empty
  }
}

/**
 * @internal
 */
interface EventedControl extends L.Control, L.Evented {}
L.Util.extend(EventedControl.prototype, L.Control.prototype);
L.Util.extend(EventedControl.prototype, L.Evented.prototype);

/**
 * This is the geocoder control. It works like any other [Leaflet control](https://leafletjs.com/reference.html#control), and is added to the map.
 */
export class GeocoderControl extends EventedControl {
  options: GeocoderControlOptions = {
    showUniqueResult: true,
    showResultIcons: false,
    collapsed: true,
    expand: 'touch',
    position: 'topright',
    placeholder: 'Search...',
    errorMessage: 'Nothing found.',
    iconLabel: 'Initiate a new search',
    query: '',
    queryMinLength: 1,
    suggestMinLength: 3,
    suggestTimeout: 250,
    defaultMarkGeocode: true
  };

  private _alts: HTMLUListElement;
  private _container: HTMLDivElement;
  private _errorElement: HTMLDivElement;
  private _form: HTMLDivElement;
  private _geocodeMarker: L.Marker;
  private _input: HTMLInputElement;
  private _lastGeocode: string;
  private _map: L.Map;
  private _preventBlurCollapse: boolean;
  private _requestCount = 0;
  private _results: any;
  private _selection: any;
  private _suggestTimeout: any;

  /**
   * Instantiates a geocoder control (to be invoked using `new`)
   * @param options the options
   */
  constructor(options?: Partial<GeocoderControlOptions>) {
    super(options);
    L.Util.setOptions(this, options);
    if (!this.options.geocoder) {
      this.options.geocoder = new Nominatim();
    }
  }

  addThrobberClass() {
    L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-throbber');
  }

  removeThrobberClass() {
    L.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-throbber');
  }

  /**
   * Returns the container DOM element for the control and add listeners on relevant map events.
   * @param map the map instance
   * @see https://leafletjs.com/reference.html#control-onadd
   */
  onAdd(map: L.Map) {
    const className = 'leaflet-control-geocoder';
    const container = L.DomUtil.create('div', className + ' leaflet-bar') as HTMLDivElement;
    const icon = L.DomUtil.create('button', className + '-icon', container) as HTMLButtonElement;
    const form = (this._form = L.DomUtil.create(
      'div',
      className + '-form',
      container
    ) as HTMLDivElement);

    this._map = map;
    this._container = container;

    icon.innerHTML = '&nbsp;';
    icon.type = 'button';
    icon.setAttribute('aria-label', this.options.iconLabel);

    const input = (this._input = L.DomUtil.create('input', '', form) as HTMLInputElement);
    input.type = 'text';
    input.value = this.options.query;
    input.placeholder = this.options.placeholder;
    L.DomEvent.disableClickPropagation(input);

    this._errorElement = L.DomUtil.create(
      'div',
      className + '-form-no-error',
      container
    ) as HTMLDivElement;
    this._errorElement.innerHTML = this.options.errorMessage;

    this._alts = L.DomUtil.create(
      'ul',
      className + '-alternatives leaflet-control-geocoder-alternatives-minimized',
      container
    ) as HTMLUListElement;
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
  }

  /**
   * Sets the query string on the text input
   * @param string the query string
   */
  setQuery(string: string): this {
    this._input.value = string;
    return this;
  }

  private _geocodeResult(results: GeocodingResult[], suggest: boolean) {
    if (!suggest && this.options.showUniqueResult && results.length === 1) {
      this._geocodeResultSelected(results[0]);
    } else if (results.length > 0) {
      this._alts.innerHTML = '';
      this._results = results;
      L.DomUtil.removeClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
      L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-options-open');
      for (let i = 0; i < results.length; i++) {
        this._alts.appendChild(this._createAlt(results[i], i));
      }
    } else {
      L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-options-error');
      L.DomUtil.addClass(this._errorElement, 'leaflet-control-geocoder-error');
    }
  }

  /**
   * Marks a geocoding result on the map
   * @param result the geocoding result
   */
  markGeocode(event: MarkGeocodeEvent) {
    const result = event.geocode;

    this._map.fitBounds(result.bbox);

    if (this._geocodeMarker) {
      this._map.removeLayer(this._geocodeMarker);
    }

    this._geocodeMarker = new L.Marker(result.center)
      .bindPopup(result.html || result.name)
      .addTo(this._map)
      .openPopup();

    return this;
  }

  private _geocode(suggest?: boolean) {
    const value = this._input.value;
    if (!suggest && value.length < this.options.queryMinLength) {
      return;
    }

    const requestCount = ++this._requestCount;
    const cb = (results: GeocodingResult[]) => {
      if (requestCount === this._requestCount) {
        const event: FinishGeocodeEvent = { input: value, results };
        this.fire(suggest ? 'finishsuggest' : 'finishgeocode', event);
        this._geocodeResult(results, suggest);
      }
    };

    this._lastGeocode = value;
    if (!suggest) {
      this._clearResults();
    }

    const event: StartGeocodeEvent = { input: value };
    this.fire(suggest ? 'startsuggest' : 'startgeocode', event);
    if (suggest) {
      this.options.geocoder.suggest(value, cb);
    } else {
      this.options.geocoder.geocode(value, cb);
    }
  }

  private _geocodeResultSelected(geocode: GeocodingResult) {
    const event: MarkGeocodeEvent = { geocode };
    this.fire('markgeocode', event);
  }

  private _toggle() {
    if (L.DomUtil.hasClass(this._container, 'leaflet-control-geocoder-expanded')) {
      this._collapse();
    } else {
      this._expand();
    }
  }

  private _expand() {
    L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-expanded');
    this._input.select();
    this.fire('expand');
  }

  private _collapse() {
    L.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-expanded');
    L.DomUtil.addClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
    L.DomUtil.removeClass(this._errorElement, 'leaflet-control-geocoder-error');
    L.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-open');
    L.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-error');
    this._input.blur(); // mobile: keyboard shouldn't stay expanded
    this.fire('collapse');
  }

  private _clearResults() {
    L.DomUtil.addClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
    this._selection = null;
    L.DomUtil.removeClass(this._errorElement, 'leaflet-control-geocoder-error');
    L.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-open');
    L.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-error');
  }

  private _createAlt(result: GeocodingResult, index: number) {
    const li = L.DomUtil.create('li', ''),
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

    li.setAttribute('data-result-index', String(index));

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
  }

  private _keydown(e: KeyboardEvent) {
    const select = (dir: number) => {
      if (this._selection) {
        L.DomUtil.removeClass(this._selection, 'leaflet-control-geocoder-selected');
        this._selection = this._selection[dir > 0 ? 'nextSibling' : 'previousSibling'];
      }
      if (!this._selection) {
        this._selection = this._alts[dir > 0 ? 'firstChild' : 'lastChild'];
      }

      if (this._selection) {
        L.DomUtil.addClass(this._selection, 'leaflet-control-geocoder-selected');
      }
    };

    switch (e.keyCode) {
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
          const index = parseInt(this._selection.getAttribute('data-result-index'), 10);
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
  }

  private _change() {
    const v = this._input.value;
    if (v !== this._lastGeocode) {
      clearTimeout(this._suggestTimeout);
      if (v.length >= this.options.suggestMinLength) {
        this._suggestTimeout = setTimeout(() => this._geocode(true), this.options.suggestTimeout);
      } else {
        this._clearResults();
      }
    }
  }
}

/**
 * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link GeocoderControl}
 * @param options the options
 */
export function geocoder(options?: Partial<GeocoderControlOptions>) {
  return new GeocoderControl(options);
}
