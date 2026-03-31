# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-31

### Added

- Initial addon scaffold — `register()` / `shutdown()` / `status()` lifecycle wired into ngdpbase `AddonsManager`
- **VolcanoDataManager** — loads GVP volcano and eruption snapshots from `volcanoes.json` / `eruptions.json`
- **EarthquakeDataManager** — loads USGS earthquake snapshot from `earthquakes.json`; tracks proximity to known volcanoes
- **HansDataManager** — loads USGS HANS alert snapshot from `activity.json` (optional; starts silently if absent)
- **VolcanoInfoboxPlugin** — infobox card for a single volcano; supports `default` and `compact` styles
- **VolcanoListPlugin** — filterable, paginated table of volcanoes (country, region, type, epoch, elevation)
- **VolcanoSearchPlugin** — interactive live-search widget with dropdown filters
- **VolcanoMapPlugin** — Leaflet map of volcanoes; red = Holocene, blue = Pleistocene
- **EarthquakeListPlugin** — filterable, paginated table of recent earthquakes with PAGER alert badges and tsunami flag
- **EarthquakeMapPlugin** — Leaflet map of earthquakes coloured by PAGER alert level; optional volcano overlay
- **HansAlertPlugin** — US volcano alert level table filterable by USGS observatory
- Client-side pagination (Previous / Next) on VolcanoList and EarthquakeList
- REST API at `/api/ve-geology/*` — volcano search/filter, single volcano, eruptions, earthquake search, earthquake near volcano, feed status
- GVP WFS import script (`import-volcanoes.js`) — Holocene + Pleistocene volcanoes, eruption records, global activity snapshot
- USGS earthquake import script (`import-earthquakes.js`) — multiple feeds (4.5-week default); Haversine proximity matching against volcano catalog
- USGS HANS import script (`import-hans.js`) — elevated volcanoes, daily synopsis, monitored count
- All import scripts export `runImport()` for programmatic use; CLI entry gated behind `require.main === module`
- **BackgroundJobManager integration** — registers `ve-geology.import-hans` and `ve-geology.import-earthquakes` jobs; polls on configurable intervals (default 10 min / 20 min); hot-reloads in-memory managers after each run; intervals cleared in `shutdown()`
- Config keys: `dataPath`, `hansIntervalMs`, `eqIntervalMs`
- Addon CSS served at `/addons/ve-geology/css/ve-geology.css`; registered with ngdpbase `AddonsManager`
- Seeded wiki pages: home, volcanoes, earthquakes, HANS alerts, Japan demo, geology demo, plugin guide, about
- Leaflet served locally (no external CDN dependency)
- Domain front page set as ngdpbase home page
- End-user plugin guide at `/wiki/ve-geology-plugins`
- Addon context page at `/wiki/ve-geology-about`
- ESLint + markdownlint + Prettier + Husky pre-commit hook

[1.0.0]: https://github.com/jwilleke/ve-geology/releases/tag/v1.0.0
