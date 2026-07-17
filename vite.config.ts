import { defineConfig } from 'vite-plus';

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
  },
  staged: {
    '*': 'vp check --fix'
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: false }
  },
  fmt: {
    arrowParens: 'avoid',
    printWidth: 100,
    singleQuote: true,
    trailingComma: 'none',
    sortPackageJson: false,
    ignorePatterns: []
  }
});
