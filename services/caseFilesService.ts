/**
 * Case files data access. All case-file reads go through this service.
 * When the backend is ready, replace lib calls with apiRequest(getApiBaseUrl() + '/api/case-files', ...).
 */

import type { CaseFileRecord } from "@/types/case-files"
import {
  caseFiles,
  getPatientData as libGetPatientData,
  babyTitle as libBabyTitle,
} from "@/lib/case-files-data"
import type { ParsedDashboardData } from "@/lib/dashboard-data-parser"

/** Return all case files. Prefers live dashboard data when provided. */
export function getCaseFiles(dashboard?: ParsedDashboardData | null): CaseFileRecord[] {
  try {
    if (dashboard) return dashboard.caseFiles
    return caseFiles
  } catch (err) {
    console.error("[caseFilesService] getCaseFiles failed:", err)
    return []
  }
}

/** Return a single case file by id, or null. Prefers live dashboard data when provided. */
export function getCaseFileById(
  patientId: string,
  dashboard?: ParsedDashboardData | null
): CaseFileRecord | null {
  try {
    if (dashboard) {
      return dashboard.caseFiles.find((file) => file.id === patientId) ?? null
    }
    return libGetPatientData(patientId)
  } catch (err) {
    console.error("[caseFilesService] getCaseFileById failed:", patientId, err)
    return null
  }
}

/** Display label for a case file (e.g. "Johnson, Baby Girl"). */
export function getBabyTitle(file: CaseFileRecord): string {
  return libBabyTitle(file)
}
