/**
 * Clinical notes data access. All clinical-note reads go through this service.
 * When the backend is ready, replace lib calls with apiRequest(...).
 */

import type { ClinicalNoteCategory } from "@/types/clinical-notes"
import { getClinicalNotesForCase as libGetClinicalNotesForCase } from "@/lib/clinical-notes-data"

/** Return clinical note categories for a case. For now uses in-memory data. */
export function getClinicalNotesByCaseId(caseId: string): ClinicalNoteCategory[] {
  try {
    return libGetClinicalNotesForCase(caseId)
  } catch (err) {
    console.error("[clinicalNotesService] getClinicalNotesByCaseId failed:", caseId, err)
    return []
  }
}
