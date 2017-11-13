(function() {
    var map = L.map('map').setView([0, 0], 2),
        geocoders = {
            'Nominatim': L.Control.Geocoder.nominatim(),
            'Bing': L.Control.Geocoder.bing('AlsFLEm5UIoF-8kfQdB-XlTCGU_pLLNliREprSZFOZfEr08UCqD0OCzhL5jWAwQn'),
            'Mapbox': L.Control.Geocoder.mapbox(LCG.apiToken),
            'Photon': L.Control.Geocoder.photon(),
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

    L.tileLayer('https://a.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + LCG.apiToken, {
        attribution: '<a href="http://osm.org/copyright">Terms & Feedback</a>'
    }).addTo(map);

    control.addTo(map);

    map.on('click', function(e) {
        control.options.geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function(results) {
            var r = results[0];
            if (r) {
                if (marker) {
                    map.removeLayer(marker);
                }
                marker = L.marker(r.center).bindPopup(r.html || r.name).addTo(map).openPopup();
            }
        })
    });
})();
