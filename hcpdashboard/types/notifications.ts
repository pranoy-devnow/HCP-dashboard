export type NotificationSeverity = "low" | "medium" | "high"

/** Single notification in the timeline (case or checklist). */
export interface NotificationItem {
  id: string
  title: string
  type: "case" | "checklist"
  status?: "pending" | "completed"
  /** Reserved for future use; all unread notifications use red. */
  severity?: NotificationSeverity
  timestamp?: string
  /** Case file ID – links notification to a patient case. Clicking navigates to case file. */
  caseId?: string
  /** Display label for the case, e.g. "Johnson, Baby Girl". */
  caseLabel?: string
  /** Care timeline section (e.g. "0-6", "6-12") – used to open the right section on the patient page. */
  timeRange?: string
  /** Checklist item ID in that section – used to scroll to/highlight the subsection on the patient page. */
  checklistItemId?: string
}

/** Props for the notification timeline component. */
export interface NotificationTimelineProps {
  notifications: NotificationItem[]
  /** IDs of notifications the user has opened; these are shown as read (grey). */
  readIds?: Set<string>
  /** Called when user clicks a notification so it can be marked read. */
  onMarkRead?: (id: string) => void
}
