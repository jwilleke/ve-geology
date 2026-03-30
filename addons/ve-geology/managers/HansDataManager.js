'use strict';

const fs   = require('fs');
const path = require('path');

/**
 * HansDataManager
 *
 * Loads the USGS HANS activity snapshot (activity.json) and provides
 * alert lookups keyed by GVP volcano number.
 *
 * Snapshot shape:
 *   { fetchedUtc, elevatedVolcanoes[], monitoredCount, elevatedCount }
 *
 * Each elevated volcano:
 *   volcanoNumber, volcanoName, alertLevel, colorCode, synopsis,
 *   observatory, observatoryAbbr, sentUtc, noticeUrl,
 *   previousAlertLevel, previousColorCode
 */
class HansDataManager {
  /** @param {string} dataPath  Directory containing activity.json */
  constructor(dataPath) {
    this.dataPath         = dataPath;
    /** @type {Map<string, object>} volcanoNumber → alert record */
    this.alertsByNumber   = new Map();
    this.fetchedUtc       = null;
    this.monitoredCount   = 0;
    this.elevatedCount    = 0;
  }

  async load() {
    const file = path.join(this.dataPath, 'activity.json');
    if (!fs.existsSync(file)) return;

    const snapshot          = JSON.parse(fs.readFileSync(file, 'utf8'));
    this.fetchedUtc         = snapshot.fetchedUtc   || null;
    this.monitoredCount     = snapshot.monitoredCount || 0;
    this.elevatedCount      = snapshot.elevatedCount  || 0;

    this.alertsByNumber.clear();
    for (const alert of (snapshot.elevatedVolcanoes || [])) {
      if (alert.volcanoNumber) {
        this.alertsByNumber.set(String(alert.volcanoNumber), alert);
      }
    }
  }

  /** @returns {number} */
  count() { return this.alertsByNumber.size; }

  /**
   * Get alert for a single volcano by GVP number.
   * Returns null if the volcano is not currently elevated.
   * @param {string|number} volcanoNumber
   * @returns {object|null}
   */
  getAlert(volcanoNumber) {
    return this.alertsByNumber.get(String(volcanoNumber)) || null;
  }

  /**
   * All currently elevated volcanoes, optionally filtered.
   * @param {{ alertLevel?: string, colorCode?: string, observatory?: string }} [filters]
   * @returns {object[]}
   */
  getElevated(filters = {}) {
    let results = [...this.alertsByNumber.values()];

    if (filters.alertLevel) {
      results = results.filter(a =>
        a.alertLevel?.toUpperCase() === filters.alertLevel.toUpperCase()
      );
    }
    if (filters.colorCode) {
      results = results.filter(a =>
        a.colorCode?.toUpperCase() === filters.colorCode.toUpperCase()
      );
    }
    if (filters.observatory) {
      results = results.filter(a =>
        a.observatoryAbbr?.toLowerCase() === filters.observatory.toLowerCase()
      );
    }

    return results;
  }

  /** @returns {object} Status summary for AddonsManager.status() */
  status() {
    return {
      fetchedUtc:     this.fetchedUtc,
      monitoredCount: this.monitoredCount,
      elevatedCount:  this.elevatedCount,
    };
  }
}

module.exports = HansDataManager;
