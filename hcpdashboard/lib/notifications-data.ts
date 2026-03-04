"use client"

import { useSyncExternalStore } from "react"
import type { NotificationItem } from "@/types/notifications"
import { caseFiles, babyTitle } from "@/lib/case-files-data"

export const STORAGE_KEY_READ_IDS = "hcp-notifications-read-ids"

/** Read state is stored in localStorage so it persists across tabs; we fire a custom event on write so the sidebar unread badge and notification list can re-sync without polling. */
export function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY_READ_IDS)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

/** Persist read IDs and notify listeners (e.g. useUnreadNotificationCount) so the badge and list update in the same tab without a full reload. */
export function saveReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY_READ_IDS, JSON.stringify([...ids]))
    window.dispatchEvent(new CustomEvent("hcp-notifications-read-changed"))
  } catch {
    // ignore
  }
}

const caseOptions = caseFiles.map((f) => ({ caseId: f.id, caseLabel: babyTitle(f) }))

export const notifications: NotificationItem[] = [
  { id: "1", title: "Personalized Pumping Plan", type: "checklist", status: "pending", severity: "high", timestamp: "Just now", caseId: caseOptions[0].caseId, caseLabel: caseOptions[0].caseLabel, timeRange: "6-12", checklistItemId: "19" },
  { id: "2", title: "First pump: assisted checklist", type: "checklist", status: "pending", severity: "high", timestamp: "15 minutes ago", caseId: caseOptions[0].caseId, caseLabel: caseOptions[0].caseLabel, timeRange: "0-6", checklistItemId: "4" },
  { id: "3", title: "Assisted Pumping Session", type: "checklist", status: "pending", severity: "medium", timestamp: "30 minutes ago", caseId: caseOptions[1].caseId, caseLabel: caseOptions[1].caseLabel, timeRange: "6-12", checklistItemId: "16" },
  { id: "4", title: "First pump: assisted checklist", type: "checklist", status: "pending", severity: "medium", timestamp: "45 minutes ago", caseId: caseOptions[1].caseId, caseLabel: caseOptions[1].caseLabel, timeRange: "0-6", checklistItemId: "4" },
  { id: "5", title: "Confirm case (Validate patient willingness)", type: "checklist", status: "pending", severity: "low", timestamp: "1 hour ago", caseId: caseOptions[2].caseId, caseLabel: caseOptions[2].caseLabel, timeRange: "0-6", checklistItemId: "2" },
  { id: "6", title: "New case logged", type: "case", status: "completed", severity: "low", timestamp: "2 hours ago", caseId: caseOptions[2].caseId, caseLabel: caseOptions[2].caseLabel },
  { id: "7", title: "Follow-Up & PP2 Preparation", type: "checklist", status: "completed", timestamp: "Yesterday, 3:45 PM", caseId: caseOptions[3].caseId, caseLabel: caseOptions[3].caseLabel, timeRange: "12-18", checklistItemId: "s12-1" },
  { id: "8", title: "New case logged", type: "case", status: "completed", timestamp: "Yesterday, 11:30 AM", caseId: caseOptions[3].caseId, caseLabel: caseOptions[3].caseLabel },
  { id: "9", title: "Prepare for first consultation with mother", type: "checklist", status: "completed", timestamp: "Yesterday, 9:15 AM", caseId: caseOptions[4].caseId, caseLabel: caseOptions[4].caseLabel, timeRange: "0-6", checklistItemId: "5" },
  { id: "10", title: "MOM conversation", type: "checklist", status: "completed", timestamp: "2 days ago", caseId: caseOptions[4].caseId, caseLabel: caseOptions[4].caseLabel, timeRange: "0-6", checklistItemId: "1" },
  { id: "11", title: "New case logged", type: "case", status: "completed", timestamp: "3 days ago", caseId: caseOptions[5].caseId, caseLabel: caseOptions[5].caseLabel },
  { id: "12", title: "Follow-Up & PP2 Preparation", type: "checklist", status: "completed", timestamp: "4 days ago", caseId: caseOptions[5].caseId, caseLabel: caseOptions[5].caseLabel, timeRange: "12-18", checklistItemId: "s12-1" },
  { id: "13", title: "Post-Pumping Assessment", type: "checklist", status: "completed", timestamp: "5 days ago", caseId: caseOptions[0].caseId, caseLabel: caseOptions[0].caseLabel, timeRange: "6-12", checklistItemId: "18" },
  { id: "14", title: "New case logged", type: "case", status: "completed", timestamp: "1 week ago", caseId: caseOptions[1].caseId, caseLabel: caseOptions[1].caseLabel },
  { id: "15", title: "Follow-Up & PP2 Preparation", type: "checklist", status: "completed", timestamp: "1 week ago", caseId: caseOptions[2].caseId, caseLabel: caseOptions[2].caseLabel, timeRange: "12-18", checklistItemId: "s12-1" },
]

function getUnreadCount(): number {
  const readIds = loadReadIds()
  return notifications.filter((n) => !readIds.has(n.id)).length
}

function subscribe(callback: () => void) {
  const handler = () => callback()
  window.addEventListener("hcp-notifications-read-changed", handler)
  return () => window.removeEventListener("hcp-notifications-read-changed", handler)
}

/** Returns the number of unread notifications. Updates when user marks notifications read (same tab). */
export function useUnreadNotificationCount(): number {
  return useSyncExternalStore(
    subscribe,
    () => getUnreadCount(),
    () => 0
  )
}
