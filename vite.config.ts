import { defineConfig } from 'vite';

// https://vite.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'leaflet-control-geocoder',
      formats: ['es', 'umd'],
      cssFileName: 'Control.Geocoder',
      fileName: format =>
        ({
          es: `Control.Geocoder.modern.js`,
          umd: `Control.Geocoder.js`
        })[format]
    },
    sourcemap: true,
    rollupOptions: {
      external: ['leaflet'],
      output: {
        globals: {
          leaflet: 'L'
        }
      }
    }
  }
});
