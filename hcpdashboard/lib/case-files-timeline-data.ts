import type { CompletionEntry, Note, TimelineItem } from "@/types/case-files"
import { CURRENT_USER_NAME } from "@/lib/constants"

/** Care timeline checklists by section (0-6h, 6-12h, 12-18h, 18-24h). */
export const timelineChecklists: Record<string, TimelineItem[]> = {
  "0-6": [
    { id: "1", label: "MOM conversation", checked: false, description: "Initial conversation with the mother to establish rapport and understand her situation.", hideCheckbox: true, subItems: [{ id: "1a", label: "Build rapport and create a calm, supportive space", checked: false, description: "" }, { id: "1b", label: "Understand the mother's situation, feelings, and experience", checked: false, description: "" }, { id: "1c", label: "Explain next steps and reassure ongoing support", checked: false, description: "" }] },
    { id: "2", label: "Confirm case (Validate patient willingness)", checked: false, description: "Validate the patient's willingness to participate in the care plan and pumping protocol.", hideCheckbox: true, subItems: [{ id: "2a", label: "Confirm willingness to participate", checked: false, description: "" }, { id: "2b", label: "Ensure understanding and readiness of the pumping plan", checked: false, description: "" }, { id: "2c", label: "Address concerns and confirm agreement", checked: false, description: "" }] },
    { id: "3", label: "Pump preparation checklist", hideCheckbox: true, checked: false, description: "Pump Preparation Checklist", subItems: [{ id: "3a", label: "Use a hospital-grade electric breast pump", checked: false, description: "" }, { id: "3b", label: "Select the correct breast shield size", checked: false, description: "" }, { id: "3c", label: "Set suction to a comfortable level", checked: false, description: "" }, { id: "3d", label: "Prepare for double pumping if available", checked: false, description: "" }, { id: "3e", label: "Check milk is flowing effectively", checked: false, description: "" }] },
    { id: "4", label: "First pump: assisted checklist", checked: false, description: "Support mother through her first pumping session.", hideCheckbox: true, subItems: [{ id: "4a", label: "Keep information simple and avoid overwhelming the mother", checked: false, description: "" }, { id: "4b", label: "Support first pumping within 6 hours after birth", checked: false, description: "" }, { id: "4c", label: "Stay with the mother during the entire first pumping session", checked: false, description: "" }, { id: "4d", label: "Explain normal sensations during pumping", checked: false, description: "" }, { id: "4e", label: "Log first pumping session data", checked: false, description: "" }, { id: "4f", label: "Note mother's health and feelings about pumping", checked: false, description: "" }, { id: "4g", label: "Plan the next pumping session if possible", checked: false, description: "" }] },
    { id: "5", label: "Prepare for first consultation with mother", checked: false, description: "Pre-Consultation Checklist", hideCheckbox: true, subItems: [{ id: "5a", label: "Review NICU Mother app (to assist mothers with logging pumping data later)", checked: false, description: "" }, { id: "5b", label: "Review PP1 checklist", checked: false, description: "" }] },
  ],
  "6-12": [
    { id: "6", label: "App Activation", checked: false, description: "App Activation", hideCheckbox: true, subItems: [{ id: "6a", label: "Send activation link for NICU Mom app", checked: false, description: "" }, { id: "6b", label: "Confirm mother can access and use the app", checked: false, description: "" }] },
    { id: "7", label: "Introduce Pumping Pathway", checked: false, description: "Introduce Pumping Pathway", hideCheckbox: true, subItems: [{ id: "7a", label: "Explain the pumping journey and what to expect", checked: false, description: "" }, { id: "7b", label: "Set simple expectations for getting started", checked: false, description: "" }] },
    { id: "8", label: "Milk Volume Expectations", checked: false, description: "Milk Volume Expectations", hideCheckbox: true, subItems: [{ id: "8a", label: "Explain milk volume increases gradually", checked: false, description: "" }, { id: "8b", label: "Clarify efficiency improves during first 14 days", checked: false, description: "" }] },
    { id: "9", label: "MOM Volume Targets", checked: false, description: "MOM Volume Targets", hideCheckbox: true, subItems: [{ id: "9a", label: "Explain milk needed for infant feeding", checked: false, description: "" }, { id: "9b", label: "Explain milk needed to establish long-term milk production (≈ 500 mL/day by day 14)", checked: false, description: "" }] },
    { id: "10", label: "First 14 Days Education", checked: false, description: "First 14 Days Education", hideCheckbox: true, subItems: [{ id: "10a", label: "Explain importance of first 14 postpartum days", checked: false, description: "" }, { id: "10b", label: "Emphasize early pumping supports milk supply", checked: false, description: "" }] },
    { id: "11", label: "Pump Training", checked: false, description: "Pump Training", hideCheckbox: true, subItems: [{ id: "11a", label: "Teach pump basics and safe use", checked: false, description: "" }, { id: "11b", label: "Guide correct assembly and sizing", checked: false, description: "" }, { id: "11c", label: "Explain how to use pump programs", checked: false, description: "" }] },
    { id: "12", label: "Pump Access & Equipment", checked: false, description: "Pump Access & Equipment", hideCheckbox: true, subItems: [{ id: "12a", label: "Explain need for hospital-grade electric pump", checked: false, description: "" }, { id: "12b", label: "Help mother arrange access if needed", checked: false, description: "" }] },
    { id: "13", label: "Pump Operation", checked: false, description: "Pump Operation", hideCheckbox: true, subItems: [{ id: "13a", label: "Demonstrate pump setup", checked: false, description: "" }, { id: "13b", label: "Show how to start pumping program", checked: false, description: "" }, { id: "13c", label: "Explain when to use different pump modes", checked: false, description: "" }] },
    { id: "14", label: "Breast Assessment Before Pumping", checked: false, description: "Breast Assessment Before Pumping", hideCheckbox: true, subItems: [{ id: "14a", label: "Perform breast and nipple assessment before pumping", checked: false, description: "" }, { id: "14b", label: "Teach mother how to identify the nipple base", checked: false, description: "" }, { id: "14c", label: "Explain signs to report immediately (redness, tenderness, irritation)", checked: false, description: "" }, { id: "14d", label: "Show how to report issues in the app", checked: false, description: "" }] },
    { id: "15", label: "Breast Shield Size Personalisation", checked: false, description: "Breast Shield Size Personalisation", hideCheckbox: true, subItems: [{ id: "15a", label: "Assess nipple size and check for areolar edema", checked: false, description: "" }, { id: "15b", label: "Confirm correct shield fit (≤ 1/8 inch areola drawn into tunnel)", checked: false, description: "" }, { id: "15c", label: "Explain shield size may change during first 14 days", checked: false, description: "" }, { id: "15d", label: "Educate warning signs requiring size change (pain, redness, skin breakdown)", checked: false, description: "" }, { id: "15e", label: "Record personalized shield size: Right: ____ mm | Left: ____ mm", checked: false, description: "" }] },
    { id: "16", label: "Assisted Pumping Session", checked: false, description: "Assisted Pumping Session", hideCheckbox: true, subItems: [{ id: "16a", label: "Teach double pumping for efficiency", checked: false, description: "" }, { id: "16b", label: "Stay with mother during first pumping session", checked: false, description: "" }, { id: "16c", label: "Explain normal pumping sensations", checked: false, description: "" }, { id: "16d", label: "Assist mother in measuring and logging milk volume", checked: false, description: "" }, { id: "16e", label: "Check shield positioning and nipple centering", checked: false, description: "" }, { id: "16f", label: "Ensure shield pressure is not pushed into breast tissue", checked: false, description: "" }] },
    { id: "17", label: "Vacuum Pressure Personalisation", checked: false, description: "Vacuum Pressure Personalisation", hideCheckbox: true, subItems: [{ id: "17a", label: "Help mother find maximum comfortable vacuum level", checked: false, description: "" }, { id: "17b", label: "Record personalized vacuum: ____", checked: false, description: "" }, { id: "17c", label: "Explain pressure may change daily", checked: false, description: "" }, { id: "17d", label: "Teach mother how to adjust settings in the app", checked: false, description: "" }, { id: "17e", label: "Explain risks of too much or too little pressure", checked: false, description: "" }] },
    { id: "18", label: "Post-Pumping Assessment", checked: false, description: "Post-Pumping Assessment", hideCheckbox: true, subItems: [{ id: "18a", label: "Observe post-pumping breast and nipple condition", checked: false, description: "" }, { id: "18b", label: "Check for pain, redness, or skin changes", checked: false, description: "" }] },
    { id: "19", label: "Personalized Pumping Plan", checked: false, description: "Personalized Pumping Plan", hideCheckbox: true, subItems: [{ id: "19a", label: "Agree on pumping frequency (minimum 5, ideally 8 times/day)", checked: false, description: "" }, { id: "19b", label: "Explain normal body responses during pumping", checked: false, description: "" }, { id: "19c", label: "Define when to notify lactation team (volume milestones or concerns)", checked: false, description: "" }, { id: "19d", label: "Review red flags: Nipple soreness or skin damage; Persistent lumps, tenderness, or hardness", checked: false, description: "" }, { id: "19e", label: "Show how to create alerts in the app", checked: false, description: "" }, { id: "19f", label: "Add additional personal recommendations", checked: false, description: "" }] },
    { id: "20", label: "Transition to Maintenance Pumping (If Appropriate)", checked: false, description: "Transition to Maintenance Pumping (If Appropriate)", hideCheckbox: true, subItems: [{ id: "20a", label: "Explain switch from initiation to maintenance pattern", checked: false, description: "" }, { id: "20b", label: "Transition when milk volume ≥ 20 mL combined (typically day 2–6)", checked: false, description: "" }] },
  ],
  "12-18": [
    { id: "s12-1", label: "Follow-Up & PP2 Preparation", checked: false, description: "Follow-Up & PP2 Preparation Checklist", hideCheckbox: true, subItems: [{ id: "s12-1a", label: "Check mother is logging minimum 5 pumping sessions/day", checked: false, description: "" }, { id: "s12-1b", label: "If milk volume ≥ 20 mL combined, instruct change of pumping program", checked: false, description: "" }, { id: "s12-1c", label: "Review mother's app activity and video progress", checked: false, description: "" }, { id: "s12-1d", label: "Check if reminders or clarifications are needed", checked: false, description: "" }, { id: "s12-1e", label: "Review PP2 checklist before consultation", checked: false, description: "" }] },
  ],
  "18-24": [
    { id: "s18-1", label: "test data", checked: false, description: "Test data", hideCheckbox: true, subItems: [{ id: "s18-1a", label: "Test item 1", checked: false, description: "" }, { id: "s18-1b", label: "Test item 2", checked: false, description: "" }, { id: "s18-1c", label: "Test item 3", checked: false, description: "" }, { id: "s18-1d", label: "Test item 4", checked: false, description: "" }, { id: "s18-1e", label: "Test item 5", checked: false, description: "" }] },
  ],
}

/** Set of all timeline item ids (top-level + sub). Used so the "mock" demo case file can show a fully completed care timeline without the user clicking through every item. */
export function getAllTimelineItemIds(): Set<string> {
  const ids = new Set<string>()
  for (const section of Object.values(timelineChecklists)) {
    for (const item of section) {
      ids.add(item.id)
      if (item.subItems) for (const sub of item.subItems) ids.add(sub.id)
    }
  }
  return ids
}

/** Mock completion log and notes for the demo "mock" case file so we can showcase the Log sheet and completed timeline without real backend. */
export function getMockLogData(): { completionLog: CompletionEntry[]; patientNotes: Note[] } {
  const base = new Date()
  base.setDate(base.getDate() - 1)
  const ts = (h: number, m: number) => {
    const d = new Date(base)
    d.setHours(h, m, 0, 0)
    return d
  }
  return {
    completionLog: [
      { id: "mock-c1", by: CURRENT_USER_NAME, itemLabel: "MOM conversation", timestamp: ts(9, 15) },
      { id: "mock-c2", by: CURRENT_USER_NAME, itemLabel: "Confirm case (Validate patient willingness)", timestamp: ts(9, 45) },
      { id: "mock-c3", by: CURRENT_USER_NAME, itemLabel: "Pump preparation checklist", timestamp: ts(10, 20) },
      { id: "mock-c4", by: CURRENT_USER_NAME, itemLabel: "First pump: assisted checklist", timestamp: ts(11, 0) },
      { id: "mock-c5", by: CURRENT_USER_NAME, itemLabel: "App Activation", timestamp: ts(14, 30) },
      { id: "mock-c6", by: CURRENT_USER_NAME, itemLabel: "Introduce Pumping Pathway", timestamp: ts(15, 0) },
      { id: "mock-c7", by: CURRENT_USER_NAME, itemLabel: "Personalized Pumping Plan", timestamp: ts(16, 45) },
      { id: "mock-c8", by: CURRENT_USER_NAME, itemLabel: "Follow-Up & PP2 Preparation", timestamp: ts(20, 10) },
    ],
    patientNotes: [
      { id: "mock-n1", text: "Mother comfortable with pump setup. Will use NICU Mom app for logging.", timestamp: ts(11, 30), source: "First pump: assisted checklist" },
      { id: "mock-n2", text: "Shield size 24mm both sides. Vacuum set to comfortable max.", timestamp: ts(12, 0), source: "Breast Shield Size Personalisation" },
      { id: "mock-n3", text: "Next follow-up scheduled. Mother asked about night pumping—advised to maintain 8x/day.", timestamp: ts(16, 50), source: "Personalized Pumping Plan" },
    ],
  }
}
