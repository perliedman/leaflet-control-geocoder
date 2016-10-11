#!/bin/sh

mkdir -p dist

browserify src/index.js -t browserify-shim -t es3ify --standalone leaflet-control-geocoder | derequire >dist/Control.Geocoder.js
cp -a Control.Geocoder.css images/ dist/

browserify test/browserify.js -o test/bundle.js
