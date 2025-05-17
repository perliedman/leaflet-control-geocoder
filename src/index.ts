/* @preserve
 * Leaflet Control Geocoder
 * https://github.com/perliedman/leaflet-control-geocoder
 *
 * Copyright (c) 2012 sa3m (https://github.com/sa3m)
 * Copyright (c) 2018 Per Liedman
 * All rights reserved.
 */
import * as L from 'leaflet';
import { GeocoderControl as Geocoder, geocoder } from './control';
import * as geocoders from './geocoders/index';
import './style.css';

Object.assign(Geocoder, geocoders);
export default Geocoder;
export { Geocoder, geocoder, geocoders };

Object.assign(L.Control, {
  Geocoder: Geocoder,
  geocoder: geocoder
});
