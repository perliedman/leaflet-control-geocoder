import * as L from 'leaflet';
import { Nominatim } from './geocoders/index';
import {
  IGeocoder,
  GeocodingResult,
  GeocodingContext,
  SuggestUnsupportedError
} from './geocoders/api';

export interface GeocoderControlOptions extends L.ControlOptions {
  /**
   * The position of the control (one of the map corners)
   */
  position: NonNullable<L.ControlOptions['position']>;
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

/**
 * Event is fired when {@link IGeocoder.geocode} (or {@link IGeocoder.suggest}) fails,
 * e.g. due to a network error or an HTTP error status (`HttpError`).
 * The event data contains the query string as `input` and the `error`.
 */
export type ErrorGeocodeEvent = { input: string; error: unknown };
export type ErrorGeocodeEventHandlerFn = (event: ErrorGeocodeEvent) => void;

declare module 'leaflet' {
  interface Evented {
    on(type: 'markgeocode', fn: MarkGeocodeEventHandlerFn, context?: any): this;
    on(type: 'startgeocode', fn: StartGeocodeEventHandlerFn, context?: any): this;
    on(type: 'startsuggest', fn: StartGeocodeEventHandlerFn, context?: any): this;
    on(type: 'finishsuggest', fn: FinishGeocodeEventHandlerFn, context?: any): this;
    on(type: 'finishgeocode', fn: FinishGeocodeEventHandlerFn, context?: any): this;
    on(type: 'errorsuggest', fn: ErrorGeocodeEventHandlerFn, context?: any): this;
    on(type: 'errorgeocode', fn: ErrorGeocodeEventHandlerFn, context?: any): this;
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
interface EventedControl extends L.Control, Omit<L.Evented, 'options'> {}

Object.getOwnPropertyNames(L.Control.prototype).forEach(
  k => (EventedControl.prototype[k] = L.Control.prototype[k])
);
Object.getOwnPropertyNames(L.Evented.prototype).forEach(
  k => (EventedControl.prototype[k] = L.Evented.prototype[k])
);

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
  /** @internal */
  declare _container: HTMLDivElement;
  private _errorElement: HTMLDivElement;
  private _geocodeMarker: L.Marker;
  private _input: HTMLInputElement;
  private _lastGeocode: string;
  /** @internal */
  declare _map: L.Map;
  private _abortController?: AbortController;
  private _results: any;
  private _selection: any;
  private _suggestTimeout: any;
  private _suggestUnsupported = false;

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
    this._container.classList.add('leaflet-control-geocoder-throbber');
  }

  removeThrobberClass() {
    this._container.classList.remove('leaflet-control-geocoder-throbber');
  }

  /**
   * Returns the container DOM element for the control and add listeners on relevant map events.
   * @param map the map instance
   * @see https://leafletjs.com/reference.html#control-onadd
   */
  onAdd(map: L.Map) {
    const className = 'leaflet-control-geocoder';
    const container = L.DomUtil.create('div', className + ' leaflet-bar');
    const icon = L.DomUtil.create('button', className + '-icon', container);
    const form = L.DomUtil.create('div', className + '-form', container);

    this._map = map;
    this._container = container;

    icon.innerHTML = '&nbsp;';
    icon.type = 'button';
    icon.setAttribute('aria-label', this.options.iconLabel);

    const input = (this._input = L.DomUtil.create('input', '', form));
    input.type = 'search';
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

    L.DomEvent.on(input, 'keydown', this._keydown, this);
    if (this.options.geocoder?.suggest) {
      L.DomEvent.on(input, 'input', this._change, this);
    }
    input.addEventListener('blur', () => {
      if (this.options.collapsed) {
        this._collapse();
      }
    });

    // keep the focus in the input when pressing the icon or a result
    icon.addEventListener('mousedown', e => e.preventDefault());
    this._alts.addEventListener('mousedown', e => e.preventDefault());

    if (this.options.collapsed) {
      if (this.options.expand === 'touch') {
        // toggle on press, without waiting for the click
        icon.addEventListener('pointerdown', e => {
          if (e.button === 0) {
            this._toggle();
          }
        });
      } else if (this.options.expand === 'hover') {
        container.addEventListener('pointerenter', () => this._expand());
        container.addEventListener('pointerleave', e => {
          if (e.pointerType === 'mouse') {
            this._collapse();
          }
        });
        this._map.on('movestart', this._collapse, this);
      }
      icon.addEventListener('click', e => {
        // keyboard activation (detail 0) works in every mode
        if (e.detail === 0 || (this.options.expand === 'click' && e.detail === 1)) {
          this._toggle();
        }
      });
    } else {
      this._expand();
      icon.addEventListener('click', () => this._geocode());
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
   * Aborts a pending request when the control is removed from the map
   * @see https://leafletjs.com/reference.html#control-onremove
   */
  onRemove(_map: L.Map) {
    clearTimeout(this._suggestTimeout);
    this._abortController?.abort();
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
      this._alts.classList.remove('leaflet-control-geocoder-alternatives-minimized');
      this._container.classList.add('leaflet-control-geocoder-options-open');
      this._results.forEach((result, i) => this._alts.appendChild(this._createAlt(result, i)));
    } else {
      this._container.classList.add('leaflet-control-geocoder-options-error');
      this._errorElement.classList.add('leaflet-control-geocoder-error');
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

  private async _geocode(suggest: boolean = false) {
    const value = this._input.value;
    if (!suggest && value.length < this.options.queryMinLength) {
      return;
    }

    // abort the previous, now superseded request
    this._abortController?.abort();
    const abortController = (this._abortController = new AbortController());
    const { signal } = abortController;

    this._lastGeocode = value;
    if (!suggest) {
      this._clearResults();
    }

    const event: StartGeocodeEvent = { input: value };
    this.fire(suggest ? 'startsuggest' : 'startgeocode', event);

    const context: GeocodingContext = { map: this._map, signal };
    let results: GeocodingResult[];
    try {
      results = suggest
        ? await this.options.geocoder!.suggest!(value, context)
        : await this.options.geocoder!.geocode(value, context);
    } catch (error) {
      if (signal.aborted) {
        return; // superseded by a newer request
      }
      this.removeThrobberClass();
      if (error instanceof SuggestUnsupportedError) {
        // the geocoder's service forbids auto-complete — stop asking
        this._suggestUnsupported = true;
        L.DomEvent.off(this._input, 'input', this._change, this);
        return;
      }
      const event: ErrorGeocodeEvent = { input: value, error };
      this.fire(suggest ? 'errorsuggest' : 'errorgeocode', event);
      if (!suggest) {
        this._geocodeResult([], suggest);
      }
      return;
    } finally {
      if (this._abortController === abortController) {
        this._abortController = undefined;
      }
    }

    if (!signal.aborted) {
      const event: FinishGeocodeEvent = { input: value, results };
      this.fire(suggest ? 'finishsuggest' : 'finishgeocode', event);
      this._geocodeResult(results, suggest);
    }
  }

  private _geocodeResultSelected(geocode: GeocodingResult) {
    const event: MarkGeocodeEvent = { geocode };
    this.fire('markgeocode', event);
  }

  private _toggle() {
    if (this._container.classList.contains('leaflet-control-geocoder-expanded')) {
      this._collapse();
    } else {
      this._expand();
    }
  }

  private _expand() {
    this._container.classList.add('leaflet-control-geocoder-expanded');
    this._input.select();
    this.fire('expand');
  }

  private _collapse() {
    this._container.classList.remove('leaflet-control-geocoder-expanded');
    this._alts.classList.add('leaflet-control-geocoder-alternatives-minimized');
    this._errorElement.classList.remove('leaflet-control-geocoder-error');
    this._container.classList.remove('leaflet-control-geocoder-options-open');
    this._container.classList.remove('leaflet-control-geocoder-options-error');
    this._input.blur(); // mobile: keyboard shouldn't stay expanded
    this.fire('collapse');
  }

  private _clearResults() {
    this._alts.classList.add('leaflet-control-geocoder-alternatives-minimized');
    this._selection = null;
    this._errorElement.classList.remove('leaflet-control-geocoder-error');
    this._container.classList.remove('leaflet-control-geocoder-options-open');
    this._container.classList.remove('leaflet-control-geocoder-options-error');
  }

  private _createAlt(result: GeocodingResult, index: number) {
    const li = L.DomUtil.create('li', ''),
      a = L.DomUtil.create('a', '', li),
      icon = this.options.showResultIcons && result.icon ? L.DomUtil.create('img', '', a) : null,
      text = result.html ? undefined : document.createTextNode(result.name);

    if (icon) {
      icon.src = result.icon!;
    }

    li.setAttribute('data-result-index', String(index));

    if (result.html) {
      a.innerHTML = a.innerHTML + result.html;
    } else if (text) {
      a.appendChild(text);
    }

    // select on click: the mousedown is prevented, so the input keeps the focus (see onAdd)
    li.addEventListener('click', () => {
      this._geocodeResultSelected(result);
      if (this.options.collapsed) {
        this._collapse();
      } else {
        this._clearResults();
      }
    });

    return li;
  }

  private _keydown(e: KeyboardEvent) {
    const select = (dir: number) => {
      if (this._selection) {
        this._selection.classList.remove('leaflet-control-geocoder-selected');
        this._selection = this._selection[dir > 0 ? 'nextSibling' : 'previousSibling'];
      }
      if (!this._selection) {
        this._selection = this._alts[dir > 0 ? 'firstChild' : 'lastChild'];
      }

      if (this._selection) {
        this._selection.classList.add('leaflet-control-geocoder-selected');
      }
    };

    switch (e.key) {
      case 'Escape':
        if (this.options.collapsed) {
          this._collapse();
        } else {
          this._clearResults();
        }
        break;
      case 'ArrowUp':
        select(-1);
        break;
      case 'ArrowDown':
        select(1);
        break;
      case 'Enter':
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
    if (this._suggestUnsupported) {
      return;
    }
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
