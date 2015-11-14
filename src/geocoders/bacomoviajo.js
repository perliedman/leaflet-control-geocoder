var L = require('leaflet'),
	Util = require('../util'),
	proj4 = require('proj4');

module.exports = {
	class: L.Class.extend({
		options: {
			tmerc: new proj4.Proj("+proj=tmerc +lat_0=-34.629269 +lon_0=-58.463300 +k=0.999998 +x_0=100000 +y_0=100085 +ellps=intl +units=m +no_defs"),
			wsg: new proj4.Proj("EPSG:4326"),
			geocodeUrl: 'https://ws.usig.buenosaires.gob.ar/geocoder/2.2/geocoding/',
			reverseUrl: 'https://ws.usig.buenosaires.gob.ar/geocoder/2.2/reversegeocoding/',
			normalizarUrl: 'https://servicios.usig.buenosaires.gob.ar/normalizar',
			timeout: 10000,
			maxOptions: 3
		},

		initialize: function(options) {
			L.setOptions(this, options);
		},

		_normalizar: function(query, cb, context){
			Util.jsonp(this.options.normalizarUrl, {
				maxOptions: this.options.maxOptions,
				direccion: query
			}, function(json){
				cb.call(context, json);
			}, this, "callback");
			return this;
		},

		_tmerc2LatLng: function(a){
			var b = proj4.toPoint(a);
			return proj4.transform(this.options.tmerc, this.options.wsg, b),
			[ b.y, b.x ];
		},

		geocode: function(query, cb, context) {
			var results = [],
				maxOptions = 0,
				timedOut = false,
				timer;

			function checkIfCb(){
				if(!timedOut && results.length >= maxOptions){
					timedOut = true;
					cb.call(context || cb, results);
					clearTimeout(timer);
				}
			}

			function pushAndCb(c){
				results.push(c);
				checkIfCb();
			}

			this._normalizar(query, function(json){
				timer = setTimeout(L.bind(function(){
					timedOut = true;
					cb.call(context || cb, results);
				}, this), this.options.timeout);

				maxOptions = json.direccionesNormalizadas.length;

				json.direccionesNormalizadas.forEach(function(e){
					if(e.coordenadas){
						var center = L.latLng(e.coordenadas.y, e.coordenadas.x);
						pushAndCb({
							bbox: L.latLngBounds(center, center),
							name: e.direccion,
							center: center
						});
					}else if([
							(e.nombre_localidad||"").toUpperCase(),
							(e.nombre_partido||"").toUpperCase(),
					].indexOf("CABA") > -1)
						L.bind(function(e){
							Util.jsonp(this.options.geocodeUrl, {
								cod_calle: e.cod_calle,
								altura: e.altura
							}, function(tmerc){
								if(typeof(tmerc.x) != "undefined" && typeof(tmerc.y) != "undefined"){
									var center = L.latLng.apply(L, this._tmerc2LatLng([tmerc.x, tmerc.y]));
									pushAndCb({
										bbox: L.latLngBounds(center, center),
										name: e.direccion,
										center: center
									});
								}else{
									maxOptions--;
									checkIfCb();
								}
							}, this, "callback");
						}, this)(e);
					else
						this._normalizar(e.direccion, function(json){
							var data = json.direccionesNormalizadas[0];
							if(data && data.coordenadas){
								var center = L.latLng(data.coordenadas.y, data.coordenadas.x);
								pushAndCb({
									bbox: L.latLngBounds(center, center),
									name: data.direccion,
									center: center
								});
							} else{
								maxOptions--;
								checkIfCb();
							}
						}, this);
				}, this);
			}, this);
		},

		suggest: function(query, cb, context) {
			return this.geocode(query, cb, context);
		},

		reverse: function(location, scale, cb, context) {
			Util.jsonp(this.options.reverseUrl, {
				x: location.lng,
				y: location.lat,
			}, function(json){
				var results = [{
					bbox: L.latLngBounds(location, location),
					name: json.puerta,
					center: location
				}];
				cb.call(context || cb, results);
			}, "callback");
		}
	}),

	factory: function(options) {
		return new L.Control.Geocoder.BAComoviajo(options);
	}
};

