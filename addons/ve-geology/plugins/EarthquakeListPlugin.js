'use strict';

/**
 * EarthquakeListPlugin
 *
 * Renders a filtered table of recent earthquakes.
 *
 * Usage:
 *   [{EarthquakeList}]
 *   [{EarthquakeList minMagnitude='5' nearVolcano='true'}]
 *   [{EarthquakeList tsunamiOnly='true' limit='10'}]
 *
 * @type {import('../../../src/managers/PluginManager').PluginObject}
 */
module.exports = {
  name: 'EarthquakeList',

  execute(context, params) {
    const mgr = context.engine.getManager('EarthquakeDataManager');
    if (!mgr) {
      return '<span class="plugin-error">EarthquakeList: EarthquakeDataManager not available</span>';
    }

    const filters = {
      minMagnitude:  params.minMagnitude  ? Number(params.minMagnitude)  : undefined,
      maxMagnitude:  params.maxMagnitude  ? Number(params.maxMagnitude)  : undefined,
      minDepth:      params.minDepth      ? Number(params.minDepth)      : undefined,
      maxDepth:      params.maxDepth      ? Number(params.maxDepth)      : undefined,
      nearVolcano:   params.nearVolcano   === 'true' ? true : undefined,
      tsunamiOnly:   params.tsunamiOnly   === 'true' ? true : undefined,
      alert:         params.alert         || undefined,
      volcanoNumber: params.volcanoNumber ? Number(params.volcanoNumber) : undefined,
      limit:         Number(params.limit)  || 25,
      offset:        Number(params.offset) || 0,
    };

    const { earthquakes, total } = mgr.search(filters);

    if (earthquakes.length === 0) {
      return '<p class="eq-empty">No earthquakes match the specified criteria.</p>';
    }

    const rows = earthquakes.map(e => {
      const alert = e.alert ? `<span class="eq-alert eq-alert-${esc(e.alert)}">${esc(e.alert.toUpperCase())}</span>` : '';
      const tsunami = e.tsunami ? '<span class="eq-tsunami">🌊</span>' : '';
      const volcano = e.nearestVolcano
        ? `${esc(e.nearestVolcano.volcanoName)} (${e.nearestVolcano.distanceKm} km)`
        : '';
      return `<tr>
        <td><strong>M${esc(String(e.magnitude.toFixed(1)))}</strong></td>
        <td>${esc(e.place)}</td>
        <td>${esc(new Date(e.time).toUTCString().slice(0, 16))}</td>
        <td>${esc(String(e.depth))} km</td>
        <td>${alert}${tsunami}</td>
        <td>${volcano}</td>
      </tr>`;
    }).join('');

    const showing = (filters.offset || 0) + earthquakes.length;
    const caption = total > earthquakes.length
      ? `Showing ${(filters.offset || 0) + 1}–${showing} of ${total}`
      : `${total} earthquake${total !== 1 ? 's' : ''}`;

    return `
<div class="earthquake-list">
  <table class="eq-table">
    <thead>
      <tr><th>Mag</th><th>Location</th><th>Time (UTC)</th><th>Depth</th><th>Alert</th><th>Nearest Volcano</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="eq-caption">${esc(caption)}</div>
</div>`.trim();
  }
};

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
