/**
 * Tracks opened pending consult rows on My Day. Replace with API when backend exists.
 */

import {
  loadPendingConsultReadIds as libLoad,
  savePendingConsultReadIds as libSave,
} from "@/lib/pending-consult-read-data"

export function loadPendingConsultReadIds(): Set<string> {
  try {
    return libLoad()
  } catch (err) {
    console.error("[pendingConsultReadService] loadPendingConsultReadIds failed:", err)
    return new Set()
  }
}

export function markPendingConsultRead(caseId: string): void {
  try {
    const ids = libLoad()
    ids.add(caseId)
    libSave(ids)
  } catch (err) {
    console.error("[pendingConsultReadService] markPendingConsultRead failed:", caseId, err)
  }
}
