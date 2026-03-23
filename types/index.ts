/** Central re-exports for shared types. */
export type {
  BabyGender,
  CaseFileRecord,
  PatientStatus,
  TimelineSectionKey,
  Note,
  CompletionEntry,
  LogEntry,
  TimelineItem,
} from "./case-files"
export { TIMELINE_SECTIONS } from "./case-files"

export type { SessionUser } from "./session"

export type { AlertSeverity, AlertType, Alert } from "./alerts"
