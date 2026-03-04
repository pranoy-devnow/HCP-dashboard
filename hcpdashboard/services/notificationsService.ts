/**
 * Notifications data and read state. All notification reads/writes go through this service.
 * When the backend is ready, replace with API calls (e.g. GET /api/notifications, PATCH read state).
 */

import type { NotificationItem } from "@/types/notifications"
import {
  notifications as libNotifications,
  loadReadIds as libLoadReadIds,
  saveReadIds as libSaveReadIds,
} from "@/lib/notifications-data"

/** Return all notifications. For now uses in-memory data; later: GET /api/notifications */
export function getNotifications(): NotificationItem[] {
  try {
    return libNotifications
  } catch (err) {
    console.error("[notificationsService] getNotifications failed:", err)
    return []
  }
}

/** Load the set of read notification IDs (e.g. from localStorage). Later: from API or session. */
export function loadReadIds(): Set<string> {
  try {
    return libLoadReadIds()
  } catch (err) {
    console.error("[notificationsService] loadReadIds failed:", err)
    return new Set()
  }
}

/** Persist read notification IDs. Later: PATCH /api/notifications/read */
export function saveReadIds(ids: Set<string>): void {
  try {
    libSaveReadIds(ids)
  } catch (err) {
    console.error("[notificationsService] saveReadIds failed:", err)
  }
}
