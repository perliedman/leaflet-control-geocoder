export default {
  input: 'src/index.js',
  external: ['leaflet'],
  output: {
    file: 'dist/Control.Geocoder.js',
    format: 'iife',
    name: 'L.Control.Geocoder',
    sourcemap: true,
    globals: {
      leaflet: 'L'
    }
  }
};
