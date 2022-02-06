## 2.4.0 (2022-02-06)

* export { Geocoder, geocoder, geocoders } ([ec17333](https://github.com/perliedman/leaflet-control-geocoder/commit/ec17333))

## 2.3.0 (2021-05-25)

* Specify TypeScript declaration file ([1183518](https://github.com/perliedman/leaflet-control-geocoder/commit/1183518))

## 2.2.0 (2021-03-08)

- HERE: adding maxResults option (#317) ([3847008](https://github.com/perliedman/leaflet-control-geocoder/commit/3847008)), closes [#317](https://github.com/perliedman/leaflet-control-geocoder/issues/317)
- TypeScript: add event handler types ([2ffacc3](https://github.com/perliedman/leaflet-control-geocoder/commit/2ffacc3))

## 2.1.0 (2020-12-10)

- HERE Maps: new API ([9979da9](https://github.com/perliedman/leaflet-control-geocoder/commit/9979da9))

## 2.0.1 (2020-11-30)

- Fixes usage of [`L.Evented`](https://leafletjs.com/reference-1.7.1.html#evented) [mixin](https://leafletjs.com/reference-1.7.1.html#class-includes) for [TypeScript](https://www.typescriptlang.org/docs/handbook/mixins.html) ([#312](https://github.com/perliedman/leaflet-control-geocoder/issues/312))

## 2.0.0 (2020-11-28)

- Migrate to TypeScript
- Generate API documentation using TypeDoc ([756ae93](https://github.com/perliedman/leaflet-control-geocoder/commit/756ae93))
- Harmonize options constructor for all geocoders ([e4659b5](https://github.com/perliedman/leaflet-control-geocoder/commit/e4659b5))
- Use geocodingQueryParams in all geocoders ([84d764a](https://github.com/perliedman/leaflet-control-geocoder/commit/84d764a))
- Use reverseQueryParams in all geocoders ([9240331](https://github.com/perliedman/leaflet-control-geocoder/commit/9240331))
- Replace PNG and GIF files with SVG URIs (#298) ([1ec9ab5](https://github.com/perliedman/leaflet-control-geocoder/commit/1ec9ab5)), closes [#298](https://github.com/perliedman/leaflet-control-geocoder/issues/298)
- photon: update to photon.komoot.io ([e4b3082](https://github.com/perliedman/leaflet-control-geocoder/commit/e4b3082))
- mapbox: add location properties to reverse geocode (#286) ([3398c8c](https://github.com/perliedman/leaflet-control-geocoder/commit/3398c8c)), closes [#286](https://github.com/perliedman/leaflet-control-geocoder/issues/286)
- demos: add unpkg.com demo ([2418679](https://github.com/perliedman/leaflet-control-geocoder/commit/2418679))
- demos: add esbuild demo ([2e0553f](https://github.com/perliedman/leaflet-control-geocoder/commit/2e0553f))
- demos: upgrade to webpack 5 ([b600cad](https://github.com/perliedman/leaflet-control-geocoder/commit/b600cad))
- tests: Migrate unit tests to Jest ([5b64c34](https://github.com/perliedman/leaflet-control-geocoder/commit/5b64c34))
- package: Enable compressed-size-action for PRs ([fdf6df0](https://github.com/perliedman/leaflet-control-geocoder/commit/fdf6df0)), closes [#283](https://github.com/perliedman/leaflet-control-geocoder/issues/283)
- package: Enable GitHub Actions ([c98745e](https://github.com/perliedman/leaflet-control-geocoder/commit/c98745e))
- package: Migrate build to microbundle ([fc0eff9](https://github.com/perliedman/leaflet-control-geocoder/commit/fc0eff9))

### BREAKING CHANGE

- All geocoders accept a single `options` object as constructor parameter. The `options` objects extends the interface `GeocoderOptions`. The `apiKey` string constructors of some geocoders have been removed.
- `reverse` now returns bbox in field called `bbox` (previously `bounds`)

## 1.13.0 (2020-04-13)

- Check touch for event type instead of expand option ([b8ebba1](https://github.com/perliedman/leaflet-control-geocoder/commit/b8ebba1)), closes [#255](https://github.com/perliedman/leaflet-control-geocoder/issues/255) [#272](https://github.com/perliedman/leaflet-control-geocoder/issues/272)
- package: simplify npm publish process ([95dc7d1](https://github.com/perliedman/leaflet-control-geocoder/commit/95dc7d1))
- Mapbox: add country code to properties when available ([302cf85](https://github.com/perliedman/leaflet-control-geocoder/commit/302cf85)), closes [#278](https://github.com/perliedman/leaflet-control-geocoder/issues/278)

## 1.12.0 (2020-02-15)

- Collapse search result on iOS devices ([12193af](https://github.com/perliedman/leaflet-control-geocoder/commit/12193af)), closes [#271](https://github.com/perliedman/leaflet-control-geocoder/issues/271)
- opencage: add support for geocodingQueryParams ([ca19308](https://github.com/perliedman/leaflet-control-geocoder/commit/ca19308))
- opencage: add support for geocodingQueryParams ([c0d9712](https://github.com/perliedman/leaflet-control-geocoder/commit/c0d9712)), closes [#269](https://github.com/perliedman/leaflet-control-geocoder/issues/269)
- opencage: update README ([7e85899](https://github.com/perliedman/leaflet-control-geocoder/commit/7e85899))
- here: add address to result properties ([94c5251](https://github.com/perliedman/leaflet-control-geocoder/commit/94c5251)), closes [#270](https://github.com/perliedman/leaflet-control-geocoder/issues/270)
- package: npm audit fix ([845f119](https://github.com/perliedman/leaflet-control-geocoder/commit/845f119))

## 1.11.0 (2020-01-18)

- Add an aria-label to the geocoder control button ([02abfad](https://github.com/perliedman/leaflet-control-geocoder/commit/02abfad)), closes [#263](https://github.com/perliedman/leaflet-control-geocoder/issues/263)
- package: update devDependencies ([8514b4e](https://github.com/perliedman/leaflet-control-geocoder/commit/8514b4e))
- control: add method `setQuery` ([66252f6](https://github.com/perliedman/leaflet-control-geocoder/commit/66252f6)), closes [#265](https://github.com/perliedman/leaflet-control-geocoder/issues/265)
- control: set initial query via options ([79c2145](https://github.com/perliedman/leaflet-control-geocoder/commit/79c2145))

## 1.10.0 (2019-10-08)

- Add option for prox radius when geocoding position ([8d28ecc](https://github.com/perliedman/leaflet-control-geocoder/commit/8d28ecc)), closes [#261](https://github.com/perliedman/leaflet-control-geocoder/issues/261)

## 1.9.0 (2019-08-13)

- Adding OpenCage Data Geocoder ([1d98bea](https://github.com/perliedman/leaflet-control-geocoder/commit/1d98bea)), closes [#258](https://github.com/perliedman/leaflet-control-geocoder/issues/258)
- Bump version to 1.9.0 ([dcb2211](https://github.com/perliedman/leaflet-control-geocoder/commit/dcb2211))
- package.json: specify files, drop .npmignore ([a8610cb](https://github.com/perliedman/leaflet-control-geocoder/commit/a8610cb))
- demos: use HTTPS for osm.org ([b7e787a](https://github.com/perliedman/leaflet-control-geocoder/commit/b7e787a))
- here: use HTTPS ([1813a9f](https://github.com/perliedman/leaflet-control-geocoder/commit/1813a9f)), closes [#259](https://github.com/perliedman/leaflet-control-geocoder/issues/259)

## <small>1.8.3 (2019-07-21)</small>

- Bump version to 1.8.3 ([8194ec4](https://github.com/perliedman/leaflet-control-geocoder/commit/8194ec4))
- IE does not parse JSON responses using Nominatim ([f177fdc](https://github.com/perliedman/leaflet-control-geocoder/commit/f177fdc)), closes [#253](https://github.com/perliedman/leaflet-control-geocoder/issues/253) [#252](https://github.com/perliedman/leaflet-control-geocoder/issues/252)
- lint: update ESLint to 6.1.0 ([c7d4cc8](https://github.com/perliedman/leaflet-control-geocoder/commit/c7d4cc8))
- control: add option showUniqueResult ([e86c406](https://github.com/perliedman/leaflet-control-geocoder/commit/e86c406)), closes [#236](https://github.com/perliedman/leaflet-control-geocoder/issues/236)
- README: use HTTP for leafletjs.com links ([fa35d32](https://github.com/perliedman/leaflet-control-geocoder/commit/fa35d32))
- mapbox: fix loc.context.length undefined ([eeee760](https://github.com/perliedman/leaflet-control-geocoder/commit/eeee760)), closes [#254](https://github.com/perliedman/leaflet-control-geocoder/issues/254)

## <small>1.8.2 (2019-06-08)</small>

- Bump version to 1.8.2 ([4e491f9](https://github.com/perliedman/leaflet-control-geocoder/commit/4e491f9))
- Update .npmignore ([dba296f](https://github.com/perliedman/leaflet-control-geocoder/commit/dba296f))

## <small>1.8.1 (2019-06-08)</small>

- Add demo using rollup.js bundler ([4ae65c3](https://github.com/perliedman/leaflet-control-geocoder/commit/4ae65c3))
- Add demo using webpack bundler ([4af0fbc](https://github.com/perliedman/leaflet-control-geocoder/commit/4af0fbc)), closes [#245](https://github.com/perliedman/leaflet-control-geocoder/issues/245)
- Bump version to 1.8.1 ([1b623e7](https://github.com/perliedman/leaflet-control-geocoder/commit/1b623e7))
- scripts/publish: fail on error ([cd4c034](https://github.com/perliedman/leaflet-control-geocoder/commit/cd4c034))
- Update .gitignore and .eslintignore ([2db6426](https://github.com/perliedman/leaflet-control-geocoder/commit/2db6426))
- Update Prettier to 1.18.2 ([6f7708f](https://github.com/perliedman/leaflet-control-geocoder/commit/6f7708f))
- fix: Nominatim.class is not a constructor ([1cfac6c](https://github.com/perliedman/leaflet-control-geocoder/commit/1cfac6c)), closes [#249](https://github.com/perliedman/leaflet-control-geocoder/issues/249)
- README: fix typo ([59d1cb6](https://github.com/perliedman/leaflet-control-geocoder/commit/59d1cb6))

## 1.8.0 (2019-06-08)

- Add @simon04 to contributors ([adf861a](https://github.com/perliedman/leaflet-control-geocoder/commit/adf861a))
- Add L.Control.Geocoder.Nominatim tests ([209cc53](https://github.com/perliedman/leaflet-control-geocoder/commit/209cc53))
- Add LatLng geocoder ([bcaa527](https://github.com/perliedman/leaflet-control-geocoder/commit/bcaa527)), closes [#222](https://github.com/perliedman/leaflet-control-geocoder/issues/222)
- Add open-location-code.spec.js ([6826276](https://github.com/perliedman/leaflet-control-geocoder/commit/6826276))
- Add support for Openrouteservice ([54d2692](https://github.com/perliedman/leaflet-control-geocoder/commit/54d2692)), closes [#239](https://github.com/perliedman/leaflet-control-geocoder/issues/239)
- Add support for Plus codes ([bbeb62e](https://github.com/perliedman/leaflet-control-geocoder/commit/bbeb62e))
- Added CSS classes for open dropdown ([7542988](https://github.com/perliedman/leaflet-control-geocoder/commit/7542988)), closes [#243](https://github.com/perliedman/leaflet-control-geocoder/issues/243)
- Bump version to 1.8.0 ([9617d6c](https://github.com/perliedman/leaflet-control-geocoder/commit/9617d6c))
- Can now close dropdown on pressing ESC ([7cf3385](https://github.com/perliedman/leaflet-control-geocoder/commit/7cf3385)), closes [#241](https://github.com/perliedman/leaflet-control-geocoder/issues/241)
- ES2015 modules: simplify import/export, factories ([266a881](https://github.com/perliedman/leaflet-control-geocoder/commit/266a881))
- Get rid of eslint ignored file warning ([e29a071](https://github.com/perliedman/leaflet-control-geocoder/commit/e29a071))
- Minimal documentation for suggest feature ([9636bfe](https://github.com/perliedman/leaflet-control-geocoder/commit/9636bfe)), closes [#240](https://github.com/perliedman/leaflet-control-geocoder/issues/240)
- Rename Pelias ([5a501d5](https://github.com/perliedman/leaflet-control-geocoder/commit/5a501d5))
- Run eslint also on spec/ ([4ac33ad](https://github.com/perliedman/leaflet-control-geocoder/commit/4ac33ad))
- Show throbber/spinner during suggest attempt ([ceeb796](https://github.com/perliedman/leaflet-control-geocoder/commit/ceeb796)), closes [#242](https://github.com/perliedman/leaflet-control-geocoder/issues/242)
- Specify pkg.module ([c5776da](https://github.com/perliedman/leaflet-control-geocoder/commit/c5776da))
- Update devDependencies ([00c0100](https://github.com/perliedman/leaflet-control-geocoder/commit/00c0100))
- Update package description and keywords ([5d9d710](https://github.com/perliedman/leaflet-control-geocoder/commit/5d9d710))
- Use XMLHttpRequest.responseType ([9b80172](https://github.com/perliedman/leaflet-control-geocoder/commit/9b80172))
- demo: parse geocoder from URL search parameter ([2cccafa](https://github.com/perliedman/leaflet-control-geocoder/commit/2cccafa))
- README: update demo URL ([8de5514](https://github.com/perliedman/leaflet-control-geocoder/commit/8de5514))
- LatLng: construct bbox ([57f0a32](https://github.com/perliedman/leaflet-control-geocoder/commit/57f0a32))
- LatLng: fix typo ([a5f1046](https://github.com/perliedman/leaflet-control-geocoder/commit/a5f1046))

## 1.7.0 (2019-03-29)

- Add banner with copyright ([c926e1e](https://github.com/perliedman/leaflet-control-geocoder/commit/c926e1e)), closes [#202](https://github.com/perliedman/leaflet-control-geocoder/issues/202)
- Add Neutrino API ([5e8832a](https://github.com/perliedman/leaflet-control-geocoder/commit/5e8832a)), closes [#212](https://github.com/perliedman/leaflet-control-geocoder/issues/212)
- Add package-lock.json ([b0a7b1a](https://github.com/perliedman/leaflet-control-geocoder/commit/b0a7b1a))
- Add queryMinLength option ([1942b92](https://github.com/perliedman/leaflet-control-geocoder/commit/1942b92)), closes [#194](https://github.com/perliedman/leaflet-control-geocoder/issues/194)
- Add support for array valued query parameters ([2d06ebf](https://github.com/perliedman/leaflet-control-geocoder/commit/2d06ebf)), closes [#216](https://github.com/perliedman/leaflet-control-geocoder/issues/216) [#196](https://github.com/perliedman/leaflet-control-geocoder/issues/196)
- Break out external rollup config ([3b46c80](https://github.com/perliedman/leaflet-control-geocoder/commit/3b46c80))
- Build uglified Control.Geocoder.min.js as well ([aa65d4c](https://github.com/perliedman/leaflet-control-geocoder/commit/aa65d4c))
- Bump version to 1.7.0 ([813120a](https://github.com/perliedman/leaflet-control-geocoder/commit/813120a))
- changed http to https, was causing problem ([8f15876](https://github.com/perliedman/leaflet-control-geocoder/commit/8f15876)), closes [#227](https://github.com/perliedman/leaflet-control-geocoder/issues/227)
- Document suggest options ([ec5ca86](https://github.com/perliedman/leaflet-control-geocoder/commit/ec5ca86))
- Don't try to remove duplicate geocodings ([d432362](https://github.com/perliedman/leaflet-control-geocoder/commit/d432362)), closes [#217](https://github.com/perliedman/leaflet-control-geocoder/issues/217)
- Fix CSS copying on Windows ([ffb35f3](https://github.com/perliedman/leaflet-control-geocoder/commit/ffb35f3))
- Mapzen Search lives on as Pelias, geocode.earth ([a667012](https://github.com/perliedman/leaflet-control-geocoder/commit/a667012)), closes [#187](https://github.com/perliedman/leaflet-control-geocoder/issues/187) [#213](https://github.com/perliedman/leaflet-control-geocoder/issues/213)
- Prevent clicks propagating from input; fixes #205, closes #208 ([f75cac4](https://github.com/perliedman/leaflet-control-geocoder/commit/f75cac4)), closes [#205](https://github.com/perliedman/leaflet-control-geocoder/issues/205) [#208](https://github.com/perliedman/leaflet-control-geocoder/issues/208)
- propagate geocodeQueryParams ([c5751fd](https://github.com/perliedman/leaflet-control-geocoder/commit/c5751fd)), closes [#226](https://github.com/perliedman/leaflet-control-geocoder/issues/226)
- Re-introduce preventDefault for keypresses ([1bf3693](https://github.com/perliedman/leaflet-control-geocoder/commit/1bf3693)), closes [#191](https://github.com/perliedman/leaflet-control-geocoder/issues/191)
- Remove test/ ([2d2c89e](https://github.com/perliedman/leaflet-control-geocoder/commit/2d2c89e)), closes [#219](https://github.com/perliedman/leaflet-control-geocoder/issues/219)
- Update Mapbox Geocoding URL ([01fb282](https://github.com/perliedman/leaflet-control-geocoder/commit/01fb282)), closes [#192](https://github.com/perliedman/leaflet-control-geocoder/issues/192)
- Use latest Leaflet; use Nominatim since Mapzen is gone ([a02bca2](https://github.com/perliedman/leaflet-control-geocoder/commit/a02bca2))
- Demo: specify charset="utf-8" ([c33387f](https://github.com/perliedman/leaflet-control-geocoder/commit/c33387f))
- Mapbox: add properties to results ([6072ee1](https://github.com/perliedman/leaflet-control-geocoder/commit/6072ee1)), closes [#211](https://github.com/perliedman/leaflet-control-geocoder/issues/211)
- Phonon: all properties in display name ([d3706f7](https://github.com/perliedman/leaflet-control-geocoder/commit/d3706f7))

## 1.6.0 (2018-08-05)

- Firefox flickering on mouse over geocoder ([058e18f](https://github.com/perliedman/leaflet-control-geocoder/commit/058e18f)), closes [#180](https://github.com/perliedman/leaflet-control-geocoder/issues/180)
- pin dropped when result clicked with collapsed false ([fc30c23](https://github.com/perliedman/leaflet-control-geocoder/commit/fc30c23)), closes [#181](https://github.com/perliedman/leaflet-control-geocoder/issues/181)
- trigger on ontouchstart event for android ([e3916a1](https://github.com/perliedman/leaflet-control-geocoder/commit/e3916a1)), closes [#177](https://github.com/perliedman/leaflet-control-geocoder/issues/177)
- Bump to 1.5.8 ([290a14d](https://github.com/perliedman/leaflet-control-geocoder/commit/290a14d))
- Bump version to 1.6.0 ([0f6e66f](https://github.com/perliedman/leaflet-control-geocoder/commit/0f6e66f))
- Enable Travis CI ([ddaea04](https://github.com/perliedman/leaflet-control-geocoder/commit/ddaea04)), closes [#190](https://github.com/perliedman/leaflet-control-geocoder/issues/190)
- Fix Firefox flickering on mouse over geocoder ([1e10773](https://github.com/perliedman/leaflet-control-geocoder/commit/1e10773)), closes [#174](https://github.com/perliedman/leaflet-control-geocoder/issues/174)
- Fix this.options.geocoder[mode] is not a function ([11396f0](https://github.com/perliedman/leaflet-control-geocoder/commit/11396f0)), closes [#184](https://github.com/perliedman/leaflet-control-geocoder/issues/184)
- package.json: images have to go to dist/images/ ([121e6dc](https://github.com/perliedman/leaflet-control-geocoder/commit/121e6dc))
- package.json: split build cmds, cleanup ([016e2a6](https://github.com/perliedman/leaflet-control-geocoder/commit/016e2a6))
- Use ES6 modules, use rollup for module bundling ([7fae9a0](https://github.com/perliedman/leaflet-control-geocoder/commit/7fae9a0)), closes [#185](https://github.com/perliedman/leaflet-control-geocoder/issues/185)
- Use ESLint, Prettier for code linting+formatting ([9bb2365](https://github.com/perliedman/leaflet-control-geocoder/commit/9bb2365)), closes [#188](https://github.com/perliedman/leaflet-control-geocoder/issues/188)
- Photon: fix wrong building of reverse query params ([ff08f8e](https://github.com/perliedman/leaflet-control-geocoder/commit/ff08f8e)), closes [#204](https://github.com/perliedman/leaflet-control-geocoder/issues/204)
- README: add usage via unpkg.com ([b848a1e](https://github.com/perliedman/leaflet-control-geocoder/commit/b848a1e)), closes [#186](https://github.com/perliedman/leaflet-control-geocoder/issues/186)
- README: document constructor vs. factory methods ([41413ec](https://github.com/perliedman/leaflet-control-geocoder/commit/41413ec)), closes [#183](https://github.com/perliedman/leaflet-control-geocoder/issues/183)
- README: quote option keys using `` ([e38a182](https://github.com/perliedman/leaflet-control-geocoder/commit/e38a182))
- README: update Nominatim URLs ([0f9603f](https://github.com/perliedman/leaflet-control-geocoder/commit/0f9603f))
- util: export/import individual functions ([b8fd9f5](https://github.com/perliedman/leaflet-control-geocoder/commit/b8fd9f5))
- mapquest: drop jsonp in favour of standard XHR ([1cfae96](https://github.com/perliedman/leaflet-control-geocoder/commit/1cfae96))
- nominatim: drop jsonp in favour of standard XHR ([b693edd](https://github.com/perliedman/leaflet-control-geocoder/commit/b693edd))
- rollup: generate sourcemap ([dea9874](https://github.com/perliedman/leaflet-control-geocoder/commit/dea9874))

## <small>1.5.7 (2017-11-13)</small>

- Allow mouse to trigger control even when using touch as trigger ([1771fbd](https://github.com/perliedman/leaflet-control-geocoder/commit/1771fbd))
- Bump version to 1.5.7 ([6796721](https://github.com/perliedman/leaflet-control-geocoder/commit/6796721))
- Comment out test build for now, since it's not used. ([4bcfcb6](https://github.com/perliedman/leaflet-control-geocoder/commit/4bcfcb6))
- Fix npm prepublish script deprecation; fixes #175 ([310ba04](https://github.com/perliedman/leaflet-control-geocoder/commit/310ba04)), closes [#175](https://github.com/perliedman/leaflet-control-geocoder/issues/175)
- Make button use pointer cursor ([454f844](https://github.com/perliedman/leaflet-control-geocoder/commit/454f844))
- Remove unnecessary preventDefault that cause problems in Firefox ([aeb575a](https://github.com/perliedman/leaflet-control-geocoder/commit/aeb575a))
- Update example to Leaflet 1.2.0 ([b1ce8f7](https://github.com/perliedman/leaflet-control-geocoder/commit/b1ce8f7))
- Update README.md ([0994f34](https://github.com/perliedman/leaflet-control-geocoder/commit/0994f34)), closes [#173](https://github.com/perliedman/leaflet-control-geocoder/issues/173)
- Use input event, not keydown for triggering suggest ([ef5f573](https://github.com/perliedman/leaflet-control-geocoder/commit/ef5f573))

## <small>1.5.6 (2017-10-20)</small>

- Adding ability to pass query options to the Mapbox API ([a0151cc](https://github.com/perliedman/leaflet-control-geocoder/commit/a0151cc)), closes [#164](https://github.com/perliedman/leaflet-control-geocoder/issues/164)
- Allow htmltemplate option for photon ([9501e6d](https://github.com/perliedman/leaflet-control-geocoder/commit/9501e6d)), closes [#151](https://github.com/perliedman/leaflet-control-geocoder/issues/151)
- Bump version to 1.5.5 ([5445feb](https://github.com/perliedman/leaflet-control-geocoder/commit/5445feb))
- Bump version to 1.5.6 ([6f497ab](https://github.com/perliedman/leaflet-control-geocoder/commit/6f497ab))
- Fix paths to dist files in bower.json ([9a84fe0](https://github.com/perliedman/leaflet-control-geocoder/commit/9a84fe0))
- inherit from 'L.Evented' instead of deprecated 'L.Mixin.Events' ([ba481c9](https://github.com/perliedman/leaflet-control-geocoder/commit/ba481c9)), closes [#172](https://github.com/perliedman/leaflet-control-geocoder/issues/172)
- Mobile experience improvements ([f528ff1](https://github.com/perliedman/leaflet-control-geocoder/commit/f528ff1)), closes [#169](https://github.com/perliedman/leaflet-control-geocoder/issues/169)
- pass search data in callbacks (input and results) ([fe04f97](https://github.com/perliedman/leaflet-control-geocoder/commit/fe04f97)), closes [#153](https://github.com/perliedman/leaflet-control-geocoder/issues/153)
- Remove Leaflet dep for bower; bump version to 1.5.4 ([e2bd3f0](https://github.com/perliedman/leaflet-control-geocoder/commit/e2bd3f0))
- Doc(README): fix event.geocode.bbox property API ([c8f7d8c](https://github.com/perliedman/leaflet-control-geocoder/commit/c8f7d8c)), closes [#161](https://github.com/perliedman/leaflet-control-geocoder/issues/161) [/github.com/perliedman/leaflet-control-geocoder/blob/master/src/geocoders/nominatim.js#L53](https://github.com//github.com/perliedman/leaflet-control-geocoder/blob/master/src/geocoders/nominatim.js/issues/L53)

## <small>1.5.3 (2016-10-11)</small>

- Bump to 1.5.3 ([4e38d97](https://github.com/perliedman/leaflet-control-geocoder/commit/4e38d97))
- Fix so dist file can actually be used with browserify ([7ab1d99](https://github.com/perliedman/leaflet-control-geocoder/commit/7ab1d99))

## <small>1.5.2 (2016-10-07)</small>

- Add link to DAWA geocoder ([f3dee06](https://github.com/perliedman/leaflet-control-geocoder/commit/f3dee06))
- Badges badges badges badges ([a65818b](https://github.com/perliedman/leaflet-control-geocoder/commit/a65818b))
- Bump version to 1.5.2 ([f5ff059](https://github.com/perliedman/leaflet-control-geocoder/commit/f5ff059))
- Drop Leaflet dependency and use dist file as main ([4c3453a](https://github.com/perliedman/leaflet-control-geocoder/commit/4c3453a))
- Prevent control from collapsing on mousedown; close #142 ([391f841](https://github.com/perliedman/leaflet-control-geocoder/commit/391f841)), closes [#142](https://github.com/perliedman/leaflet-control-geocoder/issues/142)
- Update to use Leaflet 1.0.1 ([6c815f1](https://github.com/perliedman/leaflet-control-geocoder/commit/6c815f1))

## <small>1.5.1 (2016-06-19)</small>

- Bump version to 1.5.1 ([45f626e](https://github.com/perliedman/leaflet-control-geocoder/commit/45f626e))

## 1.5.0 (2016-06-19)

- Actually call suggest when in suggest mode ([7e53118](https://github.com/perliedman/leaflet-control-geocoder/commit/7e53118))
- Add suggest functionality. ([2645813](https://github.com/perliedman/leaflet-control-geocoder/commit/2645813)), closes [#53](https://github.com/perliedman/leaflet-control-geocoder/issues/53)
- Always prevent default on return key. ([f3b7704](https://github.com/perliedman/leaflet-control-geocoder/commit/f3b7704)), closes [#126](https://github.com/perliedman/leaflet-control-geocoder/issues/126)
- Avoid protocol relative URLs and prefer HTTPS ([960465a](https://github.com/perliedman/leaflet-control-geocoder/commit/960465a))
- Bump version to 1.5.0 ([9c71603](https://github.com/perliedman/leaflet-control-geocoder/commit/9c71603))
- Cleanup control code ([da3bcb7](https://github.com/perliedman/leaflet-control-geocoder/commit/da3bcb7))
- Fire events to make customisation easier. ([3863759](https://github.com/perliedman/leaflet-control-geocoder/commit/3863759)), closes [#42](https://github.com/perliedman/leaflet-control-geocoder/issues/42)
- Fix broken suggest/geocode logic; ignore old requests ([a0b8d16](https://github.com/perliedman/leaflet-control-geocoder/commit/a0b8d16))
- Fix parsing when result is a Point ([cb06d69](https://github.com/perliedman/leaflet-control-geocoder/commit/cb06d69))
- Fix selecting alt with mouse ([cc1a049](https://github.com/perliedman/leaflet-control-geocoder/commit/cc1a049))
- Refactor onAdd ([4ba9806](https://github.com/perliedman/leaflet-control-geocoder/commit/4ba9806))
- Remove unused ([aa00a02](https://github.com/perliedman/leaflet-control-geocoder/commit/aa00a02))
- Replace form tag with a normal div. ([4d55341](https://github.com/perliedman/leaflet-control-geocoder/commit/4d55341)), closes [#86](https://github.com/perliedman/leaflet-control-geocoder/issues/86)
- Update to Leaflet 0.7.7 ([4b50194](https://github.com/perliedman/leaflet-control-geocoder/commit/4b50194))
- Updated for v2 of w3w API ([c1ead89](https://github.com/perliedman/leaflet-control-geocoder/commit/c1ead89)), closes [#131](https://github.com/perliedman/leaflet-control-geocoder/issues/131)
- Use cdnjs and hope for more stability ([a139976](https://github.com/perliedman/leaflet-control-geocoder/commit/a139976))
- Use HTTPS as default. ([567442a](https://github.com/perliedman/leaflet-control-geocoder/commit/567442a))

## 1.4.0 (2016-04-14)

- Add ArcGis geocoding service ([1c7025d](https://github.com/perliedman/leaflet-control-geocoder/commit/1c7025d)), closes [#120](https://github.com/perliedman/leaflet-control-geocoder/issues/120)
- Added HERE as a provider for geocoding and reverse geocoding ([b6287c9](https://github.com/perliedman/leaflet-control-geocoder/commit/b6287c9))
- Bump version 1.3.4 ([33d0090](https://github.com/perliedman/leaflet-control-geocoder/commit/33d0090))
- Run install instead of unknown script ([23623d3](https://github.com/perliedman/leaflet-control-geocoder/commit/23623d3))
- Try to fix publish to work for bower as well ([5d4f6c1](https://github.com/perliedman/leaflet-control-geocoder/commit/5d4f6c1))
- Use GitHub's release page ([fb3228c](https://github.com/perliedman/leaflet-control-geocoder/commit/fb3228c))

## <small>1.3.3 (2016-02-11)</small>

- Add hamlet's name in results ([19897a2](https://github.com/perliedman/leaflet-control-geocoder/commit/19897a2))
- Correctly append HTML after icon ([6bcc816](https://github.com/perliedman/leaflet-control-geocoder/commit/6bcc816)), closes [#103](https://github.com/perliedman/leaflet-control-geocoder/issues/103)
- Fix missing bind in Mapzen's suggest ([9944987](https://github.com/perliedman/leaflet-control-geocoder/commit/9944987))
- fixes what3words link ([5a2c1e3](https://github.com/perliedman/leaflet-control-geocoder/commit/5a2c1e3))

## <small>1.3.2 (2015-11-06)</small>

- Add suggest support to the Mapzen geocoder ([80bde8b](https://github.com/perliedman/leaflet-control-geocoder/commit/80bde8b))
- Add support for Mapzen Search ([f73c5dd](https://github.com/perliedman/leaflet-control-geocoder/commit/f73c5dd))
- adding images to bower.json ([3e6134d](https://github.com/perliedman/leaflet-control-geocoder/commit/3e6134d))
- Fix the Mapzen factory function to propagate the API key ([4aef861](https://github.com/perliedman/leaflet-control-geocoder/commit/4aef861))
- Remove trailing slash for Nominatim serviceUrl. Close #95. ([160b14b](https://github.com/perliedman/leaflet-control-geocoder/commit/160b14b)), closes [#95](https://github.com/perliedman/leaflet-control-geocoder/issues/95)
- Use es3ify when building dist ([b61b927](https://github.com/perliedman/leaflet-control-geocoder/commit/b61b927))

## <small>1.3.1 (2015-08-27)</small>

- add Control.Geocoder.css to main ([e572832](https://github.com/perliedman/leaflet-control-geocoder/commit/e572832))
- Fix definition of Nominatim class ([423610e](https://github.com/perliedman/leaflet-control-geocoder/commit/423610e))
- Fix missing dist folder in npm package ([d374136](https://github.com/perliedman/leaflet-control-geocoder/commit/d374136))
- Use Leaflet 0.7.3, use built files from dist ([2ba7abb](https://github.com/perliedman/leaflet-control-geocoder/commit/2ba7abb))

## 1.3.0 (2015-08-21)

- Add reverse geocoding for Photon ([ece9701](https://github.com/perliedman/leaflet-control-geocoder/commit/ece9701))
- Add specificity to style of search icon ([b2ade40](https://github.com/perliedman/leaflet-control-geocoder/commit/b2ade40))
- Auto publish and download instructions ([82d5ee6](https://github.com/perliedman/leaflet-control-geocoder/commit/82d5ee6))
- Break into smaller files; use browserify ([8042ef2](https://github.com/perliedman/leaflet-control-geocoder/commit/8042ef2))
- Clicking icon performs search when collapsed:false option is set ([07227f4](https://github.com/perliedman/leaflet-control-geocoder/commit/07227f4))
- Clicking icon performs search when collapsed:false option is set ([cf281b8](https://github.com/perliedman/leaflet-control-geocoder/commit/cf281b8))
- Fix li items class set to 'undefined' ([f1e7475](https://github.com/perliedman/leaflet-control-geocoder/commit/f1e7475))
- Fix result styling specificity to really override Leaflet's anchor styles ([5fea5c1](https://github.com/perliedman/leaflet-control-geocoder/commit/5fea5c1))
- Improve empty link ([a280baa](https://github.com/perliedman/leaflet-control-geocoder/commit/a280baa))
- Options for Google Geocoder, address_components from its result ([b9b0747](https://github.com/perliedman/leaflet-control-geocoder/commit/b9b0747))
- removed redundant clickHandler ([c391bc2](https://github.com/perliedman/leaflet-control-geocoder/commit/c391bc2))
- Update Google options handling and result parameter passing to be more in line with Nominatim's ([ce82425](https://github.com/perliedman/leaflet-control-geocoder/commit/ce82425))

## <small>1.2.1 (2015-07-02)</small>

- Move setRequestHeader to after opening request ([5f1bc4e](https://github.com/perliedman/leaflet-control-geocoder/commit/5f1bc4e))

## 1.2.0 (2015-07-02)

- Add Photon geocoder support ([4c83212](https://github.com/perliedman/leaflet-control-geocoder/commit/4c83212))
- Added "application/json" as Accept header param since all browsers (eg. Firefox) not add this by def ([f0827ec](https://github.com/perliedman/leaflet-control-geocoder/commit/f0827ec))
- added serviceUrl option to mapquest geocoder to support open api or future changes ([0d45ece](https://github.com/perliedman/leaflet-control-geocoder/commit/0d45ece))
- Added support for what3words ([728d2db](https://github.com/perliedman/leaflet-control-geocoder/commit/728d2db))
- Attach error element to container, not form ([c68855c](https://github.com/perliedman/leaflet-control-geocoder/commit/c68855c))
- Fixed the button size so it's the same one other leaflet controllers have and also fixed search box ([86cc5d7](https://github.com/perliedman/leaflet-control-geocoder/commit/86cc5d7))
- fixes #64 ([e5f41f3](https://github.com/perliedman/leaflet-control-geocoder/commit/e5f41f3)), closes [#64](https://github.com/perliedman/leaflet-control-geocoder/issues/64)
- fixes #66 ([6cd16bf](https://github.com/perliedman/leaflet-control-geocoder/commit/6cd16bf)), closes [#66](https://github.com/perliedman/leaflet-control-geocoder/issues/66)
- fixes #66 - better order ([eefb962](https://github.com/perliedman/leaflet-control-geocoder/commit/eefb962)), closes [#66](https://github.com/perliedman/leaflet-control-geocoder/issues/66)
- fixes #66 - missing a length check in Geocoder.Bing ([f521c79](https://github.com/perliedman/leaflet-control-geocoder/commit/f521c79)), closes [#66](https://github.com/perliedman/leaflet-control-geocoder/issues/66)
- fixes #66 - oups! introduced an error ([ec4debd](https://github.com/perliedman/leaflet-control-geocoder/commit/ec4debd)), closes [#66](https://github.com/perliedman/leaflet-control-geocoder/issues/66)
- fixes #66 comment 2 ([78ca65f](https://github.com/perliedman/leaflet-control-geocoder/commit/78ca65f)), closes [#66](https://github.com/perliedman/leaflet-control-geocoder/issues/66)
- Fixup indentation etc. ([e6f5fdb](https://github.com/perliedman/leaflet-control-geocoder/commit/e6f5fdb))
- layout css simplified, previous had problems on Samsung tab default browser. ([9c777bf](https://github.com/perliedman/leaflet-control-geocoder/commit/9c777bf))
- removed commented style ([03875bf](https://github.com/perliedman/leaflet-control-geocoder/commit/03875bf))
- Resets for a links in results; margin for error element ([6caba9c](https://github.com/perliedman/leaflet-control-geocoder/commit/6caba9c))
- Use a elements for results; make both a and li clickable ([d9c0d99](https://github.com/perliedman/leaflet-control-geocoder/commit/d9c0d99))

## 1.1.0 (2015-02-27)

- Add suggest method to Mapbox geocoder ([ae3abdc](https://github.com/perliedman/leaflet-control-geocoder/commit/ae3abdc))
- Adds a bower.json file ([3f625df](https://github.com/perliedman/leaflet-control-geocoder/commit/3f625df))
- Example for `geocodingQueryParams`. Close #32. ([95769fa](https://github.com/perliedman/leaflet-control-geocoder/commit/95769fa)), closes [#32](https://github.com/perliedman/leaflet-control-geocoder/issues/32)
- Prevent Esc key from collapsing control when collapsed option is set to false. ([621ca03](https://github.com/perliedman/leaflet-control-geocoder/commit/621ca03)), closes [#36](https://github.com/perliedman/leaflet-control-geocoder/issues/36)
- Replace explicit check for single click with check for not double click, to fix problems with IE. ([f2d480c](https://github.com/perliedman/leaflet-control-geocoder/commit/f2d480c)), closes [#23](https://github.com/perliedman/leaflet-control-geocoder/issues/23) [#35](https://github.com/perliedman/leaflet-control-geocoder/issues/35)
- s/shrugging of/shrugging off/ ([23e0add](https://github.com/perliedman/leaflet-control-geocoder/commit/23e0add))
- Update Control.Geocoder.js ([9c96756](https://github.com/perliedman/leaflet-control-geocoder/commit/9c96756))

## 1.0.0 (2014-10-12)

- Add Google support ([f5a4693](https://github.com/perliedman/leaflet-control-geocoder/commit/f5a4693))
- Added support for specifying extra URL parameters for Nominatim. Fix empty response. ([be1fdc1](https://github.com/perliedman/leaflet-control-geocoder/commit/be1fdc1)), closes [#15](https://github.com/perliedman/leaflet-control-geocoder/issues/15) [#13](https://github.com/perliedman/leaflet-control-geocoder/issues/13)
- Close control when escape is pressed ([f64ac41](https://github.com/perliedman/leaflet-control-geocoder/commit/f64ac41))
- Don't use innerHTML for result strings, use proper text nodes to ensure correct HTML entity encoding ([fde49c7](https://github.com/perliedman/leaflet-control-geocoder/commit/fde49c7)), closes [#19](https://github.com/perliedman/leaflet-control-geocoder/issues/19)
- Fix firefox border radius for form input, set vertical middle input position ([4fa4ae5](https://github.com/perliedman/leaflet-control-geocoder/commit/4fa4ae5))
- Fix L.DomUtil.create with showResultIcons=true ([c5f2cab](https://github.com/perliedman/leaflet-control-geocoder/commit/c5f2cab))
- Full list of providers ([fc9028a](https://github.com/perliedman/leaflet-control-geocoder/commit/fc9028a))
- Include address details for Nominatim ([758b338](https://github.com/perliedman/leaflet-control-geocoder/commit/758b338))
- Include notes on diversity in tech. Docs for new HTML formatting ([deeaa00](https://github.com/perliedman/leaflet-control-geocoder/commit/deeaa00))
- Mapbox support ([520cb2b](https://github.com/perliedman/leaflet-control-geocoder/commit/520cb2b))
- Prevent default. Closes #25. Thanks to @Yermo. ([1832557](https://github.com/perliedman/leaflet-control-geocoder/commit/1832557)), closes [#25](https://github.com/perliedman/leaflet-control-geocoder/issues/25)
- Re-added placeholder property ([cd983f4](https://github.com/perliedman/leaflet-control-geocoder/commit/cd983f4))
- Release v1.0.0 ([13309c5](https://github.com/perliedman/leaflet-control-geocoder/commit/13309c5))
- Removed window.location.protocol from service URLs, from accidentally merging 7e68366 ([aef636d](https://github.com/perliedman/leaflet-control-geocoder/commit/aef636d))
- Support for HTML formatted addresses in Nominatim ([c8afafa](https://github.com/perliedman/leaflet-control-geocoder/commit/c8afafa))
- Update Control.Geocoder.js ([de3ad07](https://github.com/perliedman/leaflet-control-geocoder/commit/de3ad07))
- Use protocol-relative urls when making requests ([7e68366](https://github.com/perliedman/leaflet-control-geocoder/commit/7e68366))
- Use tab indentation ([bdcc365](https://github.com/perliedman/leaflet-control-geocoder/commit/bdcc365))

## <small>0.2.1 (2014-03-12)</small>

- Add L.Control.Geocoder.MapQuest ([a52ea21](https://github.com/perliedman/leaflet-control-geocoder/commit/a52ea21))
- Better adaption to Leaflet 0.7's touch styling ([d12be7d](https://github.com/perliedman/leaflet-control-geocoder/commit/d12be7d))
- Conform with other widget on touch device ([b66367d](https://github.com/perliedman/leaflet-control-geocoder/commit/b66367d))
- Factory function ([64b6c36](https://github.com/perliedman/leaflet-control-geocoder/commit/64b6c36))
- More styling fixes for touch/mobile ([fbe08d0](https://github.com/perliedman/leaflet-control-geocoder/commit/fbe08d0))
- Move icon for correct placement when error message is shown ([42947d4](https://github.com/perliedman/leaflet-control-geocoder/commit/42947d4)), closes [#11](https://github.com/perliedman/leaflet-control-geocoder/issues/11)
- Nominatim service default URL ([b126152](https://github.com/perliedman/leaflet-control-geocoder/commit/b126152))
- Set \_container before calling expand. Clear results when one is selected, if necessary. ([756dc8e](https://github.com/perliedman/leaflet-control-geocoder/commit/756dc8e)), closes [#9](https://github.com/perliedman/leaflet-control-geocoder/issues/9)
- Switch to 0.7.2 in all examples, removing special IE stylesheet ([80f5351](https://github.com/perliedman/leaflet-control-geocoder/commit/80f5351))
- Test for alternative control position ([acbaf47](https://github.com/perliedman/leaflet-control-geocoder/commit/acbaf47))
- Use Leaflet 0.7.2 ([5190e70](https://github.com/perliedman/leaflet-control-geocoder/commit/5190e70))

## 0.2.0 (2014-02-24)

- Added reverse geocoding support ([9a0e966](https://github.com/perliedman/leaflet-control-geocoder/commit/9a0e966))
- fix keyboard not showing in Chrome and Firefox and Android ([adf26b0](https://github.com/perliedman/leaflet-control-geocoder/commit/adf26b0))
- Fixed syntax error ([c84ad63](https://github.com/perliedman/leaflet-control-geocoder/commit/c84ad63))
- Use L.DomUtil ([f141eba](https://github.com/perliedman/leaflet-control-geocoder/commit/f141eba))

## 0.1.0 (2014-02-16)

- Added .jshintrc ([93319b4](https://github.com/perliedman/leaflet-control-geocoder/commit/93319b4))
- Added class factories. Fixed missing commas. ([e0c8916](https://github.com/perliedman/leaflet-control-geocoder/commit/e0c8916))
- Added demo link ([640fad3](https://github.com/perliedman/leaflet-control-geocoder/commit/640fad3))
- Added L.Control.Geocoder.RaveGeo. Fixed some issue with setting geocoder and removed unused key argu ([edb1b73](https://github.com/perliedman/leaflet-control-geocoder/commit/edb1b73))
- Added LICENSE according to https://github.com/sa3m/leaflet-control-bing-geocoder/issues/6 ([352495d](https://github.com/perliedman/leaflet-control-geocoder/commit/352495d))
- Added optional icons for geocoding results, with option showResultIcons. Closes #4. ([d6acf6d](https://github.com/perliedman/leaflet-control-geocoder/commit/d6acf6d)), closes [#4](https://github.com/perliedman/leaflet-control-geocoder/issues/4)
- Added throbber ([02b2eda](https://github.com/perliedman/leaflet-control-geocoder/commit/02b2eda))
- Broke out geocoding lookup to separate classes. ([96c0031](https://github.com/perliedman/leaflet-control-geocoder/commit/96c0031))
- Collapse control when result is selected. Closes #2 ([0b2c04a](https://github.com/perliedman/leaflet-control-geocoder/commit/0b2c04a)), closes [#2](https://github.com/perliedman/leaflet-control-geocoder/issues/2)
- Configurable expand mode, click is now default ([c1eb9cf](https://github.com/perliedman/leaflet-control-geocoder/commit/c1eb9cf))
- Control styling ([a83e4ac](https://github.com/perliedman/leaflet-control-geocoder/commit/a83e4ac))
- CSS lint fixes ([c8ab4e9](https://github.com/perliedman/leaflet-control-geocoder/commit/c8ab4e9))
- Event refactor ([1b9c53a](https://github.com/perliedman/leaflet-control-geocoder/commit/1b9c53a))
- First real commit ([0a23299](https://github.com/perliedman/leaflet-control-geocoder/commit/0a23299))
- Fix code after renaming from BingGeocoder to Geocoder ([d8d28c6](https://github.com/perliedman/leaflet-control-geocoder/commit/d8d28c6))
- Fix text box on touch devices ([bdcd04e](https://github.com/perliedman/leaflet-control-geocoder/commit/bdcd04e)), closes [#3](https://github.com/perliedman/leaflet-control-geocoder/issues/3) [CloudMade/Leaflet#1163](https://github.com/CloudMade/Leaflet/issues/1163)
- Fixed formatting snafu ([d6d3a8b](https://github.com/perliedman/leaflet-control-geocoder/commit/d6d3a8b))
- Fixed issue where single geocode result crashed ([38755b4](https://github.com/perliedman/leaflet-control-geocoder/commit/38755b4))
- Fixed throbber ([0ed6b76](https://github.com/perliedman/leaflet-control-geocoder/commit/0ed6b76))
- Fixed title ([62a6ae0](https://github.com/perliedman/leaflet-control-geocoder/commit/62a6ae0))
- Improved docs and cleaned up API and code ([325977a](https://github.com/perliedman/leaflet-control-geocoder/commit/325977a))
- Include NPM module status ([b685a84](https://github.com/perliedman/leaflet-control-geocoder/commit/b685a84))
- Initial commit ([a246b91](https://github.com/perliedman/leaflet-control-geocoder/commit/a246b91))
- jshint fixes ([c7a5e75](https://github.com/perliedman/leaflet-control-geocoder/commit/c7a5e75))
- Keyboard selection ([99e9001](https://github.com/perliedman/leaflet-control-geocoder/commit/99e9001))
- Latest fixes from gh-pages ([dd0df9e](https://github.com/perliedman/leaflet-control-geocoder/commit/dd0df9e))
- Make geocoding provider easy to change by subclassing. Default to OSM/Nominatim provider and make Bi ([959821f](https://github.com/perliedman/leaflet-control-geocoder/commit/959821f))
- Module support and package.json ([c1fcd31](https://github.com/perliedman/leaflet-control-geocoder/commit/c1fcd31))
- options.callback->options.onGeocodeResult; display marker with result's name ([45cddc5](https://github.com/perliedman/leaflet-control-geocoder/commit/45cddc5))
- Refactor ([e22fb7d](https://github.com/perliedman/leaflet-control-geocoder/commit/e22fb7d))
- Remove alternatives when a selection is made ([a18d477](https://github.com/perliedman/leaflet-control-geocoder/commit/a18d477))
- Removed distributed leaflet version and use CDN version 0.6.4 ([5f32653](https://github.com/perliedman/leaflet-control-geocoder/commit/5f32653))
- Removed some stupid errors. ([e7cd8f0](https://github.com/perliedman/leaflet-control-geocoder/commit/e7cd8f0))
- Rename Control.BingGeocoder\* to Control.Geocoder ([427465b](https://github.com/perliedman/leaflet-control-geocoder/commit/427465b))
- Restructured layout, icon is a separate element and text can be selected without collapsing the cont ([34a679f](https://github.com/perliedman/leaflet-control-geocoder/commit/34a679f))
- Select input's text when expanded. Closes #1 ([72a1f6b](https://github.com/perliedman/leaflet-control-geocoder/commit/72a1f6b)), closes [#1](https://github.com/perliedman/leaflet-control-geocoder/issues/1)
- Show message when no matches are found instead of crashing ([9de1b76](https://github.com/perliedman/leaflet-control-geocoder/commit/9de1b76))
- Style update. ([8b68358](https://github.com/perliedman/leaflet-control-geocoder/commit/8b68358))
- Styling for alternatives ([aeb3fba](https://github.com/perliedman/leaflet-control-geocoder/commit/aeb3fba))
- Support for multiple results ([53de9c5](https://github.com/perliedman/leaflet-control-geocoder/commit/53de9c5))
- Updated docs, addressing #3 ([02e30c0](https://github.com/perliedman/leaflet-control-geocoder/commit/02e30c0)), closes [#3](https://github.com/perliedman/leaflet-control-geocoder/issues/3)
- Updated README.md and demo. ([8af6384](https://github.com/perliedman/leaflet-control-geocoder/commit/8af6384))
- Updated selection color to match Leaflet's theme better ([3c3e906](https://github.com/perliedman/leaflet-control-geocoder/commit/3c3e906))
- Updated styling and HTML with inspiration from https://github.com/Esri/esri-leaflet-geocoder ([1525058](https://github.com/perliedman/leaflet-control-geocoder/commit/1525058))
- Use all of the window for the map ([15ab25c](https://github.com/perliedman/leaflet-control-geocoder/commit/15ab25c))
- Use class factory instead of new ([5cec832](https://github.com/perliedman/leaflet-control-geocoder/commit/5cec832))
- Use escape to fix RaveGeo3's iso-8859 encoding ([83b72c1](https://github.com/perliedman/leaflet-control-geocoder/commit/83b72c1))
- Various CSS cleanup and fixes, many for touch. Fixes #7. ([e36a029](https://github.com/perliedman/leaflet-control-geocoder/commit/e36a029)), closes [#7](https://github.com/perliedman/leaflet-control-geocoder/issues/7)
- Bugfix: background missing. Updated example. ([4b2eb0d](https://github.com/perliedman/leaflet-control-geocoder/commit/4b2eb0d))
