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

// Demo: each baby has a different birth time (14:30, 08:15, 22:45, 06:00, 12:20, 03:10) so the cyclical
// 0–24h time-since-birth on the case file page shows a different section in focus per baby.
export const caseFiles: CaseFileRecord[] = [
  { id: "PAT-2024-001234", motherLastName: "Johnson", babyGender: "Baby Girl", motherName: "Sarah Johnson", motherAgeYears: 34, motherPatientId: "MTH-2024-00501", birthTime: "14:30", dateOfBirth: "02/19/2025", age: "4 hours", gestationalAgeWeeks: 38, correctedAge: "4 hours", birthWeight: "2.85 kg", currentWeight: "2.84 kg", location: { room: "A320", bed: "07" }, babyLocation: { room: "A320", bed: "07" }, dateCreated: "2025-02-19", lastUpdated: "2025-02-19", status: "High priority" },
  { id: "PAT-2024-001235", motherLastName: "Martinez", babyGender: "Baby Boy", motherName: "Emily Martinez", motherAgeYears: 29, motherPatientId: "MTH-2024-00502", birthTime: "08:15", dateOfBirth: "02/19/2025", age: "10 hours", gestationalAgeWeeks: 37, correctedAge: "10 hours", birthWeight: "3.12 kg", currentWeight: "3.11 kg", location: { room: "A321", bed: "03" }, babyLocation: { room: "A321", bed: "03" }, dateCreated: "2025-02-19", lastUpdated: "2025-02-19", status: "High priority" },
  { id: "PAT-2024-001236", motherLastName: "Chen", babyGender: "Baby Girl", motherName: "Michael Chen", motherAgeYears: 31, motherPatientId: "MTH-2024-00503", birthTime: "22:45", dateOfBirth: "02/18/2025", age: "18 hours", gestationalAgeWeeks: 39, correctedAge: "18 hours", birthWeight: "2.98 kg", currentWeight: "2.97 kg", location: { room: "A318", bed: "12" }, babyLocation: { room: "A318", bed: "12" }, dateCreated: "2025-02-18", lastUpdated: "2025-02-19", status: "Active" },
  { id: "PAT-2024-001237", motherLastName: "Williams", babyGender: "Baby Boy", motherName: "Jessica Williams", motherAgeYears: 27, motherPatientId: "MTH-2024-00504", birthTime: "06:00", dateOfBirth: "02/19/2025", age: "12 hours", gestationalAgeWeeks: 36, correctedAge: "12 hours", birthWeight: "2.65 kg", currentWeight: "2.64 kg", location: { room: "B205", bed: "01" }, babyLocation: { room: "B205", bed: "01" }, dateCreated: "2025-02-19", lastUpdated: "2025-02-19", status: "Active" },
  { id: "PAT-2024-001238", motherLastName: "Brown", babyGender: "Unknown", motherName: "David Brown", motherAgeYears: 35, motherPatientId: "MTH-2024-00505", birthTime: "12:20", dateOfBirth: "02/19/2025", age: "6 hours", gestationalAgeWeeks: 40, correctedAge: "6 hours", birthWeight: "3.22 kg", currentWeight: "3.21 kg", location: { room: "A320", bed: "09" }, babyLocation: { room: "A320", bed: "09" }, dateCreated: "2025-02-19", lastUpdated: "2025-02-19", status: "Active" },
  { id: "PAT-2024-001239", motherLastName: "Davis", babyGender: "Baby Girl", motherName: "Amanda Davis", motherAgeYears: 30, motherPatientId: "MTH-2024-00506", birthTime: "03:10", dateOfBirth: "02/19/2025", age: "15 hours", gestationalAgeWeeks: 38, correctedAge: "15 hours", birthWeight: "2.91 kg", currentWeight: "2.90 kg", location: { room: "B210", bed: "05" }, babyLocation: { room: "B210", bed: "05" }, dateCreated: "2025-02-19", lastUpdated: "2025-02-19", status: "Active" },
]

export function getPatientData(patientId: string): CaseFileRecord | null {
  return caseFiles.find((f) => f.id === patientId) ?? null
}

export function babyTitle(file: CaseFileRecord): string {
  return `${file.motherLastName}, ${file.babyGender}`
}
