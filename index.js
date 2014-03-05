(function() {
    var map = L.map('map').setView([0, 0], 2),
        geocoders = {
            'Nominatim': L.Control.Geocoder.nominatim(),
            'Bing': L.Control.Geocoder.bing('AoArA0sD6eBGZyt5PluxhuN7N7X1vloSEIhzaKVkBBGL37akEVbrr0wn17hoYAMy'),
            'MapQuest': L.Control.Geocoder.mapQuest('Fmjtd%7Cluur2l6825%2Crn%3Do5-90125r')
        },
        selector = L.DomUtil.get('geocode-selector'),
        control = new L.Control.Geocoder({ geocoder: null }),
        btn,
        selection,
        marker;

    function select(geocoder, el) {
        if (selection) {
            L.DomUtil.removeClass(selection, 'selected');
        }

        control.options.geocoder = geocoder;
        L.DomUtil.addClass(el, 'selected');
        selection = el;
    }

    for (var name in geocoders) {
        btn = L.DomUtil.create('button', '', selector);
        btn.innerHTML = name;
        (function(n) {
            L.DomEvent.addListener(btn, 'click', function() {
                select(geocoders[n], this);
            }, btn);
        })(name);

        if (!selection) {
            select(geocoders[name], btn);
        }
    }

    L.tileLayer('http://api.tiles.mapbox.com/v3/liedman.h9ekn0f1/{z}/{x}/{y}.png', {
        attribution: '<a href="http://osm.org/copyright">Terms & Feedback</a>'
    }).addTo(map);

    control.addTo(map);

    map.on('click', function(e) {
        control.options.geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function(results) {
            var r = results[0];
            if (r) {
                if (marker) {
                    marker.
                        setLatLng(r.center).
                        setPopupContent(r.name).
                        openPopup();
                } else {
                    marker = L.marker(r.center).bindPopup(r.name).addTo(map).openPopup();
                }
            }
        })
    });
})();
