import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vite.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'leaflet-control-geocoder',
      formats: ['es', 'umd'],
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
  },
  plugins: [dts()]
});
