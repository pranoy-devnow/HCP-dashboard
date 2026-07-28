import type { ClinicalNoteCategory } from "@/types/clinical-notes"

/** Mock clinical notes for a case file. Replace with API data later. */
export function getClinicalNotesForCase(_caseId: string): ClinicalNoteCategory[] {
  return [
    {
      id: "interventions",
      title: "Interventions",
      description: "Documented clinical interventions for this case",
      content: [
        "Initiated early and frequent pumping schedule within the first hour after birth.",
        "Provided hands-on latch support and positioning guidance during first feeding attempt.",
        "Started skin-to-skin contact protocol and reviewed milk expression technique with the mother.",
      ],
    },
    {
      id: "follow-up",
      title: "Follow-up",
      description: "Planned follow-up actions and checkpoints",
      content: [
        "Reassess milk transfer and pumping volumes at 24 hours post-birth.",
        "Schedule lactation consult if average daily volume remains below target after day 3.",
        "Confirm mother has access to Medela Family app and remote support resources before discharge.",
      ],
    },
    {
      id: "recommendations",
      title: "Recommendations",
      description: "Clinical recommendations for care team and family",
      content: [
        "Continue pumping 8–12 times per 24 hours, including at least one overnight session.",
        "Prioritize double pumping with massage to support initiation-phase volumes.",
        "Escalate to specialist review if maternal risk factors affect milk production or infant feeding readiness.",
      ],
    },
  ]
}
