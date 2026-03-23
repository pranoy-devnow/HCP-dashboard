import type { Alert } from "@/types/alerts"
import { caseFiles, babyTitle } from "@/lib/case-files-data"

export const STORAGE_KEY_ALERTS_READ_IDS = "hcp-alerts-read-ids"

const caseOptions = caseFiles.map((f) => ({ caseId: f.id, caseLabel: babyTitle(f) }))

/** Mock patient-scoped clinical alerts. Read state is tracked via alertsService. */
export const alerts: Alert[] = [
  {
    id: "a1",
    caseId: caseOptions[0].caseId,
    patientName: caseOptions[0].caseLabel,
    type: "supply-drop",
    severity: "high",
    message: "Daily volume below target for 2 consecutive days.",
    timestamp: "Just now",
    read: false,
    reasonBadge: "20% drop",
  },
  {
    id: "a2",
    caseId: caseOptions[0].caseId,
    patientName: caseOptions[0].caseLabel,
    type: "missed-session",
    severity: "medium",
    message: "No pumping session in the last 6 hours.",
    timestamp: "1 hour ago",
    read: false,
    reasonBadge: "No pump 6h",
  },
  {
    id: "a3",
    caseId: caseOptions[1].caseId,
    patientName: caseOptions[1].caseLabel,
    type: "critical-window",
    severity: "critical",
    message: "First 6 hours post-delivery – assign device and initiate first pump.",
    timestamp: "30 minutes ago",
    read: false,
    reasonBadge: "First 6h – assign device",
  },
  {
    id: "a4",
    caseId: caseOptions[2].caseId,
    patientName: caseOptions[2].caseLabel,
    type: "discomfort",
    severity: "medium",
    message: "Mother reported discomfort on right breast at high vacuum.",
    timestamp: "2 hours ago",
    read: false,
    reasonBadge: "Discomfort at high vacuum",
  },
  {
    id: "a5",
    caseId: caseOptions[0].caseId,
    patientName: caseOptions[0].caseLabel,
    type: "irregular",
    severity: "low",
    message: "Pumping frequency dropped from 8 to 6 sessions/day.",
    timestamp: "Yesterday",
    dayBucketOffset: 1,
    read: false,
    reasonBadge: "Sessions 8→6/day",
  },
  {
    id: "a6",
    caseId: caseOptions[2].caseId,
    patientName: caseOptions[2].caseLabel,
    type: "critical-window",
    severity: "critical",
    message: "18 hours post-delivery – no pump session in last 4 hours. Initiate ASAP.",
    timestamp: "45 minutes ago",
    read: false,
    reasonBadge: "No pump 4h",
  },
  {
    id: "a7",
    caseId: caseOptions[3].caseId,
    patientName: caseOptions[3].caseLabel,
    type: "supply-drop",
    severity: "high",
    message: "Output dropped 40% vs. yesterday. Assess latch and pumping technique.",
    timestamp: "1 hour ago",
    read: false,
    reasonBadge: "40% drop",
  },
  {
    id: "a8",
    caseId: caseOptions[4].caseId,
    patientName: caseOptions[4].caseLabel,
    type: "missed-session",
    severity: "high",
    message: "Missed 2 scheduled sessions today. Follow up with mother.",
    timestamp: "Yesterday",
    dayBucketOffset: 1,
    read: false,
    reasonBadge: "2 sessions missed",
  },
  {
    id: "a9",
    caseId: caseOptions[5].caseId,
    patientName: caseOptions[5].caseLabel,
    type: "discomfort",
    severity: "high",
    message: "Severe nipple pain reported. Shield size and vacuum need review.",
    timestamp: "2 days ago",
    dayBucketOffset: 2,
    read: false,
    reasonBadge: "Nipple pain – shield review",
  },
  {
    id: "a10",
    caseId: caseOptions[6].caseId,
    patientName: caseOptions[6].caseLabel,
    type: "program-change",
    severity: "critical",
    message: "Ready for Maintain program – volume target met. Update pump settings.",
    timestamp: "4 hours ago",
    read: false,
    reasonBadge: "Ready for Maintain",
  },
]

/** Load persisted read alert IDs (client-only). */
export function loadAlertsReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALERTS_READ_IDS)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

/** Persist read alert IDs and notify listeners. */
export function saveAlertsReadIds(ids: Set<string>): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY_ALERTS_READ_IDS, JSON.stringify([...ids]))
    window.dispatchEvent(new CustomEvent("hcp-alerts-read-changed"))
  } catch {
    // ignore
  }
}
