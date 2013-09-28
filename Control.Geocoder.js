L.Control.Geocoder = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topright',
		placeholder: 'Search...',
		text: 'Locate',
		errorMessage: 'Nothing found.'
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
		L.DomEvent.addListener(input, 'onkeydown', this._clearResults, this);
		L.DomEvent.addListener(input, 'onpaste', this._clearResults, this);
		L.DomEvent.addListener(input, 'oninput', this._clearResults, this);

		var submit = document.createElement('button');
		submit.type = "submit";
		submit.innerHTML = this.options.text;

		this._errorElement = document.createElement('div');
		this._errorElement.className = className + "-form-no-error"
		this._errorElement.innerHTML = this.options.errorMessage;

		var altsTable = L.DomUtil.create('table', className + '-alternatives');
		this._alts = document.createElement('tbody');
		altsTable.appendChild(this._alts);

		form.appendChild(input);
		form.appendChild(submit);
		form.appendChild(this._errorElement);
		form.appendChild(altsTable);

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

	_geocodeResult: function (results) {
		if (results.length == 1) {
			this.options.markGeocode(results[0]);
		} else if (results.length > 0) {
			this._results = results;
			for (var i = 0; i < results.length; i++) {
				this._alts.appendChild(this._createAltRow(results[i]));
			};
		} else {
			L.DomUtil.addClass(this._errorElement, 'leaflet-control-geocoder-error')
		}
	},

	markGeocode: function(result) {
			var bbox = result.bbox,
				sw = [bbox[0], bbox[1]],
				ne = [bbox[2], bbox[3]];
			this._map.fitBounds([sw, ne]);

			if (this._geocodeMarker) {
				this._map.removeLayer(this._geocodeMarker);
			}

			this._geocodeMarker = new L.Marker(result.center)
				.bindPopup(result.name)
				.addTo(this._map)
				.openPopup();
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
		this._clearResults();
		L.DomEvent.preventDefault(event);
		this.geocode(this._input.value);
	},

	geocode: function(query) {
		this.jsonp("http://nominatim.openstreetmap.org/search/", {
			q: query,
			limit: 5,
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
			this._geocodeResult.call(this, results);
		}, this, "json_callback")
	},

	_expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-expanded');
	},

	_collapse: function () {
		this._container.className = this._container.className.replace(' leaflet-control-geocoder-expanded', '');
	},

	_clearResults: function () {
		this._alts.innerHTML = "";
		L.DomUtil.removeClass(this._errorElement, 'leaflet-control-geocoder-error');
	},

	_createAltRow: function(result) {
		var _this = this,
			tr = document.createElement('tr');
		tr.innerHTML = '<td><a href="#">' + result.name + '</a></td>';
		tr.onclick = function() { 
			_this.markGeocode.call(_this, result);
		};

		return tr;
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
			this._geocodeResult.call(this, results);
		}, this, 'jsonp')
	},
})