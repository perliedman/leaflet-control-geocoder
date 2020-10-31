import * as L from 'leaflet';
import { GeocoderControl as Geocoder, geocoder } from './control';
import * as geocoders from './geocoders/index';

L.Util.extend(Geocoder, geocoders);
export default Geocoder;

L.Util.extend(L.Control, {
  Geocoder: Geocoder,
  geocoder: geocoder
});
