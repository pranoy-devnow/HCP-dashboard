"use client"

import * as React from "react"
import type { Pp1ConsultStep } from "@/types/pp1-consult-checklist"
import {
  collectCheckableIdsForStep,
  countChecked,
  countCompletedSteps,
  isFormComplete,
  isStepComplete,
  percentCheckboxesComplete,
  percentStepsComplete,
  setAllForStep,
  toggleId,
} from "@/lib/pp1-consult-checklist-state"

export function usePp1ConsultChecklist(steps: Pp1ConsultStep[]) {
  const [checked, setChecked] = React.useState<Set<string>>(() => new Set())

  const toggle = React.useCallback((id: string, value: boolean) => {
    setChecked((prev) => toggleId(prev, id, value))
  }, [])

  const selectAllForStep = React.useCallback((step: Pp1ConsultStep, value: boolean) => {
    setChecked((prev) => setAllForStep(prev, step, value))
  }, [])

  const reset = React.useCallback(() => {
    setChecked(new Set())
  }, [])

  const completedSteps = countCompletedSteps(steps, checked)
  const totalSteps = steps.length
  const formComplete = isFormComplete(steps, checked)
  const checkboxPercent = percentCheckboxesComplete(steps, checked)
  const stepBarPercent = percentStepsComplete(steps, checked)

  const stepProgress = React.useCallback(
    (step: Pp1ConsultStep) => {
      const ids = collectCheckableIdsForStep(step)
      const done = countChecked(ids, checked)
      return { done, total: ids.length, complete: isStepComplete(step, checked) }
    },
    [checked]
  )

  return {
    checked,
    toggle,
    selectAllForStep,
    reset,
    completedSteps,
    totalSteps,
    formComplete,
    checkboxPercent,
    stepBarPercent,
    stepProgress,
  }
}
