---
layout: default
---

## Download

Download the latest release of Leaflet Control Geocoder:

{% for version in site.data.versions reversed %}
* [leaflet-control-geocoder-{{ version.version }}.zip]({{site.baseurl}}/dist/leaflet-control-geocoder-{{ version.version }}.zip)
{% endfor %}

These distributions include files that can be loaded with a normal `<script>` tag in your page.

## Install

You can also install Leaflet Control Geocoder using NPM, and use it with for example Browserify:

```
npm install --save leaflet-control-geocoder
```

## Using


Include `leaflet-control-geocoder.css` and `leaflet-control-geocoder.js` in a Leaflet page:

<pre><code class="language-markup">[...]
&lt;link rel=&quot;stylesheet&quot; href=&quot;http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css&quot; /&gt;
&lt;link rel=&quot;stylesheet&quot; href=&quot;leaflet-control-geocoder.css&quot; /&gt;
&lt;script src=&quot;http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;leaflet-control-geocoder.js&quot;&gt;&lt;/script&gt;
</code></pre>
