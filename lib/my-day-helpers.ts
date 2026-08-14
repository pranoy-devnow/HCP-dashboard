import type { CaseFileRecord } from "@/types/case-files"
import { getHoursSinceBirth } from "@/lib/case-file-detail-helpers"

/** Critical window: first 6 hours post-delivery unless the API config overrides it. */
const DEFAULT_CRITICAL_WINDOW_HOURS = 6

/**
 * Returns case files that are within the critical first hours post-delivery,
 * or already marked Critical Window by the backend.
 */
export function getCriticalWindowCases(
  caseFiles: CaseFileRecord[],
  now: Date = new Date(),
  criticalWindowHours: number = DEFAULT_CRITICAL_WINDOW_HOURS
): CaseFileRecord[] {
  return caseFiles.filter((file) => {
    if (file.status === "Critical Window") return true
    const hours = getHoursSinceBirth(file.dateOfBirth, file.birthTime, now)
    return hours >= 0 && hours < criticalWindowHours
  })
}

/**
 * Returns high-priority case files for My Day: critical window first, then High priority, then Needs Follow-up.
 */
export function getPriorityCases(
  caseFiles: CaseFileRecord[],
  now: Date = new Date(),
  criticalWindowHours: number = DEFAULT_CRITICAL_WINDOW_HOURS
): CaseFileRecord[] {
  const critical = getCriticalWindowCases(caseFiles, now, criticalWindowHours)
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
  if (hoursSinceBirth >= 0 && hoursSinceBirth < DEFAULT_CRITICAL_WINDOW_HOURS) {
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

/** True when delivery is cesarean — use reason chip instead of a duplicate “C-section delivery” chip. */
export function isCSectionDelivery(deliveryType: string): boolean {
  return deliveryType.trim().toLowerCase() === "c-section"
}

/** Critical alert chip: e.g. "C-section delivery", "Vaginal delivery". */
export function formatAlertDeliveryChip(deliveryType: string): string {
  const t = deliveryType.trim()
  if (!t) return ""
  if (/delivery$/i.test(t)) return t
  return `${t} delivery`
}

/**
 * Critical alert chip for feeding mode — short labels (e.g. "Pumping", "breastfeeding").
 */
export function formatAlertFeedingStatusChip(feedingStatus: string): string {
  const key = feedingStatus.trim().toLowerCase()
  if (key === "breastfeeding") return "breastfeeding"
  if (key === "pumping") return "Pumping"
  if (key === "mixed") return "Mixed"
  return feedingStatus.trim()
}

/** Critical alert chip: short but clearly C-section context, e.g. "C-section — Placenta previa". */
export function formatAlertCSectionReasonChip(reasonForCSection: string): string {
  const r = reasonForCSection.trim()
  if (!r) return ""
  return `C-section — ${r}`
}
