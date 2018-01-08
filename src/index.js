import L from 'leaflet';
import Control from './control';
import Nominatim from './geocoders/nominatim';
import Bing from './geocoders/bing';
import MapQuest from './geocoders/mapquest';
import Mapbox from './geocoders/mapbox';
import What3Words from './geocoders/what3words';
import Google from './geocoders/google';
import Photon from './geocoders/photon';
import Mapzen from './geocoders/mapzen';
import ArcGis from './geocoders/arcgis';
import HERE from './geocoders/here';

var Geocoder = L.Util.extend(Control.class, {
  Nominatim: Nominatim.class,
  nominatim: Nominatim.factory,
  Bing: Bing.class,
  bing: Bing.factory,
  MapQuest: MapQuest.class,
  mapQuest: MapQuest.factory,
  Mapbox: Mapbox.class,
  mapbox: Mapbox.factory,
  What3Words: What3Words.class,
  what3words: What3Words.factory,
  Google: Google.class,
  google: Google.factory,
  Photon: Photon.class,
  photon: Photon.factory,
  Mapzen: Mapzen.class,
  mapzen: Mapzen.factory,
  ArcGis: ArcGis.class,
  arcgis: ArcGis.factory,
  HERE: HERE.class,
  here: HERE.factory
});

export default Geocoder;

L.Util.extend(L.Control, {
  Geocoder: Geocoder,
  geocoder: Control.factory
});
