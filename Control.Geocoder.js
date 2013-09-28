L.Control.Geocoder = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topright',
		placeholder: 'Search...',
		text: 'Locate',
		errorMessage: 'Nothing found.',
		onGeocodeResult: function (results) {
			if (results.length > 0) {
				var bbox = results[0].bbox,
					first = new L.LatLng(bbox[0], bbox[1]),
					second = new L.LatLng(bbox[2], bbox[3]),
					bounds = new L.LatLngBounds([first, second]);
				this._map.fitBounds(bounds);
				new L.Marker(results[0].center)
					.bindPopup(results[0].name)
					.addTo(this._map)
					.openPopup();
			} else {
				L.DomUtil.addClass(this._errorElement, 'leaflet-control-geocoder-error')
			}
		}
	},

	_callbackId: 0,

	initialize: function (key, options) {
		this.key = key;
		L.Util.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;
		var className = 'leaflet-control-geocoder',
			container = this._container = L.DomUtil.create('div', className);

		L.DomEvent.disableClickPropagation(container);

		var form = this._form = L.DomUtil.create('form', className + '-form');

		var input = this._input = document.createElement('input');
		input.type = "text";
		input.placeholder = this.options.placeholder;
		L.DomEvent.addListener(input, 'onkeydown', this._hideError, this);
		L.DomEvent.addListener(input, 'onpaste', this._hideError, this);
		L.DomEvent.addListener(input, 'oninput', this._hideError, this);

		var submit = document.createElement('button');
		submit.type = "submit";
		submit.innerHTML = this.options.text;

		this._errorElement = document.createElement('div');
		this._errorElement.className = className + "-form-no-error"
		this._errorElement.innerHTML = this.options.errorMessage;

		form.appendChild(input);
		form.appendChild(submit);
		form.appendChild(this._errorElement);

		L.DomEvent.addListener(form, 'submit', this._geocode, this);

		if (this.options.collapsed) {
			L.DomEvent.addListener(container, 'mouseover', this._expand, this);
			L.DomEvent.addListener(container, 'mouseout', this._collapse, this);

			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Geocoder';

			L.DomEvent.addListener(link, L.Browser.touch ? 'click' : 'focus', this._expand, this);

			this._map.on('movestart', this._collapse, this);
		} else {
			this._expand();
		}

		container.appendChild(form);

		return container;
	},

	jsonp: function(url, params, callback, context, jsonpParam) {		
		var callbackId = "_l_geocoder_" + (this._callbackId++);
		params[jsonpParam || "callback"] = callbackId
		window[callbackId] = L.Util.bind(callback, context || this);
		script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url + L.Util.getParamString(params);
		script.id = callbackId;
		document.getElementsByTagName("head")[0].appendChild(script);
	},

	_geocode: function(event) {
		this._hideError();
		L.DomEvent.preventDefault(event);
		this.geocode(this._input.value);
	},

	geocode: function(query) {
		this.jsonp("http://nominatim.openstreetmap.org/search/", {
			q: query,
			format: "json"
		}, function(data) {
			var results = [];
			for (var i = data.length - 1; i >= 0; i--) {
				var bbox = data[i].boundingbox;
				for (var j = 0; j < 4; j++) bbox[j] = parseFloat(bbox[j]);
				results[i] = {
					name: data[i].display_name, 
					bbox: [bbox[0], bbox[2], bbox[1], bbox[3]],
					center: [(bbox[0] + bbox[1]) / 2, (bbox[2] + bbox[3]) / 2]
				};
			};
			this.options.onGeocodeResult.call(this, results);
		}, this, "json_callback")
	},

	_expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-expanded');
	},

	_collapse: function () {
		this._container.className = this._container.className.replace(' leaflet-control-geocoder-expanded', '');
	},

	_hideError: function () {
		L.DomUtil.removeClass(this._errorElement, 'leaflet-control-geocoder-error');
	}
});

L.Control.Geocoder.Bing = L.Control.Geocoder.extend({
	geocode : function (query) {
		this.jsonp("http://dev.virtualearth.net/REST/v1/Locations", {
			query: query,
			key : this.key,
		}, function(data) {
			var results = [];
			for (var i = data.resourceSets.resources.length - 1; i >= 0; i--) {
				var resource = data.resourceSets.resources[i];
				results[i] = {
					name: resource.name, 
					bbox: resouce.bbox,
					center: resource.point.coordinates
				};
			};
			this.options.onGeocodeResult.call(this, results);
		}, this, 'jsonp')
	},
})