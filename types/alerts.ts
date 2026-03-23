/** Severity for patient-scoped clinical alerts. */
export type AlertSeverity = "low" | "medium" | "high" | "critical"

/** Clinical alert type (Figma-style). */
export type AlertType =
  | "supply-drop"
  | "missed-session"
  | "discomfort"
  | "irregular"
  | "program-change"
  | "long-term-support"
  | "critical-window"

/** Single patient-scoped alert. */
export interface Alert {
  id: string
  caseId: string
  patientName: string
  type: AlertType
  severity: AlertSeverity
  message: string
  timestamp: string
  /**
   * Days before “today” (local) for My Day grouping: 0 = today, 1 = yesterday, etc.
   * When omitted, treated as 0. Replace with ISO `occurredAt` when API exists.
   */
  dayBucketOffset?: number
  read: boolean
  /** Short unique reason for list display (e.g. "20% drop", "No pump 6h"). */
  reasonBadge: string
}
