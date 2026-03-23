/**
 * Patient-scoped clinical alerts. All alert reads/writes go through this service.
 * When the backend is ready, replace with API calls (e.g. GET /api/alerts, PATCH read state).
 */

import type { Alert } from "@/types/alerts"
import {
  alerts as libAlerts,
  loadAlertsReadIds as libLoadReadIds,
  saveAlertsReadIds as libSaveReadIds,
} from "@/lib/alerts-data"

/** Return all alerts. For now uses in-memory data; later: GET /api/alerts */
export function getAlerts(): Alert[] {
  try {
    return libAlerts
  } catch (err) {
    console.error("[alertsService] getAlerts failed:", err)
    return []
  }
}

/** Return alerts for a single case file. */
export function getAlertsByCaseId(caseId: string): Alert[] {
  try {
    return libAlerts.filter((a) => a.caseId === caseId)
  } catch (err) {
    console.error("[alertsService] getAlertsByCaseId failed:", caseId, err)
    return []
  }
}

/** Load the set of read alert IDs (client-only). */
export function loadAlertsReadIds(): Set<string> {
  try {
    return libLoadReadIds()
  } catch (err) {
    console.error("[alertsService] loadAlertsReadIds failed:", err)
    return new Set()
  }
}

/** Mark a single alert as read by adding its id to persisted read set. */
export function markAlertRead(id: string): void {
  try {
    const ids = libLoadReadIds()
    ids.add(id)
    libSaveReadIds(ids)
  } catch (err) {
    console.error("[alertsService] markAlertRead failed:", id, err)
  }
}

/** Persist read alert IDs. */
export function saveAlertsReadIds(ids: Set<string>): void {
  try {
    libSaveReadIds(ids)
  } catch (err) {
    console.error("[alertsService] saveAlertsReadIds failed:", err)
  }
}
