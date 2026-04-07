import type { Pp1ConsultStep } from "@/types/pp1-consult-checklist"

const href = "#"

/** Static copy from Initial Lactation Consult / PP1 checklist designs. */
export const PP1_CONSULT_STEPS: Pp1ConsultStep[] = [
  {
    id: "step-1",
    number: 1,
    title: "Introduce Pumping Pathway",
    description: "Educational components and platform orientation",
    showStepToolbar: true,
    blocks: [
      {
        type: "protocolCallout",
        title: "Protocol: \"Providing Milk for Your NICU Baby: Getting Started\"",
        body: "Review with mother as an orientation to pumping in the NICU context.",
      },
      {
        type: "checkbox",
        id: "s1-a",
        label: "Review importance of first 14 postpartum days for mammary gland programming",
        description: "Explain critical window for establishing milk production capacity.",
      },
      {
        type: "checkbox",
        id: "s1-b",
        label: "Review typical daily rate of increase in pumped milk volume",
        description:
          "Emphasize that pumping becomes more efficient over the first 14 days and volumes often increase gradually.",
      },
      {
        type: "educationSheet",
        title: "Education Sheet: \"What is a Normal Amount of Milk to Pump for my NICU Baby?\"",
      },
      {
        type: "checkbox",
        id: "s1-c",
        label: "Clarify that there are two MOM volume targets",
      },
      {
        type: "numberedPoints",
        items: [
          {
            title: "Enough for exclusive MOM feeds for infant",
            description: "Volume aligned with baby’s prescribed feeding plan.",
          },
          {
            title: "Enough to regulate lactation processes",
            description: "Sustained stimulation and drainage to protect long-term supply.",
          },
        ],
      },
    ],
  },
  {
    id: "step-2",
    number: 2,
    title: "Help Mother Pump Within 6 Hours After Birth",
    description: "First pumping session timing and support",
    showStepToolbar: true,
    blocks: [
      {
        type: "checkbox",
        id: "s2-a",
        label: "Remains with mother for entire first pumping session (after DR pumping)",
      },
      {
        type: "checkbox",
        id: "s2-b",
        label: "Uses hospital-grade electric breast pump with Initiation BPSP",
      },
      {
        type: "educationSheet",
        title: "Education Sheet: \"Does the Type of Breast Pump Matter for a NICU Mom?\"",
      },
      {
        type: "checkbox",
        id: "s2-c",
        label: "Reviews normal sensations that accompany breast pump use",
      },
      {
        type: "educationSheet",
        title: "Education Sheet: \"What Will I Feel When I Use the Breast Pump for My NICU Baby?\"",
      },
      {
        type: "checkbox",
        id: "s2-d",
        label:
          "Reviews importance of hospital-grade electric breast pump for in-home use, and helps mother access the pump",
      },
      {
        type: "pumpConnect",
        title: "Connect Hospital-Grade Breast Pump:",
        buttonLabel: "+ Connect Rental Pump",
        helperText: "Digitally assign a hospital-grade pump to this patient.",
      },
      {
        type: "checkbox",
        id: "s2-e",
        label: "Teaches simultaneous (double) pumping for greater effectiveness and efficiency of milk removal",
      },
      {
        type: "checkbox",
        id: "s2-f",
        label: "Instructs mother to change from initiation to maintenance pattern",
      },
      {
        type: "infoBox",
        variant: "transition",
        title: "When to transition:",
        bullets: [
          "When milk volume is ≥20mls from both breasts combined (usually 2-6 days)",
          "OR When MOM Na level is <16 mMol (if measured)",
        ],
      },
    ],
  },
  {
    id: "step-3",
    number: 3,
    title: "Perform Breast Assessment",
    description: "Evaluate nipple anatomy and breast tissue",
    showStepToolbar: true,
    blocks: [
      {
        type: "videoLinks",
        heading: "Educational Videos:",
        links: [
          { label: "Evaluating the Nipple Base", href },
          { label: "Evaluating Nipple Circumference", href },
          { label: "Evaluating Nipple Elasticity", href },
        ],
      },
      {
        type: "checkbox",
        id: "s3-a",
        label: "Teaches mother to identify the nipple base",
      },
      {
        type: "checkbox",
        id: "s3-b",
        label:
          "Teaches mother to notify lactation experts immediately if tenderness/redness noted in the nipple base",
      },
    ],
  },
  {
    id: "step-4",
    number: 4,
    title: "Personalize Breast Shield Size",
    description: "Determine optimal shield size for each breast",
    showStepToolbar: true,
    blocks: [
      {
        type: "videoLinks",
        heading: "Educational Videos:",
        links: [
          {
            label: "Considerations when Choosing a Breast Shield for a Pump-Dependent Mother",
            href,
          },
          { label: "Getting the Right Fit: Breast Shields", href },
          { label: "When the Breast Shield is too Large: How to Assess and Adjust", href },
        ],
      },
      {
        type: "checkbox",
        id: "s4-a",
        label: "Breast shield sizes personalized",
        description: "Select appropriate size based on nipple measurements.",
      },
      {
        type: "selectField",
        id: "s4-left-shield",
        label: "Left Breast Shield Size",
        placeholder: "Select...",
        options: [
          { value: "21", label: "21 mm" },
          { value: "24", label: "24 mm" },
          { value: "27", label: "27 mm" },
          { value: "30", label: "30 mm" },
        ],
      },
      {
        type: "selectField",
        id: "s4-right-shield",
        label: "Right Breast Shield Size",
        placeholder: "Select...",
        options: [
          { value: "21", label: "21 mm" },
          { value: "24", label: "24 mm" },
          { value: "27", label: "27 mm" },
          { value: "30", label: "30 mm" },
        ],
      },
      {
        type: "textField",
        id: "s4-notes",
        label: "Sizing Notes",
        placeholder: "Document rationale for sizing choices...",
        rows: 3,
      },
      {
        type: "checkbox",
        id: "s4-b",
        label: "Assesses nipple and checks for areolar edema",
      },
      {
        type: "checkbox",
        id: "s4-c",
        label:
          "Teaches that no more than 1/8 inch of areola is drawn into breast shield during pumping",
      },
      {
        type: "checkbox",
        id: "s4-d",
        label:
          "Teaches that breast shield size can change many times in first 14 days, depending upon nipple elasticity and changes in edema",
      },
      {
        type: "checkbox",
        id: "s4-e",
        label:
          "Alerts mother that redness, tenderness or skin breakdown at base of the nipple may indicate need for breast shield size change",
      },
    ],
  },
  {
    id: "step-5",
    number: 5,
    title: "Check that Breast Shields are Applied Correctly To Each Breast",
    description: "Verify proper positioning and application",
    showStepToolbar: true,
    blocks: [
      {
        type: "educationSheet",
        title: "Education Sheet: \"What Should I Watch for When I'm Pumping\"",
      },
      {
        type: "videoLinks",
        heading: "Educational Videos:",
        links: [
          { label: "Centering the Nipple in the Breast Shield", href },
          { label: "When the Breast Shield is Off-Center…", href },
          { label: "Attaining Optimal Breast Shield Pressure", href },
        ],
      },
      {
        type: "checkbox",
        id: "s5-a",
        label: "Breast shield application verified",
      },
      {
        type: "textField",
        id: "s5-notes",
        label: "Application Notes",
        placeholder: "Document application quality, any adjustments made...",
        rows: 3,
      },
      {
        type: "nestedCheckboxes",
        items: [
          { id: "s5-n1", label: "Nipple is centered in the tunnel of the breast shield" },
          { id: "s5-n2", label: "Breast shield is not pushed into breast tissue" },
        ],
      },
    ],
  },
  {
    id: "step-6",
    number: 6,
    title: "Help Mother Personalize Maximum Comfortable Vacuum Pressure",
    description: "Determine optimal vacuum settings",
    showStepToolbar: true,
    blocks: [
      {
        type: "videoLinks",
        links: [{ label: "Educational Video: \"Optimizing Milk Removal While Pumping\"", href }],
      },
      {
        type: "checkbox",
        id: "s6-a",
        label: "Maximum comfortable vacuum pressure determined",
      },
      {
        type: "selectField",
        id: "s6-vacuum",
        label: "Maximum Comfort Vacuum (1-20)",
        placeholder: "Select level...",
        options: Array.from({ length: 20 }, (_, i) => ({
          value: String(i + 1),
          label: String(i + 1),
        })),
      },
      {
        type: "textField",
        id: "s6-vacuum-notes",
        label: "Vacuum Setting Notes",
        placeholder: "Document mother's response to different vacuum levels...",
        rows: 3,
      },
      {
        type: "checkbox",
        id: "s6-b",
        label: "Alert mother that maximum comfortable vacuum pressures can change day-by-day",
      },
      {
        type: "checkbox",
        id: "s6-c",
        label: "Teach mother to re-evaluate maximum comfortable vacuum pressures each day",
      },
      {
        type: "checkbox",
        id: "s6-d",
        label:
          "Teach that too much pressure can cause pain and redness/blisters on the nipple tip and doesn't remove more milk",
      },
      {
        type: "checkbox",
        id: "s6-e",
        label:
          "Teach that too little pressure is inefficient (more time pumping) and may not remove all of the milk",
      },
    ],
  },
  {
    id: "step-7",
    number: 7,
    title: "Observe Mother Complete Post-Pumping Breast Assessment",
    description: "Teach and observe self-assessment after pumping",
    showStepToolbar: true,
    blocks: [
      {
        type: "checkbox",
        id: "s7-a",
        label: "Mother demonstrated post-pumping breast assessment",
        description: "Observe mother checking breast and nipple condition.",
      },
      {
        type: "textField",
        id: "s7-notes",
        label: "Post-Pumping Assessment Notes",
        placeholder:
          "Document observations: nipple color, texture, breast softness, any redness, blanching, or discomfort...",
        rows: 4,
      },
    ],
  },
  {
    id: "step-8",
    number: 8,
    title: "Personalized Pumping Plan Developed with Mother",
    description: "Create individualized schedule and care plan",
    showStepToolbar: true,
    blocks: [
      {
        type: "checkbox",
        id: "s8-a",
        label: "Personalized pumping plan created",
      },
      {
        type: "sessionInputs",
        minLabel: "Minimum Daily Sessions",
        optimalLabel: "Optimal Daily Sessions",
        minDefault: "5",
        optimalDefault: "8",
        helpText: "Standard recommendation: Pump minimum of 5 times (optimally 8 times) daily.",
      },
      {
        type: "checkbox",
        id: "s8-b",
        label: "Notification instructions provided",
      },
      {
        type: "infoBox",
        variant: "notify",
        title: "Notify lactation team when:",
        bullets: [
          "Milk volume is at least 20mLs from both breasts combined.",
          "Milk Na+ level is <16mMols (if measured).",
        ],
      },
      {
        type: "checkbox",
        id: "s8-c",
        label: "Normal pumping-related responses reviewed",
      },
      {
        type: "infoBox",
        variant: "normal",
        title: "Assure normalcy of:",
        bullets: [
          "Uterine contractions (after-birth pains).",
          "Vaginal bleeding during/after pumping.",
          "Sleepiness.",
        ],
      },
      {
        type: "checkbox",
        id: "s8-d",
        label: "Red flags reviewed - notify lactation team if observed",
      },
      {
        type: "infoBox",
        variant: "redFlags",
        title: "Contact lactation team immediately if:",
        bullets: [
          "24-hour milk volume decreasing from 1 day to the next.",
          "Nipple soreness, broken skin, redness at either base or tip of nipple.",
          "Areas of breast that are lumpy, tender or hard - that do not improve with pumping.",
        ],
        showWarningIcon: true,
      },
      {
        type: "textField",
        id: "s8-recs",
        label: "Additional Personal Recommendations",
        placeholder:
          "Document any specific considerations, concerns, or tailored recommendations for this mother...",
        rows: 4,
      },
    ],
  },
]
