import type { Pp1Block, Pp1ConsultStep } from "@/types/pp1-consult-checklist"

/** Collect every checkbox id under a block tree (checkbox + nestedCheckboxes). */
export function collectCheckableIdsFromBlock(block: Pp1Block): string[] {
  if (block.type === "checkbox") return [block.id]
  if (block.type === "nestedCheckboxes") return block.items.map((i) => i.id)
  return []
}

export function collectCheckableIdsForStep(step: Pp1ConsultStep): string[] {
  const ids: string[] = []
  for (const block of step.blocks) {
    ids.push(...collectCheckableIdsFromBlock(block))
  }
  return ids
}

export function collectAllCheckableIds(steps: Pp1ConsultStep[]): string[] {
  const set = new Set<string>()
  for (const step of steps) {
    for (const id of collectCheckableIdsForStep(step)) {
      set.add(id)
    }
  }
  return [...set]
}

export function countChecked(ids: string[], checked: ReadonlySet<string>): number {
  return ids.filter((id) => checked.has(id)).length
}

/** Step is complete when every checkable id in that step is checked. */
export function isStepComplete(step: Pp1ConsultStep, checked: ReadonlySet<string>): boolean {
  const ids = collectCheckableIdsForStep(step)
  if (ids.length === 0) return true
  return ids.every((id) => checked.has(id))
}

export function countCompletedSteps(steps: Pp1ConsultStep[], checked: ReadonlySet<string>): number {
  return steps.filter((s) => isStepComplete(s, checked)).length
}

export function isFormComplete(steps: Pp1ConsultStep[], checked: ReadonlySet<string>): boolean {
  const all = collectAllCheckableIds(steps)
  return all.length > 0 && all.every((id) => checked.has(id))
}

/** Integer 0–100 for footer / bar (by checkbox count). */
export function percentCheckboxesComplete(
  steps: Pp1ConsultStep[],
  checked: ReadonlySet<string>
): number {
  const all = collectAllCheckableIds(steps)
  if (all.length === 0) return 100
  return Math.round((countChecked(all, checked) / all.length) * 100)
}

/** Progress bar fill 0–100 from completed steps (8 steps). */
export function percentStepsComplete(steps: Pp1ConsultStep[], checked: ReadonlySet<string>): number {
  if (steps.length === 0) return 0
  return Math.round((countCompletedSteps(steps, checked) / steps.length) * 100)
}

export function toggleId(checked: Set<string>, id: string, next: boolean): Set<string> {
  const n = new Set(checked)
  if (next) n.add(id)
  else n.delete(id)
  return n
}

export function setAllForStep(
  checked: Set<string>,
  step: Pp1ConsultStep,
  next: boolean
): Set<string> {
  const ids = collectCheckableIdsForStep(step)
  const n = new Set(checked)
  for (const id of ids) {
    if (next) n.add(id)
    else n.delete(id)
  }
  return n
}
