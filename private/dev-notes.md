# dev-nots

## 2026-03-30

In the configuration we need to have addons point to a different:
 "ngdpbase.front-page": "Welcome"

This page could be specififc to the domain for the addon

Create a page in this repository Called Valcanos and Earthquakes with some blurb about what this Site represents.

Update /Volumes/hd2A/workspaces/github/ngdpbase/data/config/app-custom-config.json to reflect that change.

I think we could have two types of addons.

- Domain based where the addon is the Primary Subject
- Additive addon where it just aguments the general operations

We could have both in some instnances

1. Verify the pages actually seeded
  After the restart, the four demo pages should now exist. Worth checking <http://jminim4:3333/volcanoes> and <http://jminim4:3333/geology-demo> actually render before doing
  anything else.

2. Admin panel — Add-ons section still missing
  You reported this twice before we moved on. The addon loads (API returns data), but the admin UI doesn't show an Add-ons section. That's a real UX gap — operators can't
   see what addons are loaded or their status.

3. Security vulnerabilities on ngdpbase
  The push output flagged 11 vulnerabilities (1 critical, 4 high) on the ngdpbase repo. Worth a look:
  gh api repos/jwilleke/ngdpbase/dependabot/alerts --jq '.[].security_vulnerability.package.name + " — " + .security_vulnerability.severity'

4. No README for ve-geology
  The addon has no README.md — install steps, config keys, what each plugin does, how to run the import scripts. Low priority but useful before anyone else tries to use
  it.

5. Pagination / large dataset handling
  The VolcanoList and EarthquakeList plugins currently dump full tables. With ~1,400 volcanoes and potentially thousands of earthquakes, that's going to be slow.
  Client-side pagination or a limit= param on the API routes would help.

6. Plugin [[syntax]] documentation
  There's no single reference showing all supported plugin tags and their options (e.g. [[VolcanoMap country="Japan"]]). A wiki page or the README would close that gap.

7. Install dependencies (if not done yet)
  cd /Volumes/hd2A/workspaces/github/ngdpbase && npm install
8. Start ngdpbase
  ./server.sh start
9. Import volcano data
  cd /Volumes/hd2A/workspaces/github/ve-geology && npm run import:all
10. Restart ngdpbase to load the ve-geology addon
  cd /Volumes/hd2A/workspaces/github/ngdpbase && ./server.sh restart

    You can now use the wiki plugins on any page, e.g.:

- [{VolcanoSearch}] — live search widget
- [{VolcanoMap}] — world map of all volcanoes
- [{VolcanoInfobox number='210010'}] — infobox for West Eifel
- [{VolcanoList country='Japan' limit='10'}] — filtered table
