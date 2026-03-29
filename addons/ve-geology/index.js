'use strict';

/**
 * ve-geology Add-on
 *
 * Volcano & geology data platform built on ngdpbase.
 * Loads GVP volcano and eruption data, exposes search/filter API routes,
 * and registers wiki markup plugins for infoboxes, lists, and maps.
 *
 * Wire into your ngdpbase instance config:
 *   "ngdpbase.managers.addons-manager.addons-path": "/path/to/ve-geology/addons",
 *   "ngdpbase.addons.ve-geology.enabled": true,
 *   "ngdpbase.addons.ve-geology.dataPath": "./data/ve-geology"
 *
 * Import data first:
 *   node addons/ve-geology/import/import-volcanoes.js
 *   node addons/ve-geology/import/import-volcanoes.js --eruptions
 *   node addons/ve-geology/import/import-volcanoes.js --activity
 *
 * @type {import('../../src/managers/AddonsManager').AddonModule}
 */

const path = require('path');
const express = require('express');

const VolcanoDataManager = require('./managers/VolcanoDataManager');
const VolcanoInfoboxPlugin = require('./plugins/VolcanoInfoboxPlugin');
const VolcanoListPlugin = require('./plugins/VolcanoListPlugin');
const VolcanoSearchPlugin = require('./plugins/VolcanoSearchPlugin');
const VolcanoMapPlugin = require('./plugins/VolcanoMapPlugin');

/** @type {VolcanoDataManager | null} */
let dataManager = null;

module.exports = {
  name: 've-geology',
  version: '1.0.0',
  description: 'Volcano & geology data platform — GVP structured records, search, infoboxes, maps',
  author: 'jwilleke',
  dependencies: [],

  /**
   * @param {import('../../src/types/WikiEngine').WikiEngine} engine
   * @param {Record<string, unknown>} config
   */
  async register(engine, config) {
    // ── 1. Initialize data manager ───────────────────────────────────────────
    const dataPath = String(config.dataPath || './data/ve-geology');
    dataManager = new VolcanoDataManager(dataPath);
    await dataManager.load();
    engine.registerManager('VolcanoDataManager', dataManager);

    // ── 2. Register markup plugins ───────────────────────────────────────────
    const pluginManager = engine.getManager('PluginManager');
    if (pluginManager) {
      await pluginManager.registerPlugin('VolcanoInfobox', VolcanoInfoboxPlugin);
      await pluginManager.registerPlugin('VolcanoList', VolcanoListPlugin);
      await pluginManager.registerPlugin('VolcanoSearch', VolcanoSearchPlugin);
      await pluginManager.registerPlugin('VolcanoMap', VolcanoMapPlugin);
    }

    // ── 3. Serve static assets ───────────────────────────────────────────────
    engine.app.use(
      '/addons/ve-geology',
      express.static(path.join(__dirname, 'public'))
    );

    // ── 4. Register stylesheet ───────────────────────────────────────────────
    const addonsManager = engine.getManager('AddonsManager');
    if (addonsManager) {
      addonsManager.registerStylesheet(
        '/addons/ve-geology/css/ve-geology.css',
        've-geology'
      );
    }

    // ── 5. Mount API routes ──────────────────────────────────────────────────
    const apiRouter = require('./routes/api')(engine, config);
    engine.app.use('/api/ve-geology', apiRouter);

    // ── 6. Announce optional capability ─────────────────────────────────────
    engine.setCapability('ve-geology', true);
  },

  async status() {
    const volcanoCount = dataManager ? dataManager.volcanoCount() : 0;
    const eruptionCount = dataManager ? dataManager.eruptionCount() : 0;
    return {
      healthy: true,
      records: volcanoCount,
      message: `${volcanoCount} volcanoes, ${eruptionCount} eruptions loaded`
    };
  },

  async shutdown() {
    dataManager = null;
  }
};
