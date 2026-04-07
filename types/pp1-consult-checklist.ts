/**
 * Schema for the Initial Lactation Consult (PP1) checklist modal.
 * Checkable items use stable `id` strings for progress and “Select all”.
 */

export type Pp1CheckboxBlock = {
  type: "checkbox"
  id: string
  label: string
  description?: string
}

export type Pp1ProtocolCalloutBlock = {
  type: "protocolCallout"
  title: string
  body?: string
}

export type Pp1EducationSheetBlock = {
  type: "educationSheet"
  title: string
}

export type Pp1VideoLinksBlock = {
  type: "videoLinks"
  heading?: string
  links: { label: string; href: string }[]
}

export type Pp1PumpConnectBlock = {
  type: "pumpConnect"
  title: string
  buttonLabel: string
  helperText: string
}

export type Pp1InfoBoxVariant = "transition" | "notify" | "normal" | "redFlags"

export type Pp1InfoBoxBlock = {
  type: "infoBox"
  variant: Pp1InfoBoxVariant
  title: string
  bullets: string[]
  showWarningIcon?: boolean
}

export type Pp1TextFieldBlock = {
  type: "textField"
  id: string
  label: string
  placeholder: string
  rows?: number
}

export type Pp1SelectFieldBlock = {
  type: "selectField"
  id: string
  label: string
  placeholder: string
  options: { value: string; label: string }[]
}

export type Pp1NumberedPointsBlock = {
  type: "numberedPoints"
  items: { title: string; description?: string }[]
}

export type Pp1NestedCheckboxesBlock = {
  type: "nestedCheckboxes"
  intro?: string
  items: { id: string; label: string }[]
}

export type Pp1SessionInputsBlock = {
  type: "sessionInputs"
  minLabel: string
  optimalLabel: string
  minDefault?: string
  optimalDefault?: string
  helpText: string
}

export type Pp1Block =
  | Pp1CheckboxBlock
  | Pp1ProtocolCalloutBlock
  | Pp1EducationSheetBlock
  | Pp1VideoLinksBlock
  | Pp1PumpConnectBlock
  | Pp1InfoBoxBlock
  | Pp1TextFieldBlock
  | Pp1SelectFieldBlock
  | Pp1NumberedPointsBlock
  | Pp1NestedCheckboxesBlock
  | Pp1SessionInputsBlock

export type Pp1ConsultStep = {
  /** Accordion item value */
  id: string
  number: number
  title: string
  description: string
  blocks: Pp1Block[]
  /** Show per-step “Select all” + “x / n completed” in expanded header row */
  showStepToolbar?: boolean
}
