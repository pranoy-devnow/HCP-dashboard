import type { CaseFileRecord } from "@/types/case-files"
import type {
  PatientHeaderCardData,
  AtRiskConditionsCardData,
  UrgentActionCardData,
  MetricCardData,
  PumpingMetricCardData,
} from "@/types/case-file-detail-cards"

const DEFAULT_HOSPITAL = process.env.NEXT_PUBLIC_HOSPITAL_NAME ?? "Stanford Children's Hospital"

/** Format date from MM/DD/YYYY to "Mon D, YYYY" for display. */
function formatDob(dateStr: string): string {
  const [mm, dd, yyyy] = dateStr.split("/").map(Number)
  if ([mm, dd, yyyy].some(Number.isNaN)) return dateStr
  const d = new Date(yyyy, mm - 1, dd)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

/** Format lastUpdated (YYYY-MM-DD or ISO datetime) for the header card. */
function formatLastSync(lastUpdated: string): string {
  const iso = new Date(lastUpdated)
  if (!Number.isNaN(iso.getTime()) && lastUpdated.includes("T")) {
    return iso.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }
  const [y, m, d] = lastUpdated.split("-").map(Number)
  if ([y, m, d].some(Number.isNaN)) return lastUpdated
  const date = new Date(y, m - 1, d, 11, 30)
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function getPatientHeaderCardData(patient: CaseFileRecord): PatientHeaderCardData {
  const babyName = `${patient.motherLastName}, ${patient.babyGender}`
  const initials =
    patient.motherLastName.slice(0, 1) +
    (patient.babyGender === "Baby Girl" ? "G" : patient.babyGender === "Baby Boy" ? "B" : "?")
  return {
    initials: initials.toUpperCase(),
    patientName: babyName,
    patientId: patient.id === "mock" ? "PT-2025-002112" : patient.id,
    subtitle: `${babyName} • ${patient.age} old • ${patient.babyGender.replace("Baby ", "")}`,
    hospital: DEFAULT_HOSPITAL,
    infantDob: formatDob(patient.dateOfBirth),
    infantLocation: `NICU Level II ${patient.babyLocation.room}`,
    motherLocation: `Postpartum Unit - Room ${patient.location.room}`,
    lastSync: formatLastSync(patient.lastUpdated),
  }
}

/** Derive maternal at-risk conditions from case file (e.g. delivery type, gestational age). */
export function getAtRiskConditionsCardData(patient: CaseFileRecord): AtRiskConditionsCardData | null {
  const conditions: string[] = []
  if (patient.deliveryType === "C-section") {
    conditions.push("Planned Caesarean Section")
  }
  if (patient.gestationalAgeWeeks < 37) {
    conditions.push("Preterm Birth")
  }
  if (conditions.length === 0) return null
  return { conditions }
}

/** Urgent action for PP1 consultation (mock; in production would come from backend). */
export function getUrgentActionCardData(patient: CaseFileRecord): UrgentActionCardData | null {
  if (patient.status !== "High priority" && patient.status !== "Critical Window") return null
  return {
    title: "Conduct PP1 consultation",
    timeRemaining: "8 hours",
    subtitle: "24hrs Initiation Phase ends",
    checklistLabel: "PP1 Consult checklist",
  }
}

export function getAvgDailyVolumeMetric(patient: CaseFileRecord): MetricCardData {
  return {
    iconKey: "droplets",
    title: "Avg Daily Volume",
    value: "Few drops collected",
    trend: "up",
  }
}

export function getPumpingFrequencyMetric(patient: CaseFileRecord): PumpingMetricCardData {
  return {
    iconKey: "clock",
    title: "Pumping Frequency",
    averagePerDay: 4,
    target: "5-8",
    past24Hours: 3,
    past24HoursLabel: "sessions",
  }
}

export type InfantDataIconKey =
  | "calendar"
  | "clock"
  | "activity"
  | "scale"
  | "baby"
  | "bottle"
  | "droplets"
  | "zap"

export interface InfantDataItemData {
  iconKey: InfantDataIconKey
  label: string
  value: string
  subInfo?: string
}

/** Build infant data grid items from case file (for use with InfantDataSection). */
export function getInfantDataItems(patient: CaseFileRecord): InfantDataItemData[] {
  const feedingRoute = patient.feedingMethod ?? "Enteral"
  return [
    { iconKey: "calendar", label: "Gestational Age at Birth", value: `${patient.gestationalAgeWeeks} weeks` },
    { iconKey: "clock", label: "Actual Age (Chronological)", value: patient.age },
    { iconKey: "activity", label: "Corrected Age (Postmenstrual)", value: `${patient.gestationalAgeWeeks} weeks` },
    { iconKey: "scale", label: "Current Weight", value: patient.currentWeight, subInfo: "+0g" },
    { iconKey: "baby", label: "Birth Weight", value: patient.birthWeight },
    { iconKey: "bottle", label: "Infant Feeding Route", value: feedingRoute },
    { iconKey: "droplets", label: "Daily Intake", value: "75ml" },
    { iconKey: "zap", label: "Supply Gap", value: "75ml", subInfo: "Donor Human Milk" },
  ]
}
