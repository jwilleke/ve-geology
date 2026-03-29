# ve-geology Add-on

Volcano & geology data platform for ngdpbase, powered by
[Global Volcanism Program (GVP)](https://volcano.si.edu/) data.

## Features

- **VolcanoDataManager** — loads 2,661+ structured volcano and eruption records
- **`/api/ve-geology/search`** — faceted search API with pagination
- **`[{VolcanoInfobox number='...'}]`** — wiki infobox for a single volcano
- **`[{VolcanoList country='...'}]`** — inline filtered table
- **`[{VolcanoSearch}]`** — interactive live-search widget
- **`[{VolcanoMap}]`** — Leaflet map of filtered volcanoes

## Quick Start

### 1. Import data

```sh
# From the ve-geology repo root:
node addons/ve-geology/import/import-volcanoes.js
# Also fetch eruption records:
node addons/ve-geology/import/import-volcanoes.js --eruptions
# Also fetch global activity (currently erupting):
node addons/ve-geology/import/import-volcanoes.js --activity
# Custom data directory:
node addons/ve-geology/import/import-volcanoes.js --data-dir /path/to/data
```

### 2. Wire into ngdpbase

Add to `$FAST_STORAGE/config/app-custom-config.json` on your ngdpbase instance:

```json
{
  "ngdpbase.managers.addons-manager.addons-path": "/absolute/path/to/ve-geology/addons",
  "ngdpbase.addons.ve-geology.enabled": true,
  "ngdpbase.addons.ve-geology.dataPath": "./data/ve-geology"
}
```

### 3. Restart

```sh
./server.sh restart
```

Verify load status at `/admin` → Add-ons.

## Wiki Markup Reference

### VolcanoInfobox

```
[{VolcanoInfobox number='211060'}]
[{VolcanoInfobox number='211060' style='compact'}]
```

Parameters:
- `number` *(required)* — GVP volcano number
- `style` — `default` (full infobox) or `compact` (inline name span)

### VolcanoList

```
[{VolcanoList country='United States'}]
[{VolcanoList region='Alaska Peninsula and Aleutian Islands' limit='20'}]
[{VolcanoList epoch='Holocene' volcanoType='Stratovolcano'}]
```

Parameters: `query`, `country`, `region`, `volcanoType`, `rockType`,
`tectonicSetting`, `epoch`, `limit` (default 25), `offset`.

### VolcanoSearch

```
[{VolcanoSearch}]
[{VolcanoSearch defaultEpoch='Holocene' defaultLimit='50'}]
```

Renders a live search widget with dropdowns for country, region, and type.

### VolcanoMap

```
[{VolcanoMap}]
[{VolcanoMap country='Japan' height='500'}]
[{VolcanoMap epoch='Holocene' lat='35' lon='138' zoom='5'}]
```

Parameters: `country`, `region`, `volcanoType`, `epoch`,
`minElevation`, `maxElevation`, `limit` (default 5000),
`height` (px, default 450), `lat`, `lon`, `zoom` (Leaflet).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/ve-geology/search` | Search/filter volcanoes |
| GET | `/api/ve-geology/distinct/:field` | Distinct values for a field |
| GET | `/api/ve-geology/volcano/:number` | Single volcano by GVP number |
| GET | `/api/ve-geology/eruptions/:number` | Eruptions for a volcano |

### Search query parameters

`q`, `country`, `region`, `volcanoType`, `rockType`, `tectonicSetting`,
`epoch`, `minElevation`, `maxElevation`, `minLatitude`, `maxLatitude`,
`minLongitude`, `maxLongitude`, `limit` (default 100), `offset` (default 0).

## Structure

```
addons/ve-geology/
├── index.js                      ← AddonModule entry point
├── managers/
│   └── VolcanoDataManager.js     ← Loads & queries volcano/eruption data
├── plugins/
│   ├── VolcanoInfoboxPlugin.js   ← [{VolcanoInfobox number='...'}]
│   ├── VolcanoListPlugin.js      ← [{VolcanoList country='...'}]
│   ├── VolcanoSearchPlugin.js    ← [{VolcanoSearch}]
│   └── VolcanoMapPlugin.js       ← [{VolcanoMap}]
├── routes/
│   └── api.js                    ← /api/ve-geology/* endpoints
├── import/
│   └── import-volcanoes.js       ← GVP WFS API importer
├── data/                         ← volcanoes.json, eruptions.json (gitignored)
├── public/
│   └── css/
│       └── ve-geology.css        ← Served at /addons/ve-geology/css/...
└── README.md
```

## Further Reading

- [Add-on Development Guide](../../docs/platform/addon-development-guide.md) *(relative to ngdpbase)*
- [Platform Guide](../../docs/platform/ngdp-as-platform.md)
- [GVP Volcano data source](https://volcano.si.edu/)
