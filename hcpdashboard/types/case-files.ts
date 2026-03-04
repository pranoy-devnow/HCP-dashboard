/** Gender label for baby in case file. */
export type BabyGender = "Baby Boy" | "Baby Girl" | "Unknown"

export type CaseFileRecord = {
  id: string
  motherLastName: string
  babyGender: BabyGender
  motherName: string
  motherAgeYears: number
  motherPatientId: string
  birthTime: string
  dateOfBirth: string
  age: string
  gestationalAgeWeeks: number
  correctedAge: string
  birthWeight: string
  currentWeight: string
  location: { room: string; bed: string }
  babyLocation: { room: string; bed: string }
  dateCreated: string
  lastUpdated: string
  status: string
}

/** Care timeline section keys (hours since birth). */
export const TIMELINE_SECTIONS = ["0-6", "6-12", "12-18", "18-24"] as const
export type TimelineSectionKey = (typeof TIMELINE_SECTIONS)[number]

/** A free-text note logged against a case (e.g. from timeline or log). */
export type Note = {
  id: string
  text: string
  timestamp: Date
  source: string
}

/** Record that a timeline item was completed (who, when). */
export type CompletionEntry = {
  id: string
  by: string
  itemLabel: string
  timestamp: Date
}

/** Unified log entry: either a completion or a note. */
export type LogEntry =
  | { type: "completed"; id: string; by: string; itemLabel: string; timestamp: Date }
  | { type: "note"; id: string; text: string; source: string; timestamp: Date }

/** Single item in the care timeline checklist (may have sub-items). */
export type TimelineItem = {
  id: string
  label: string
  checked: boolean
  description: string
  subItems?: Array<{ id: string; label: string; checked: boolean; description: string }>
  hideCheckbox?: boolean
}
