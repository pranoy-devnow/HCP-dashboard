/**
 * Tracks opened pending consult rows on My Day. Replace with API when backend exists.
 */

import { getPriorityCases } from "@/lib/my-day-helpers"
import {
  loadPendingConsultReadIds as libLoad,
  savePendingConsultReadIds as libSave,
} from "@/lib/pending-consult-read-data"
import { getCaseFiles } from "@/services/caseFilesService"

/** Default unread count after sidebar Reset (first N priority cases stay “new”). */
export const MY_DAY_DEMO_PENDING_UNREAD = 2

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

/**
 * Demo / QA: mark every priority case after the first `unreadCount` as read so My Day shows that many unread pending consults.
 */
export function resetPendingConsultsToUnreadCount(
  unreadCount: number = MY_DAY_DEMO_PENDING_UNREAD
): void {
  try {
    const priority = getPriorityCases(getCaseFiles(), new Date())
    const readIds = new Set(priority.slice(unreadCount).map((f) => f.id))
    libSave(readIds)
  } catch (err) {
    console.error(
      "[pendingConsultReadService] resetPendingConsultsToUnreadCount failed:",
      err
    )
  }
}
