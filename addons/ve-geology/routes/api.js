'use strict';

const express = require('express');

/**
 * API routes for the ve-geology add-on.
 * Mounted at /api/ve-geology in register().
 *
 * Endpoints:
 *   GET /api/ve-geology/search          Search/filter volcanoes
 *   GET /api/ve-geology/distinct/:field  Distinct values for a field
 *   GET /api/ve-geology/volcano/:number  Single volcano by GVP number
 *   GET /api/ve-geology/eruptions/:number  Eruptions for a volcano
 *
 * @param {import('../../../src/types/WikiEngine').WikiEngine} engine
 * @param {Record<string, unknown>} _config
 * @returns {express.Router}
 */
module.exports = function apiRoutes(engine, _config) {
  const router = express.Router();

  // GET /api/ve-geology/search?q=&country=&region=&volcanoType=&rockType=
  //   &tectonicSetting=&epoch=&minElevation=&maxElevation=
  //   &minLatitude=&maxLatitude=&minLongitude=&maxLongitude=
  //   &limit=100&offset=0
  router.get('/search', (req, res) => {
    try {
      const mgr = engine.getManager('VolcanoDataManager');
      if (!mgr) return res.status(503).json({ error: 'VolcanoDataManager not available' });

      const filters = parseFilters(req.query);
      const result = mgr.search(filters);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  });

  // GET /api/ve-geology/distinct/:field
  router.get('/distinct/:field', (req, res) => {
    try {
      const mgr = engine.getManager('VolcanoDataManager');
      if (!mgr) return res.status(503).json({ error: 'VolcanoDataManager not available' });

      const values = mgr.distinctValues(req.params.field);
      res.json({ field: req.params.field, values });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  });

  // GET /api/ve-geology/volcano/:number
  router.get('/volcano/:number', (req, res) => {
    const mgr = engine.getManager('VolcanoDataManager');
    if (!mgr) return res.status(503).json({ error: 'VolcanoDataManager not available' });

    const volcano = mgr.getByNumber(Number(req.params.number));
    if (!volcano) return res.status(404).json({ error: 'Volcano not found' });
    res.json(volcano);
  });

  // GET /api/ve-geology/eruptions/:number
  router.get('/eruptions/:number', (req, res) => {
    const mgr = engine.getManager('VolcanoDataManager');
    if (!mgr) return res.status(503).json({ error: 'VolcanoDataManager not available' });

    const eruptions = mgr.getEruptions(Number(req.params.number));
    res.json({ volcanoNumber: Number(req.params.number), eruptions });
  });

  return router;
};

/** @param {Record<string, unknown>} q */
function parseFilters(q) {
  const filters = {};
  if (q.q)               filters.query = String(q.q);
  if (q.query)           filters.query = String(q.query);
  if (q.country)         filters.country = String(q.country);
  if (q.region)          filters.region = String(q.region);
  if (q.volcanoType)     filters.volcanoType = String(q.volcanoType);
  if (q.rockType)        filters.rockType = String(q.rockType);
  if (q.tectonicSetting) filters.tectonicSetting = String(q.tectonicSetting);
  if (q.epoch)           filters.epoch = String(q.epoch);
  if (q.minElevation)    filters.minElevation = Number(q.minElevation);
  if (q.maxElevation)    filters.maxElevation = Number(q.maxElevation);
  if (q.minLatitude)     filters.minLatitude = Number(q.minLatitude);
  if (q.maxLatitude)     filters.maxLatitude = Number(q.maxLatitude);
  if (q.minLongitude)    filters.minLongitude = Number(q.minLongitude);
  if (q.maxLongitude)    filters.maxLongitude = Number(q.maxLongitude);
  if (q.limit)           filters.limit = Number(q.limit);
  if (q.offset)          filters.offset = Number(q.offset);
  return filters;
}
