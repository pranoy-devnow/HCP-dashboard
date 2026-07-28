import type { ReactNode } from "react"

/** View model for the case file detail card system. Built from CaseFileRecord + optional overrides. */

export interface PatientHeaderCardData {
  initials: string
  patientName: string
  patientId: string
  subtitle: string
  hospital: string
  infantDob: string
  infantLocation: string
  motherLocation: string
  lastSync: string
}

export interface AtRiskConditionsCardData {
  conditions: string[]
}

export interface UrgentActionCardData {
  title: string
  timeRemaining: string
  /** Shown after “remaining until …” (do not include the word “Until”; it is added in UI). */
  subtitle: string
  checklistLabel: string
}

/** Alert-style card for milk volume trends (e.g. drop vs prior days). */
export interface MilkVolumeAlertCardData {
  title: string
  message: string
  actionLabel: string
}

/** Prompt to connect the mother to the Medela consumer app (Family). */
export interface MedelaFamilyConnectCardData {
  title: string
  subtitle: string
  actionLabel: string
}

export type MetricIconKey = "droplets" | "clock"

export interface MetricCardData {
  iconKey: MetricIconKey
  title: string
  value: string
  subInfo?: string
  trend?: "up" | "down" | "neutral"
}

export interface PumpingMetricCardData {
  iconKey: MetricIconKey
  title: string
  averagePerDay: number
  target: string
  past24Hours: number
  past24HoursLabel: string
}

export interface DataCardItem {
  icon: ReactNode
  iconBgClass?: string
  label: string
  value: ReactNode
  subInfo?: ReactNode
}

export type MomDataCardIconKey = "droplets" | "clock" | "trend" | "scale" | "calendar"

export interface MomDataCardItem {
  id: string
  label: string
  value: string
  subInfo?: string
  /** Shown at the bottom of the card (same slot as “Know more”), e.g. target range “5-8”. */
  expectedFrequency?: string
  trend?: "up" | "down"
  iconKey: MomDataCardIconKey
  /** When false, hides the “Know more” action. Defaults to true when omitted. */
  showKnowMore?: boolean
}
