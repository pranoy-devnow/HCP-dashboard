import type { CaseFileRecord } from "@/types/case-files"
import { getHoursSinceBirth } from "@/lib/case-file-detail-helpers"

/** Critical window: first 6 hours post-delivery. */
const CRITICAL_WINDOW_HOURS = 6

/**
 * Returns case files that are within the critical first 6 hours post-delivery.
 * Used to highlight priority patients on My Day.
 */
export function getCriticalWindowCases(
  caseFiles: CaseFileRecord[],
  now: Date = new Date()
): CaseFileRecord[] {
  return caseFiles.filter((file) => {
    const hours = getHoursSinceBirth(file.dateOfBirth, file.birthTime, now)
    return hours >= 0 && hours < CRITICAL_WINDOW_HOURS
  })
}

/**
 * Returns high-priority case files for My Day: critical window first, then High priority, then Needs Follow-up.
 */
export function getPriorityCases(
  caseFiles: CaseFileRecord[],
  now: Date = new Date()
): CaseFileRecord[] {
  const critical = getCriticalWindowCases(caseFiles, now)
  const highPriority = caseFiles.filter(
    (f) =>
      (f.status === "High priority" || f.status === "Needs Follow-up") &&
      !critical.includes(f)
  )
  return [...critical, ...highPriority]
}

/** Format age for My Day priority cards: "4 hours old" or "0w 4d" / "1w 2d". */
export function formatAgeForMyDay(
  dateOfBirth: string,
  birthTime: string,
  now: Date = new Date()
): string {
  const hours = getHoursSinceBirth(dateOfBirth, birthTime, now)
  if (hours < 0) return "—"
  if (hours < 24) {
    const h = Math.floor(hours)
    return h === 1 ? "1 hour old" : `${h} hours old`
  }
  const days = Math.floor(hours / 24)
  const w = Math.floor(days / 7)
  const d = days % 7
  return `${w}w ${d}d`
}

/** Badge label for priority section: Initial Consult (critical/first consult) or Follow-Up. */
export function getPriorityBadgeLabel(status: string): "Initial Consult" | "Follow-Up" {
  return status === "Critical Window" || status === "High priority"
    ? "Initial Consult"
    : "Follow-Up"
}

/** Short reason description for priority card (e.g. critical window, at-risk). */
export function getPriorityReason(
  file: CaseFileRecord,
  hoursSinceBirth: number
): string {
  if (hoursSinceBirth >= 0 && hoursSinceBirth < CRITICAL_WINDOW_HOURS) {
    return `${Math.floor(hoursSinceBirth)} hours post-delivery – Critical window for first pump.`
  }
  if (file.status === "Needs Follow-up") {
    return "Follow-up needed – assess progress and next steps."
  }
  if (file.gestationalAgeWeeks < 37) {
    return `${file.gestationalAgeWeeks}-week preemie – NICU. Initial consult or pump plan review.`
  }
  return "High priority – consult or pump plan needed."
}

/** Location display for priority card (e.g. "Room A320, Bed 07"). */
export function getLocationLabel(file: CaseFileRecord): string {
  return `Room ${file.location.room}, Bed ${file.location.bed}`
}
