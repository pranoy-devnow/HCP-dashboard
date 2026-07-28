/** Clinical note categories shown on the case file detail page. */

export type ClinicalNoteCategoryId =
  | "interventions"
  | "follow-up"
  | "recommendations"

export interface ClinicalNoteCategory {
  id: ClinicalNoteCategoryId
  title: string
  description: string
  /** Body paragraphs shown in the detail modal. */
  content: string[]
}
