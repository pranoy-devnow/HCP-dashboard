/**
 * Maps GET /v1/dashboard-data into the view models the dashboard already uses.
 * Derived fields (age, corrected age, alert day buckets, pumping metrics) are
 * computed here because the API omits them on purpose.
 */

import type { Alert, AlertSeverity, AlertType } from "@/types/alerts"
import type { CaseFileRecord, CompletionEntry, Note, BabyGender } from "@/types/case-files"
import type {
  AtRiskConditionsCardData,
  MetricCardData,
  MomDataCardItem,
  PumpingMetricCardData,
  UrgentActionCardData,
} from "@/types/case-file-detail-cards"
import type { ClinicalNoteCategory, ClinicalNoteCategoryId } from "@/types/clinical-notes"
import type {
  DashboardApiAlert,
  DashboardApiConfig,
  DashboardApiHcpUser,
  DashboardApiPatient,
  DashboardApiPumpingSession,
  DashboardApiResponse,
} from "@/types/dashboard-api"
import type { PumpingSession } from "@/types/pumping-sessions"
import { getHoursSinceBirth, parseWeightKg } from "@/lib/case-file-detail-helpers"
import type { InfantDataItemData } from "@/lib/case-file-detail-cards-data"

const ALERT_TYPES: AlertType[] = [
  "supply-drop",
  "missed-session",
  "discomfort",
  "irregular",
  "program-change",
  "long-term-support",
  "critical-window",
]

const ALERT_SEVERITIES: AlertSeverity[] = ["low", "medium", "high", "critical"]

const CLINICAL_NOTE_CATEGORIES: ClinicalNoteCategoryId[] = [
  "interventions",
  "follow-up",
  "recommendations",
]

const CLINICAL_NOTE_TITLES: Record<ClinicalNoteCategoryId, string> = {
  interventions: "Interventions",
  "follow-up": "Follow-up",
  recommendations: "Recommendations",
}

export interface HourlyVolumePoint {
  hour: string
  volume: number
  session: number
}

export interface LeftRightPoint {
  time: string
  left: number
  right: number
}

export interface ParsedPatientExtras {
  infantItems: InfantDataItemData[]
  momItems: MomDataCardItem[]
  atRisk: AtRiskConditionsCardData | null
  urgentAction: UrgentActionCardData | null
  pumpingSessions: PumpingSession[]
  hourlyVolume: HourlyVolumePoint[]
  leftVsRight: LeftRightPoint[]
  clinicalNotes: ClinicalNoteCategory[]
  patientNotes: Note[]
  completionLog: CompletionEntry[]
}

export interface ParsedDashboardData {
  generatedAt: Date
  config: DashboardApiConfig
  users: DashboardApiHcpUser[]
  caseFiles: CaseFileRecord[]
  alerts: Alert[]
  pendingConsultReadIds: string[]
  extrasByPatientId: Record<string, ParsedPatientExtras>
}

function toBabyGender(value: string): BabyGender {
  if (value === "Baby Boy" || value === "Baby Girl") return value
  return "Unknown"
}

/** API dates are YYYY-MM-DD; existing helpers expect MM/DD/YYYY. */
export function toDisplayDate(isoDate: string): string {
  if (isoDate.includes("/")) return isoDate
  const [year, month, day] = isoDate.split("-")
  if (!year || !month || !day) return isoDate
  return `${month}/${day}/${year}`
}

function formatAge(hours: number): string {
  if (hours < 24) {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    if (h <= 0) return `${m}m`
    return `${h}h ${m}m`
  }
  const days = Math.floor(hours / 24)
  if (days < 7) return days === 1 ? "1 day" : `${days} days`
  const weeks = Math.floor(days / 7)
  const rem = days % 7
  return rem === 0 ? `${weeks}w` : `${weeks}w ${rem}d`
}

function formatCorrectedAge(gestationalWeeks: number, hours: number): string {
  const addedWeeks = hours / (24 * 7)
  const pma = gestationalWeeks + addedWeeks
  return `${pma.toFixed(1)} weeks PMA`
}

function formatRelativeTime(iso: string, now: Date): string {
  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) return iso
  const minutes = Math.max(0, Math.round((now.getTime() - then.getTime()) / 60_000))
  if (minutes < 1) return "Just now"
  if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  return `${days} days ago`
}

function dayBucketOffset(iso: string, now: Date): number {
  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) return 0
  const startNow = new Date(now)
  startNow.setHours(0, 0, 0, 0)
  const startThen = new Date(then)
  startThen.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((startNow.getTime() - startThen.getTime()) / 86_400_000))
}

function isAlertType(value: string): value is AlertType {
  return ALERT_TYPES.includes(value as AlertType)
}

function isAlertSeverity(value: string): value is AlertSeverity {
  return ALERT_SEVERITIES.includes(value as AlertSeverity)
}

function userName(users: DashboardApiHcpUser[], userId: string): string {
  return users.find((user) => user.id === userId)?.name ?? userId
}

function formatSessionDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const day = date.toISOString().slice(0, 10)
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  return `${day} at ${time}`
}

function formatVolume(ml: number): string {
  if (ml < 1) return "Few drops collected"
  if (ml < 10) return `${ml.toFixed(1)} ml`
  return `${Math.round(ml)} ml`
}

function parsePatient(
  patient: DashboardApiPatient,
  now: Date
): CaseFileRecord {
  const dateOfBirth = toDisplayDate(patient.infant.dateOfBirth)
  const hours = getHoursSinceBirth(dateOfBirth, patient.infant.birthTime, now)
  return {
    id: patient.id,
    motherLastName: patient.mother.motherLastName,
    babyGender: toBabyGender(patient.infant.babyGender),
    motherName: `${patient.mother.motherName} ${patient.mother.motherLastName}`.trim(),
    motherAgeYears: patient.mother.motherAgeYears,
    motherPatientId: patient.mother.motherPatientId,
    birthTime: patient.infant.birthTime,
    dateOfBirth,
    age: formatAge(hours),
    gestationalAgeWeeks: patient.infant.gestationalAgeWeeks,
    correctedAge: formatCorrectedAge(patient.infant.gestationalAgeWeeks, hours),
    birthWeight: patient.infant.birthWeight,
    currentWeight: patient.infant.currentWeight,
    location: { room: patient.mother.motherRoom, bed: patient.mother.motherBed },
    babyLocation: { room: patient.infant.babyRoom, bed: patient.infant.babyBed },
    dateCreated: patient.dateCreated,
    lastUpdated: patient.lastUpdated,
    status: patient.care.status,
    gravida: patient.mother.gravida,
    parity: patient.mother.parity,
    riskFactor: patient.mother.riskFactor ?? undefined,
    deliveryType: patient.mother.deliveryType,
    feedingStatus: patient.mother.feedingStatus,
    sodiumLevel: patient.mother.sodiumLevel ?? undefined,
    reasonForCSection: patient.mother.reasonForCSection ?? undefined,
    feedingMethod: patient.mother.feedingMethod,
  }
}

function parseAlert(
  alert: DashboardApiAlert,
  patient: CaseFileRecord | undefined,
  readIds: Set<string>,
  now: Date
): Alert {
  return {
    id: alert.id,
    caseId: alert.patientId,
    patientName: patient
      ? `${patient.motherLastName}, ${patient.babyGender}`
      : alert.patientId,
    type: isAlertType(alert.type) ? alert.type : "irregular",
    severity: isAlertSeverity(alert.severity) ? alert.severity : "medium",
    message: alert.message,
    timestamp: formatRelativeTime(alert.occurredAt, now),
    dayBucketOffset: dayBucketOffset(alert.occurredAt, now),
    read: readIds.has(alert.id) || alert.resolvedAt != null,
    reasonBadge: alert.reasonBadge,
  }
}

function parsePumpingSession(session: DashboardApiPumpingSession): PumpingSession {
  return {
    id: session.id,
    dateTime: formatSessionDateTime(session.startedAt),
    durationMinutes: session.durationMinutes,
    badges: [
      { label: session.equipment, variant: "equipment" },
      { label: session.phase, variant: "phase" },
    ],
    leftMl: session.leftMl,
    rightMl: session.rightMl,
    totalMl: session.totalMl,
    totalDisplay: session.totalMl < 1 ? "<1 ml" : undefined,
    comfortSettings: {
      shieldSizes: `L: ${session.shieldSizeLeftMm}mm / R: ${session.shieldSizeRightMm}mm`,
      vacuumLevel: session.vacuumLevel,
      comfortNotes: session.comfortNotes || "—",
    },
  }
}

function buildAtRisk(patient: CaseFileRecord): AtRiskConditionsCardData | null {
  const conditions: string[] = []
  if (patient.riskFactor) conditions.push(patient.riskFactor)
  if (patient.deliveryType === "C-section") conditions.push("Caesarean Section")
  if (patient.gestationalAgeWeeks < 37) conditions.push("Preterm Birth")
  const unique = [...new Set(conditions)]
  if (unique.length === 0) return null
  return { conditions: unique }
}

function buildUrgentAction(
  patient: CaseFileRecord,
  config: DashboardApiConfig,
  now: Date
): UrgentActionCardData | null {
  if (patient.status !== "High priority" && patient.status !== "Critical Window") {
    return null
  }
  const hours = getHoursSinceBirth(patient.dateOfBirth, patient.birthTime, now)
  const remaining = Math.max(0, config.criticalWindowHours - hours)
  const wholeHours = Math.floor(remaining)
  return {
    title: "Conduct PP1 consultation",
    timeRemaining: wholeHours === 1 ? "1 hour" : `${wholeHours} hours`,
    subtitle: `${config.criticalWindowHours}hrs Initiation Phase ends`,
    checklistLabel: "PP1 Consult checklist",
  }
}

function buildInfantItems(patient: CaseFileRecord): InfantDataItemData[] {
  const birthKg = parseWeightKg(patient.birthWeight)
  const currentKg = parseWeightKg(patient.currentWeight)
  const deltaG = Math.round((currentKg - birthKg) * 1000)
  const deltaLabel = `${deltaG >= 0 ? "+" : ""}${deltaG}g`
  return [
    {
      iconKey: "calendar",
      label: "Gestational Age at Birth",
      value: `${patient.gestationalAgeWeeks} weeks`,
    },
    {
      iconKey: "clock",
      label: "Actual Age (Chronological)",
      value: patient.age,
    },
    {
      iconKey: "activity",
      label: "Corrected Age (Postmenstrual)",
      value: patient.correctedAge,
    },
    {
      iconKey: "scale",
      label: "Current Weight",
      value: patient.currentWeight,
      subInfo: deltaLabel,
    },
    { iconKey: "baby", label: "Birth Weight", value: patient.birthWeight },
    {
      iconKey: "bottle",
      label: "Infant Feeding Route",
      value: patient.feedingMethod ?? "—",
    },
    {
      iconKey: "droplets",
      label: "Feeding status",
      value: patient.feedingStatus ?? "—",
    },
    {
      iconKey: "zap",
      label: "Sodium",
      value: patient.sodiumLevel ?? "—",
    },
  ]
}

function buildPumpingMetrics(
  sessions: DashboardApiPumpingSession[],
  config: DashboardApiConfig,
  now: Date
): { volume: MetricCardData; frequency: PumpingMetricCardData } {
  const dayMs = 24 * 60 * 60 * 1000
  const last24h = sessions.filter(
    (session) => now.getTime() - new Date(session.startedAt).getTime() <= dayMs
  )
  const totalMl = sessions.reduce((sum, session) => sum + session.totalMl, 0)
  const uniqueDays = new Set(
    sessions.map((session) => new Date(session.startedAt).toISOString().slice(0, 10))
  )
  const dayCount = Math.max(uniqueDays.size, 1)
  const avgMl = sessions.length === 0 ? 0 : totalMl / dayCount
  const avgPerDay = sessions.length === 0 ? 0 : Math.round((sessions.length / dayCount) * 10) / 10

  let trend: MetricCardData["trend"] = "neutral"
  if (sessions.length >= 2) {
    const sorted = [...sessions].sort(
      (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
    )
    const prev = sorted[sorted.length - 2]?.totalMl ?? 0
    const latest = sorted[sorted.length - 1]?.totalMl ?? 0
    if (latest > prev) trend = "up"
    if (latest < prev) trend = "down"
  }

  return {
    volume: {
      iconKey: "droplets",
      title: "Avg Daily Volume",
      value: formatVolume(avgMl),
      trend,
    },
    frequency: {
      iconKey: "clock",
      title: "Pumping Frequency",
      averagePerDay: avgPerDay,
      target: `${config.pumpingTargetPerDayMin}-${config.pumpingTargetPerDayMax}`,
      past24Hours: last24h.length,
      past24HoursLabel: last24h.length === 1 ? "session" : "sessions",
    },
  }
}

function buildMomItems(
  sessions: DashboardApiPumpingSession[],
  config: DashboardApiConfig,
  now: Date
): MomDataCardItem[] {
  const { volume, frequency } = buildPumpingMetrics(sessions, config, now)
  const latest = [...sessions].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )[0]
  const trendLabel =
    volume.trend === "down" ? "Trending down" : volume.trend === "up" ? "Trending up" : "Stable"
  return [
    {
      id: "avg-daily-volume",
      label: "Avg daily volume",
      value: volume.value,
      trend: volume.trend === "neutral" ? undefined : volume.trend,
      iconKey: "droplets",
      showKnowMore: false,
    },
    {
      id: "pumping-avg-per-day",
      label: "Pumping frequency: Average per day",
      value: String(frequency.averagePerDay),
      expectedFrequency: frequency.target,
      iconKey: "clock",
      showKnowMore: false,
    },
    {
      id: "pumping-past-24h",
      label: "Pumping frequency: Past 24 hours",
      value: `${frequency.past24Hours} ${frequency.past24HoursLabel}`,
      iconKey: "clock",
      showKnowMore: false,
    },
    {
      id: "milk-trend-volume",
      label: "Milk trend volume",
      value: trendLabel,
      trend: volume.trend === "neutral" ? undefined : volume.trend,
      iconKey: "trend",
    },
    {
      id: "left-and-right",
      label: "Left and Right",
      value: latest ? `${latest.leftMl} ml / ${latest.rightMl} ml` : "—",
      subInfo: latest ? "Last session" : "No sessions yet",
      iconKey: "scale",
    },
    {
      id: "recent-session",
      label: "Recent session",
      value: `${sessions.length} session${sessions.length === 1 ? "" : "s"}`,
      subInfo: "View details",
      iconKey: "calendar",
    },
  ]
}

function buildClinicalNotes(
  notes: DashboardApiResponse["clinicalNotes"],
  patientId: string
): ClinicalNoteCategory[] {
  return CLINICAL_NOTE_CATEGORIES.map((id) => {
    const matches = notes.filter(
      (note) => note.patientId === patientId && note.category === id
    )
    const content = matches.flatMap((note) => {
      const heading = note.title ? [note.title] : []
      return [...heading, ...note.paragraphs]
    })
    const description =
      matches[0]?.description ||
      (id === "interventions"
        ? "Documented clinical interventions for this case"
        : id === "follow-up"
          ? "Planned follow-up actions and checkpoints"
          : "Clinical recommendations for care team and family")
    return {
      id,
      title: CLINICAL_NOTE_TITLES[id],
      description,
      content: content.length > 0 ? content : ["No notes recorded yet."],
    }
  })
}

function buildCharts(sessions: DashboardApiPumpingSession[]): {
  hourlyVolume: HourlyVolumePoint[]
  leftVsRight: LeftRightPoint[]
} {
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
  )
  return {
    hourlyVolume: sorted.map((session, index) => ({
      hour: new Date(session.startedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      volume: session.totalMl,
      session: index + 1,
    })),
    leftVsRight: sorted.map((session) => ({
      time: new Date(session.startedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      left: session.leftMl,
      right: session.rightMl,
    })),
  }
}

/** Parse the dashboard API payload into case files, alerts, and per-patient extras. */
export function parseDashboardData(
  raw: DashboardApiResponse,
  now: Date = new Date()
): ParsedDashboardData {
  const caseFiles = raw.patients.map((patient) => parsePatient(patient, now))
  const caseById = new Map(caseFiles.map((file) => [file.id, file]))
  const readIds = new Set(raw.alertReads.map((read) => read.alertId))
  const alerts = raw.alerts.map((alert) =>
    parseAlert(alert, caseById.get(alert.patientId), readIds, now)
  )

  const extrasByPatientId: Record<string, ParsedPatientExtras> = {}
  for (const file of caseFiles) {
    const sessions = raw.pumpingSessions.filter((session) => session.patientId === file.id)
    const timelineLabels = new Map(
      raw.timelineChecklistItems.map((item) => [item.id, item.label])
    )
    extrasByPatientId[file.id] = {
      infantItems: buildInfantItems(file),
      momItems: buildMomItems(sessions, raw.config, now),
      atRisk: buildAtRisk(file),
      urgentAction: buildUrgentAction(file, raw.config, now),
      pumpingSessions: sessions.map(parsePumpingSession),
      ...buildCharts(sessions),
      clinicalNotes: buildClinicalNotes(raw.clinicalNotes, file.id),
      patientNotes: raw.patientNotes
        .filter((note) => note.patientId === file.id)
        .map((note) => ({
          id: note.id,
          text: note.text,
          timestamp: new Date(note.createdAt),
          source: note.source,
        })),
      completionLog: raw.timelineCompletions
        .filter((entry) => entry.patientId === file.id)
        .map((entry) => ({
          id: entry.id,
          by: userName(raw.hcpUsers, entry.completedBy),
          itemLabel: timelineLabels.get(entry.itemId) ?? entry.itemId,
          timestamp: new Date(entry.completedAt),
        })),
    }
  }

  return {
    generatedAt: new Date(raw.meta.generatedAt),
    config: raw.config,
    users: raw.hcpUsers,
    caseFiles,
    alerts,
    pendingConsultReadIds: raw.pendingConsultReads.map((read) => read.patientId),
    extrasByPatientId,
  }
}

export function getParsedPatientExtras(
  data: ParsedDashboardData | null,
  patientId: string
): ParsedPatientExtras | null {
  if (!data) return null
  return data.extrasByPatientId[patientId] ?? null
}
