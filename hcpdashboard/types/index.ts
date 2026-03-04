/** Central re-exports for shared types. */
export type {
  BabyGender,
  CaseFileRecord,
  TimelineSectionKey,
  Note,
  CompletionEntry,
  LogEntry,
  TimelineItem,
} from "./case-files"
export { TIMELINE_SECTIONS } from "./case-files"

export type { SessionUser } from "./session"

export type {
  NotificationSeverity,
  NotificationItem,
  NotificationTimelineProps,
} from "./notifications"

export type { ModuleLink, Module, Course } from "./learning"
