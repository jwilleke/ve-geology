# Project Log

This document tracks ongoing work and session history for the ve-geology project.

## Format

```
### yyyy-MM-dd-##

- **Agent:** [Claude/Gemini/Other]
- **Subject:** [Brief description]
- **Work Done:**
  - [task 1]
  - [task 2]
- **Commits:** [hash list]
- **Files Modified:**
  - [file1.js]
  - [file2.md]
```

## Current Status

- **Phase:** Active development — core addon complete, data sources expanding
- **Build Status:** No build step (CommonJS JS). Lint passing (`npm run lint`)
- **Last Updated:** 2026-03-30
- **Overall Health:** Stable. ngdpbase running on port 3333. 4 data sources integrated. Domain home page live at `/`.

## Next Steps

- Implement periodic data refresh via BackgroundJobManager (ve-geology#8)
- Add end-user plugin documentation wiki pages (ve-geology#9)
- Add pagination to VolcanoList and EarthquakeList (ve-geology#1)
- Implement `system-category: addon` in ngdpbase seedAddonPages (ngdpbase#414)
- Implement Domain vs Additive addon type distinction (ngdpbase#415)
- Admin panel Add-ons section (ngdpbase#412)

---

## Session Logs

### 2026-03-30-03

- **Agent:** Claude Sonnet 4.6
- **Subject:** Fix domain home page not visible at root URL
- **Work Done:**
  - Diagnosed root cause: `WikiRoutes.homePage()` hardcoded `res.redirect('/view/Welcome')` — never read `ngdpbase.front-page` config
  - Fixed `homePage()` to read `ngdpbase.front-page` config, defaulting to `Welcome`
  - Filed and fixed ngdpbase#416
  - Rebuilt ngdpbase and restarted — `/` now redirects to `/view/volcanoes-and-earthquakes`
  - Verified home page renders with VolcanoMap, EarthquakeList, and HansAlerts plugins
- **Commits:** `f1915e2e` (ngdpbase)
- **Files Modified:**
  - `ngdpbase/src/routes/WikiRoutes.ts`

### 2026-03-30-02

- **Agent:** Claude Sonnet 4.6
- **Subject:** Domain front page, addon type architecture, DRY docs, project template integration
- **Work Done:**
  - Created `ve-geology-home.md` — domain front page (slug: `volcanoes-and-earthquakes`) with VolcanoMap, EarthquakeList, HansAlerts, and data source table
  - Updated `ngdpbase/data/config/app-custom-config.json` — set `ngdpbase.front-page: volcanoes-and-earthquakes`
  - Applied `mjs-project-template` via `integrate_template.sh` (Normal copy mode) — added ESLint, Prettier, Husky, markdownlint, GitHub Actions CI, `.claude/` commands, `ARCHITECTURE.md`, `CODE_STANDARDS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SETUP.md`, `AGENTS.md`, `DOCUMENTATION.md`
  - Merged `package.json` and `.gitignore` manually (template + ve-geology-specific entries preserved)
  - Fixed `.eslintrc.json` — removed TypeScript project-aware rules incompatible with JS-only addon code
  - Upgraded `@typescript-eslint` to v8 to resolve devDependency vulnerabilities
  - Fixed markdown lint errors across wiki pages (MD025, MD036, MD060 disabled)
  - Populated `AGENTS.md` with ve-geology-specific content — commands, architecture, key decisions, open issues, agent autonomy matrix
  - Created `CLAUDE.md` redirect to `AGENTS.md`
  - Populated `ARCHITECTURE.md` — addon lifecycle, data pipeline, tech stack, guide for adding new data sources
  - Populated `SETUP.md` — prereqs, 5-step setup, verification, troubleshooting
  - DRY pass across all docs — each doc owns one topic, others link to SSoT
  - Filed ngdpbase#414 — `system-category: addon` for addon-seeded pages
  - Filed ngdpbase#415 — Domain vs Additive addon type distinction with `domainDefaults()` proposal
  - Filed ve-geology#9 — end-user plugin documentation (supersedes #2)
  - Closed ve-geology#2 (superseded by #9)
- **Commits:** `507e257`, `679f204`, `df2ceb0`, `0846fa1`
- **Files Modified:**
  - `addons/ve-geology/pages/ve-geology-home.md` (new)
  - `AGENTS.md`, `CLAUDE.md` (new), `ARCHITECTURE.md`, `SETUP.md`
  - `README.md`, `package.json`, `.gitignore`, `.eslintrc.json`, `.markdownlint.json`
  - `addons/ve-geology/pages/ve-geology-*.md` (lint fixes)
  - All template files added (`.editorconfig`, `.husky/`, `.github/`, `.claude/`, `docs/`, `tools/`, etc.)

### 2026-03-30-01

- **Agent:** Claude Sonnet 4.6
- **Subject:** USGS HANS API integration, security fixes, GitHub issue tracking
- **Work Done:**
  - Created `import/import-hans.js` — fetches elevated + monitored volcanoes and daily synopsis, writes `activity.json`
  - Created `HansDataManager.js` — loads snapshot, lookup by GVP volcano number, filter by alert level/color code/observatory
  - Created `HansAlertPlugin.js` — `[{HansAlerts}]` plugin with ORANGE/YELLOW/RED/GREEN color-coded badges, supports `alertLevel=`, `colorCode=`, `observatory=` filters
  - Added HANS API routes: `/hans/elevated`, `/hans/volcano/:number`, `/hans/status`
  - Wired HansDataManager and HansAlertPlugin into `index.js` register/status/shutdown
  - Added HANS CSS styles to `ve-geology.css`
  - Created `pages/ve-geology-hans.md` (slug: `volcano-alerts`)
  - Added `npm run import:hans` script
  - Live test: Kilauea WATCH/ORANGE, Great Sitkin WATCH/ORANGE, Atka ADVISORY/YELLOW, Shishaldin ADVISORY/YELLOW
  - Fixed ngdpbase security vulnerabilities: handlebars 4.7.9, path-to-regexp 8.4.0, brace-expansion 2.0.3, yaml 2.8.3 via `npm update`
  - Filed and closed ngdpbase#413 (security)
  - Filed ve-geology#3 (HANS) — closed on completion
  - Filed ve-geology#4 (NASA FIRMS), #5 (VAACs), #6 (satellite monitoring), #7 (VolcanoDiscovery)
  - Filed ve-geology#8 (periodic refresh via BackgroundJobManager)
  - Filed ngdpbase#412 (admin addons panel)
  - Audited all data sources vs volcano-lists reference docs
  - Created root `README.md` and updated `addons/ve-geology/README.md` with earthquake and HANS content
- **Commits:** `b89cc91`, `52c23cf`, `905469e1` (ngdpbase)
- **Files Modified:**
  - `addons/ve-geology/import/import-hans.js` (new)
  - `addons/ve-geology/managers/HansDataManager.js` (new)
  - `addons/ve-geology/plugins/HansAlertPlugin.js` (new)
  - `addons/ve-geology/pages/ve-geology-hans.md` (new)
  - `addons/ve-geology/routes/api.js`
  - `addons/ve-geology/index.js`
  - `addons/ve-geology/public/css/ve-geology.css`
  - `package.json`
  - `README.md` (new), `addons/ve-geology/README.md`
  - `ngdpbase/package-lock.json` (security fixes)

### 2026-03-29-01

- **Agent:** Claude Sonnet 4.6
- **Subject:** Initial scaffold, GVP + earthquake data, plugins, wiki pages, favicon, bug fixes
- **Work Done:**
  - Scaffolded ve-geology addon following ngdpbase `addons/template/` pattern
  - Created `VolcanoDataManager.js` — loads volcanoes.json + eruptions.json, search/filter/distinct
  - Created `EarthquakeDataManager.js` — loads earthquakes.json, Haversine proximity matching
  - Created 6 plugins: `VolcanoInfobox`, `VolcanoList`, `VolcanoSearch`, `VolcanoMap`, `EarthquakeList`, `EarthquakeMap`
  - Created `routes/api.js` — volcano search, distinct, single volcano, eruptions, earthquake search, near-volcano, status
  - Created `import/import-volcanoes.js` — GVP WFS API, Holocene + Pleistocene, `--eruptions`, `--activity` flags
  - Created `import/import-earthquakes.js` — USGS feeds, Haversine proximity, `--feed=` flag
  - Added GVP number links to Smithsonian (`https://volcano.si.edu/volcano.cfm?vn=`)
  - Created 4 demo wiki pages in `addons/ve-geology/pages/` (volcanoes, earthquakes, demo, japan)
  - Set ngdpbase to port 3333
  - Updated volcano theme favicon (SVG with radial glow, lava sparks, cone gradient)
  - Fixed ngdpbase bugs during development:
    - ngdpbase#407 — external addon repos need own `package.json` + `npm install`
    - ngdpbase#408 — `getAddonConfig()` rewritten to scan flat dot-notation keys via `getAllProperties()`
    - ngdpbase#409 — favicon override fixed via `getCustomProperty()` in ConfigurationManager
    - ngdpbase#410 — `AddonsManager.seedAddonPages()` implemented (Option B for addon wiki pages)
  - Added `ConfigurationManager.getCustomProperty()` — returns value only if explicitly set in custom config
  - Added `getAllProperties()` to ConfigurationManager
  - Updated `header.ejs` for SVG favicon `type` attribute
  - Completed ngdpbase install wizard, imported all data, verified API responses
- **Commits:** `ca8eae0`, `2e10640`, `5f1c215`, `c94f4b2`
- **Files Modified:**
  - `addons/ve-geology/index.js` (new)
  - `addons/ve-geology/managers/VolcanoDataManager.js` (new)
  - `addons/ve-geology/managers/EarthquakeDataManager.js` (new)
  - `addons/ve-geology/plugins/*.js` (6 new plugins)
  - `addons/ve-geology/routes/api.js` (new)
  - `addons/ve-geology/import/import-volcanoes.js` (new)
  - `addons/ve-geology/import/import-earthquakes.js` (new)
  - `addons/ve-geology/public/css/ve-geology.css` (new)
  - `addons/ve-geology/pages/*.md` (4 new pages)
  - `package.json`
  - `ngdpbase/src/managers/AddonsManager.ts`
  - `ngdpbase/src/managers/ConfigurationManager.ts`
  - `ngdpbase/src/routes/WikiRoutes.ts`
  - `ngdpbase/views/header.ejs`
  - `ngdpbase/themes/volcano/assets/favicon.svg`
  - `ngdpbase/data/config/app-custom-config.json`
