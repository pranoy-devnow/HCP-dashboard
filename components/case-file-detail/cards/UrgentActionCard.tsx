"use client"

import * as React from "react"
import { Clock, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { UrgentActionCardData } from "@/types/case-file-detail-cards"

/** Avoid "until until …" when subtitle already starts with "Until". */
function phaseDescription(subtitle: string): string {
  return subtitle.replace(/^\s*until\s+/i, "").trim()
}

export interface UrgentActionCardProps {
  data: UrgentActionCardData
  className?: string
  onChecklistClick?: () => void
}

/**
 * Urgent pathway action — layout and density aligned with AtRiskConditionsCard
 * (single border, compact header row, content + primary action).
 */
export function UrgentActionCard({
  data,
  className,
  onChecklistClick,
}: UrgentActionCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full min-h-0 flex-col gap-0 border border-red-200 bg-red-50/80 py-4 shadow-sm dark:border-red-900/50 dark:bg-red-950/30",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start gap-2 space-y-0 px-4 pb-3 pt-0">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
          <Clock className="size-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <CardTitle className="text-base font-semibold leading-tight text-red-900 dark:text-red-100 sm:text-lg">
            {data.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4 pb-4 pt-0">
        <p className="flex items-baseline gap-1.5 text-sm leading-snug text-red-800 dark:text-red-200">
          <Clock
            className="size-3.5 shrink-0 translate-y-px opacity-80"
            aria-hidden
          />
          <span className="min-w-0">
            <span className="font-semibold tabular-nums text-red-900 dark:text-red-100">
              {data.timeRemaining}
            </span>
            <span className="font-normal text-red-800 dark:text-red-200">
              {" remaining until "}
              {phaseDescription(data.subtitle)}
            </span>
          </span>
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-red-300 text-red-800 hover:bg-red-100 dark:border-red-700 dark:text-red-200 dark:hover:bg-red-900/50 sm:w-auto"
          onClick={onChecklistClick}
        >
          <ListChecks className="mr-2 size-4" aria-hidden />
          {data.checklistLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
