cd ..
mkdir dist

call browserify src\index.js -t es3ify -t browserify-shim -o dist\Control.Geocoder.js
copy Control.Geocoder.css images\ 
copy Control.Geocoder.css dist\
