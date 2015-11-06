#!/bin/sh

mkdir -p dist

browserify src/index.js -t es3ify -t browserify-shim -o dist/Control.Geocoder.js
cp -a Control.Geocoder.css images/ dist/
