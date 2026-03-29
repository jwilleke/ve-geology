# ve-geology

Volcano and geology data platform built as an [ngdpbase](https://github.com/jwilleke/ngdpbase) add-on.
Powered by [Global Volcanism Program (GVP)](https://volcano.si.edu/) volcano data and
[USGS Earthquake Hazards Program](https://earthquake.usgs.gov/) feeds.

## What it does

- Imports 2,600+ GVP volcano and eruption records into a local JSON snapshot
- Imports recent USGS earthquake data and matches each event to the nearest volcano (within 50 km)
- Registers six wiki markup plugins for infoboxes, tables, search widgets, and Leaflet maps
- Seeds demo wiki pages into your ngdpbase instance automatically on load
- Exposes a REST API for all volcano and earthquake data

## Prerequisites

- [ngdpbase](https://github.com/jwilleke/ngdpbase) instance running (Node.js ≥ 18)
- Internet access for initial data import (GVP WFS API + USGS feeds)

## Setup

### 1. Clone and install

```sh
git clone https://github.com/jwilleke/ve-geology.git
cd ve-geology
npm install
```

### 2. Import data

```sh
# Volcanoes only (fastest)
npm run import

# Volcanoes + eruption records
npm run import:eruptions

# Volcanoes + eruptions + currently active
npm run import:all

# Earthquake data (M4.5+ past 7 days, matched to nearest volcano)
npm run import:earthquakes

# Earthquake data (M4.5+ past 30 days)
npm run import:earthquakes:month
```

Data is written to `addons/ve-geology/data/` (gitignored — re-run to refresh).

### 3. Wire to ngdpbase

Add to `$FAST_STORAGE/config/app-custom-config.json` on your ngdpbase instance:

```json
{
  "ngdpbase.managers.addons-manager.addons-path": "/absolute/path/to/ve-geology/addons",
  "ngdpbase.addons.ve-geology.enabled": true,
  "ngdpbase.addons.ve-geology.dataPath": "./data/ve-geology"
}
```

### 4. Restart ngdpbase

```sh
cd /path/to/ngdpbase
./server.sh restart
```

On startup the add-on seeds four demo wiki pages into your instance (only if they don't already exist):

| URL | Content |
|-----|---------|
| `/wiki/volcanoes` | VolcanoSearch + VolcanoMap |
| `/wiki/earthquakes` | EarthquakeList + EarthquakeMap |
| `/wiki/geology-demo` | All six plugins |
| `/wiki/japan-volcanoes` | Japan country view |

## Repository layout

```
ve-geology/
├── addons/
│   └── ve-geology/           ← ngdpbase add-on root
│       ├── index.js          ← AddonModule entry point
│       ├── managers/
│       │   ├── VolcanoDataManager.js
│       │   └── EarthquakeDataManager.js
│       ├── plugins/
│       │   ├── VolcanoInfoboxPlugin.js
│       │   ├── VolcanoListPlugin.js
│       │   ├── VolcanoSearchPlugin.js
│       │   ├── VolcanoMapPlugin.js
│       │   ├── EarthquakeListPlugin.js
│       │   └── EarthquakeMapPlugin.js
│       ├── routes/
│       │   └── api.js        ← REST API
│       ├── import/
│       │   ├── import-volcanoes.js
│       │   └── import-earthquakes.js
│       ├── pages/            ← Seeded into ngdpbase on load
│       ├── public/css/
│       │   └── ve-geology.css
│       └── README.md         ← Plugin and API reference
└── package.json              ← npm import scripts
```

## Data sources

| Source | URL |
|--------|-----|
| GVP Volcanoes (WFS) | https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows |
| USGS Earthquake feeds | https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary |
| Volcano detail pages | https://volcano.si.edu/volcano.cfm?vn={number} |

## Related

- [Plugin & API reference](addons/ve-geology/README.md)
- [ngdpbase platform guide](https://github.com/jwilleke/ngdpbase/blob/master/docs/platform/ngdp-as-platform.md)
- [ngdpbase add-on development guide](https://github.com/jwilleke/ngdpbase/blob/master/docs/platform/addon-development-guide.md)
