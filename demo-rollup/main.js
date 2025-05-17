import L from 'leaflet';
import 'leaflet-control-geocoder';

const map = new L.Map('map').setView([0, 0], 2);
new L.TileLayer('https://tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

new L.Control.Geocoder({
  geocoder: new L.Control.Geocoder.Nominatim()
}).addTo(map);
