/* eslint-env node */
module.exports = function(config) {
  config.set({
    plugins: ['karma-mocha', 'karma-sinon', 'karma-expect', 'karma-phantomjs-launcher'],
    frameworks: ['mocha', 'sinon', 'expect'],
    files: [
      '../node_modules/leaflet/dist/leaflet-src.js',
      '../dist/Control.Geocoder.js',
      { pattern: '**/*.spec.js' }
    ],
    browsers: ['PhantomJS']
  });
};
