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

/** Return all case files. For now uses in-memory data; later: GET /api/case-files */
export function getCaseFiles(): CaseFileRecord[] {
  try {
    return caseFiles
  } catch (err) {
    console.error("[caseFilesService] getCaseFiles failed:", err)
    return []
  }
}

/** Return a single case file by id, or null. For now uses in-memory data; later: GET /api/case-files/:id */
export function getCaseFileById(patientId: string): CaseFileRecord | null {
  try {
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
