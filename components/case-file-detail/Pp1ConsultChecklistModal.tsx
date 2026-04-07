"use client"

import * as React from "react"
import {
  AlertCircle,
  ChevronDown,
  FileText,
  Save,
  Send,
  Smartphone,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { Accordion, Dialog, Progress } from "radix-ui"

import type { Pp1Block, Pp1ConsultStep, Pp1InfoBoxVariant } from "@/types/pp1-consult-checklist"
import { PP1_CONSULT_STEPS } from "@/lib/pp1-consult-checklist-data"
import { collectCheckableIdsForStep } from "@/lib/pp1-consult-checklist-state"
import { usePp1ConsultChecklist } from "@/hooks/use-pp1-consult-checklist"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

function infoBoxClasses(variant: Pp1InfoBoxVariant): string {
  switch (variant) {
    case "transition":
      return "border-pink-200 bg-pink-50 text-pink-950 dark:border-pink-900/50 dark:bg-pink-950/30 dark:text-pink-100"
    case "notify":
      return "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900/50 dark:bg-sky-950/35 dark:text-sky-100"
    case "normal":
      return "border-teal-200 bg-teal-50 text-teal-950 dark:border-teal-900/50 dark:bg-teal-950/35 dark:text-teal-100"
    case "redFlags":
      return "border-red-200 bg-red-50 text-red-950 dark:border-red-900/50 dark:bg-red-950/35 dark:text-red-100"
    default:
      return "border-border bg-muted"
  }
}

function Pp1BlockView({
  block,
  checked,
  onToggle,
}: {
  block: Pp1Block
  checked: ReadonlySet<string>
  onToggle: (id: string, value: boolean) => void
}) {
  switch (block.type) {
    case "checkbox":
      return (
        <div className="flex gap-3 rounded-lg border border-border bg-background p-3">
          <Checkbox
            id={block.id}
            checked={checked.has(block.id)}
            onCheckedChange={(v) => onToggle(block.id, v === true)}
            className="mt-0.5"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <Label htmlFor={block.id} className="cursor-pointer text-sm font-medium leading-snug">
              {block.label}
            </Label>
            {block.description ? (
              <p className="text-xs text-muted-foreground">{block.description}</p>
            ) : null}
          </div>
        </div>
      )
    case "protocolCallout":
      return (
        <div className="rounded-lg border border-sky-200 bg-sky-50/90 p-4 dark:border-sky-900/50 dark:bg-sky-950/40">
          <p className="text-sm font-medium text-sky-900 dark:text-sky-100">{block.title}</p>
          {block.body ? (
            <p className="mt-2 text-xs text-sky-800/90 dark:text-sky-200/90">{block.body}</p>
          ) : null}
        </div>
      )
    case "educationSheet":
      return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-2.5 dark:border-emerald-900/50 dark:bg-emerald-950/35">
          <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{block.title}</p>
          <Smartphone className="size-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden />
        </div>
      )
    case "videoLinks":
      return (
        <div className="rounded-lg border border-sky-200 bg-sky-50/80 p-3 dark:border-sky-900/50 dark:bg-sky-950/35">
          {block.heading ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">
              {block.heading}
            </p>
          ) : null}
          <ul className="space-y-1.5">
            {block.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-primary underline-offset-2 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )
    case "pumpConnect":
      return (
        <div className="rounded-lg border border-sky-200 bg-sky-50/90 p-4 dark:border-sky-900/50 dark:bg-sky-950/40">
          <p className="text-sm font-semibold text-sky-900 dark:text-sky-100">{block.title}</p>
          <Button
            type="button"
            className="mt-3 w-full bg-violet-600 text-white hover:bg-violet-700 sm:w-auto"
            onClick={() => toast.message("Connect pump", { description: "Assignment flow not wired yet." })}
          >
            {block.buttonLabel}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">{block.helperText}</p>
        </div>
      )
    case "infoBox":
      return (
        <div
          className={cn(
            "rounded-lg border p-3 text-sm",
            infoBoxClasses(block.variant)
          )}
        >
          <div className="flex items-start gap-2">
            {block.showWarningIcon ? (
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{block.title}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed opacity-95">
                {block.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    case "textField":
      return (
        <div className="space-y-2">
          <Label htmlFor={block.id} className="text-sm font-medium">
            {block.label}
          </Label>
          <textarea
            id={block.id}
            rows={block.rows ?? 3}
            placeholder={block.placeholder}
            className={cn(
              "border-input placeholder:text-muted-foreground flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none",
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "dark:bg-input/30"
            )}
          />
        </div>
      )
    case "selectField":
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{block.label}</Label>
          <Select>
            <SelectTrigger className="w-full max-w-md" size="sm">
              <SelectValue placeholder={block.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {block.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    case "numberedPoints":
      return (
        <div className="rounded-lg border border-sky-200 bg-sky-50/70 p-3 dark:border-sky-900/50 dark:bg-sky-950/30">
          <ol className="list-decimal space-y-3 pl-4 text-sm">
            {block.items.map((item, i) => (
              <li key={i} className="pl-1">
                <span className="font-medium text-foreground">{item.title}</span>
                {item.description ? (
                  <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      )
    case "nestedCheckboxes":
      return (
        <div className="space-y-2 rounded-md border border-dashed border-border p-3">
          {block.intro ? <p className="text-xs text-muted-foreground">{block.intro}</p> : null}
          {block.items.map((item) => (
            <div key={item.id} className="flex gap-2">
              <Checkbox
                id={item.id}
                checked={checked.has(item.id)}
                onCheckedChange={(v) => onToggle(item.id, v === true)}
              />
              <Label htmlFor={item.id} className="cursor-pointer text-sm font-normal leading-snug">
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      )
    case "sessionInputs":
      return (
        <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{block.minLabel}</Label>
              <Input type="text" defaultValue={block.minDefault} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{block.optimalLabel}</Label>
              <Input type="text" defaultValue={block.optimalDefault} className="h-9" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{block.helpText}</p>
        </div>
      )
    default:
      return null
  }
}

export function Pp1ConsultChecklistModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const steps = PP1_CONSULT_STEPS
  const {
    checked,
    toggle,
    selectAllForStep,
    reset,
    completedSteps,
    totalSteps,
    stepBarPercent,
    stepProgress,
  } = usePp1ConsultChecklist(steps)

  React.useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const handleSaveDraft = () => {
    toast.success("Draft saved", {
      description: "PP1 checklist draft stored locally (demo only).",
    })
  }

  const handleSendMotherApp = () => {
    toast.success("Sent to Mother’s App", { description: "Push notification not wired — demo only." })
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border bg-card p-0 shadow-xl outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
          onEscapeKeyDown={() => onOpenChange(false)}
        >
          <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="text-lg font-semibold leading-tight">
                  Initial Lactation Consult
                </Dialog.Title>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <span>Overall Progress</span>
                    <span className="tabular-nums">
                      {completedSteps} / {totalSteps} steps
                    </span>
                  </div>
                  <Progress.Root
                    value={stepBarPercent}
                    max={100}
                    className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
                  >
                    <Progress.Indicator
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${stepBarPercent}%` }}
                    />
                  </Progress.Root>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <Dialog.Close
                type="button"
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Close"
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <Accordion.Root type="multiple" className="space-y-2">
              {steps.map((step) => (
                <Pp1StepAccordionItem
                  key={step.id}
                  step={step}
                  checked={checked}
                  onToggle={toggle}
                  onSelectAll={selectAllForStep}
                  stepProgress={stepProgress}
                />
              ))}
            </Accordion.Root>
          </div>

          <div className="shrink-0 border-t bg-card px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <Button type="button" variant="outline" className="gap-1.5" onClick={handleSaveDraft}>
                  <Save className="size-4" aria-hidden />
                  Save Draft
                </Button>
                <Button type="button" className="gap-1.5" onClick={handleSendMotherApp}>
                  <Send className="size-4" aria-hidden />
                  Send to Mother&apos;s App
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Pp1StepAccordionItem({
  step,
  checked,
  onToggle,
  onSelectAll,
  stepProgress,
}: {
  step: Pp1ConsultStep
  checked: ReadonlySet<string>
  onToggle: (id: string, value: boolean) => void
  onSelectAll: (step: Pp1ConsultStep, value: boolean) => void
  stepProgress: (step: Pp1ConsultStep) => { done: number; total: number; complete: boolean }
}) {
  const { done, total } = stepProgress(step)
  const ids = collectCheckableIdsForStep(step)
  const allChecked = total > 0 && done === total

  return (
    <Accordion.Item
      value={step.id}
      className="overflow-hidden rounded-lg border border-border bg-background shadow-xs"
    >
      <Accordion.Header className="flex">
        <Accordion.Trigger className="flex flex-1 items-center gap-3 px-4 py-3 text-left outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring [&[data-state=open]>svg:last-child]:rotate-180">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {step.number}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-foreground">{step.title}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{step.description}</span>
          </span>
          <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-200" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden">
        <div className="space-y-4 border-t border-border px-4 py-4">
          {step.showStepToolbar && total > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`select-all-${step.id}`}
                  checked={allChecked}
                  onCheckedChange={(v) => onSelectAll(step, v === true)}
                />
                <Label htmlFor={`select-all-${step.id}`} className="cursor-pointer text-sm font-medium">
                  Select All
                </Label>
              </div>
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {done}/{total} completed
              </span>
            </div>
          ) : null}
          <div className="space-y-4">
            {step.blocks.map((block, i) => (
              <Pp1BlockView key={i} block={block} checked={checked} onToggle={onToggle} />
            ))}
          </div>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  )
}
