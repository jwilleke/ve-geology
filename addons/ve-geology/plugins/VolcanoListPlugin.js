'use strict';

/**
 * VolcanoListPlugin
 *
 * Renders a filtered table of volcanoes inline in a wiki page.
 *
 * Usage:
 *   [{VolcanoList country='United States'}]
 *   [{VolcanoList region='Alaska Peninsula and Aleutian Islands' limit='20'}]
 *   [{VolcanoList epoch='Holocene' volcanoType='Stratovolcano' limit='10'}]
 *
 * @type {import('../../../src/managers/PluginManager').PluginObject}
 */
module.exports = {
  name: 'VolcanoList',

  /**
   * @param {{ engine: import('../../../src/types/WikiEngine').WikiEngine }} context
   * @param {Record<string, string>} params
   * @returns {string}
   */
  execute(context, params) {
    const mgr = context.engine.getManager('VolcanoDataManager');
    if (!mgr) {
      return '<span class="plugin-error">VolcanoList: VolcanoDataManager not available</span>';
    }

    const filters = {
      query:          params.query || undefined,
      country:        params.country || undefined,
      region:         params.region || undefined,
      volcanoType:    params.volcanoType || undefined,
      rockType:       params.rockType || undefined,
      tectonicSetting: params.tectonicSetting || undefined,
      epoch:          params.epoch || undefined,
      limit:          Number(params.limit) || 25,
      offset:         Number(params.offset) || 0,
    };

    const { volcanoes, total } = mgr.search(filters);

    if (volcanoes.length === 0) {
      return '<p class="vl-empty">No volcanoes match the specified criteria.</p>';
    }

    const rows = volcanoes.map(v => `
  <tr>
    <td>${esc(String(v.volcanoNumber))}</td>
    <td>${esc(v.volcanoName)}</td>
    <td>${esc(v.country)}</td>
    <td>${esc(v.volcanicRegion)}</td>
    <td>${esc(v.primaryVolcanoType)}</td>
    <td>${esc(v.epoch)}</td>
    <td>${v.elevation != null ? esc(String(v.elevation)) : ''}</td>
    <td>${esc(v.lastKnownEruption)}</td>
  </tr>`).join('');

    const showing = filters.offset + volcanoes.length;
    const caption = total > volcanoes.length
      ? `Showing ${filters.offset + 1}–${showing} of ${total}`
      : `${total} volcano${total !== 1 ? 's' : ''}`;

    return `
<div class="volcano-list">
  <table class="vl-table">
    <thead>
      <tr>
        <th>GVP #</th><th>Name</th><th>Country</th><th>Region</th>
        <th>Type</th><th>Epoch</th><th>Elev (m)</th><th>Last Eruption</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="vl-caption">${esc(caption)}</div>
</div>`.trim();
  }
};

/** @param {string} str */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
