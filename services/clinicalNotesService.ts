/**
 * Clinical notes data access. All clinical-note reads go through this service.
 * When the backend is ready, replace lib calls with apiRequest(...).
 */

import type { ClinicalNoteCategory } from "@/types/clinical-notes"
import { getClinicalNotesForCase as libGetClinicalNotesForCase } from "@/lib/clinical-notes-data"
import type { ParsedDashboardData } from "@/lib/dashboard-data-parser"

/** Return clinical note categories for a case. Prefers live dashboard data when provided. */
export function getClinicalNotesByCaseId(
  caseId: string,
  dashboard?: ParsedDashboardData | null
): ClinicalNoteCategory[] {
  try {
    const extras = dashboard?.extrasByPatientId[caseId]
    if (extras) return extras.clinicalNotes
    return libGetClinicalNotesForCase(caseId)
  } catch (err) {
    console.error("[clinicalNotesService] getClinicalNotesByCaseId failed:", caseId, err)
    return []
  }
}
