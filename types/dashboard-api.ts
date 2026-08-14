/** Raw payload from GET /v1/dashboard-data. */

export interface DashboardApiMeta {
  generatedAt: string
  source: string
  notes: string[]
}

export interface DashboardApiConfig {
  hospitalName: string
  postLoginRedirectPath: string
  criticalWindowHours: number
  pumpingTargetPerDayMin: number
  pumpingTargetPerDayMax: number
}

export interface DashboardApiHcpUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface DashboardApiMother {
  motherPatientId: string
  motherName: string
  motherLastName: string
  motherAgeYears: number
  gravida: number
  parity: number
  riskFactor: string | null
  deliveryType: string
  reasonForCSection: string | null
  feedingStatus: string
  feedingMethod: string
  sodiumLevel: string | null
  motherRoom: string
  motherBed: string
}

export interface DashboardApiInfant {
  babyGender: string
  dateOfBirth: string
  birthTime: string
  gestationalAgeWeeks: number
  birthWeight: string
  currentWeight: string
  babyRoom: string
  babyBed: string
}

export interface DashboardApiPatient {
  id: string
  dateCreated: string
  lastUpdated: string
  mother: DashboardApiMother
  infant: DashboardApiInfant
  care: { status: string }
}

export interface DashboardApiAlert {
  id: string
  patientId: string
  type: string
  severity: string
  message: string
  reasonBadge: string
  occurredAt: string
  resolvedAt: string | null
}

export interface DashboardApiAlertRead {
  alertId: string
  userId: string
  readAt: string
}

export interface DashboardApiPendingConsultRead {
  patientId: string
  userId: string
  readAt: string
}

export interface DashboardApiPumpingSession {
  id: string
  patientId: string
  startedAt: string
  durationMinutes: number
  equipment: string
  phase: string
  leftMl: number
  rightMl: number
  totalMl: number
  shieldSizeLeftMm: number
  shieldSizeRightMm: number
  vacuumLevel: number
  comfortNotes: string
}

export interface DashboardApiTimelineItem {
  id: string
  section: string
  parentId: string | null
  label: string
  description: string
  hideCheckbox: boolean
  orderIndex: number
}

export interface DashboardApiTimelineCompletion {
  id: string
  patientId: string
  itemId: string
  completedBy: string
  completedAt: string
}

export interface DashboardApiPatientNote {
  id: string
  patientId: string
  authorId: string
  text: string
  source: string
  createdAt: string
  updatedAt: string
}

export interface DashboardApiClinicalNote {
  id: string
  patientId: string
  category: string
  title: string
  description: string
  paragraphs: string[]
  authorId: string
  createdAt: string
  updatedAt: string
}

export interface DashboardApiPp1ChecklistItem {
  id: string
  stepId: string
  stepNumber: number
  stepTitle: string
  label: string
  description: string | null
  orderIndex: number
}

export interface DashboardApiPp1Progress {
  patientId: string
  itemId: string
  checked: boolean
  checkedBy: string | null
  checkedAt: string | null
}

export interface DashboardApiResponse {
  meta: DashboardApiMeta
  config: DashboardApiConfig
  hcpUsers: DashboardApiHcpUser[]
  patients: DashboardApiPatient[]
  alerts: DashboardApiAlert[]
  alertReads: DashboardApiAlertRead[]
  pendingConsultReads: DashboardApiPendingConsultRead[]
  pumpingSessions: DashboardApiPumpingSession[]
  timelineChecklistItems: DashboardApiTimelineItem[]
  timelineCompletions: DashboardApiTimelineCompletion[]
  patientNotes: DashboardApiPatientNote[]
  clinicalNotes: DashboardApiClinicalNote[]
  pp1ChecklistItems: DashboardApiPp1ChecklistItem[]
  pp1Progress: DashboardApiPp1Progress[]
}
