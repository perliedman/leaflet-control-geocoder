import L from 'leaflet';
import { Geocoder, geocoder } from './control';
import * as geocoders from './geocoders/index';

L.Util.extend(Geocoder, geocoders);
export default Geocoder;

L.Util.extend(L.Control, {
  Geocoder: Geocoder,
  geocoder: geocoder
});
