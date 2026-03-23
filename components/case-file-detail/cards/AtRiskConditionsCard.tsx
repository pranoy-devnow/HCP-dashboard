"use client"

import * as React from "react"
import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AtRiskConditionsCardData } from "@/types/case-file-detail-cards"

export interface AtRiskConditionsCardProps {
  data: AtRiskConditionsCardData
  className?: string
}

/** At-risk conditions as a standard Card (Alerts & metrics column). */
export function AtRiskConditionsCard({ data, className }: AtRiskConditionsCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full min-h-0 flex-col gap-0 border border-amber-200 bg-amber-50/80 py-4 shadow-sm dark:border-amber-800 dark:bg-amber-950/30",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 px-4 pb-3 pt-0">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200">
          <Info className="size-4" aria-hidden />
        </div>
        <CardTitle className="text-base font-semibold text-amber-900 dark:text-amber-100 sm:text-lg">
          Maternal At-Risk Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {data.conditions.map((condition) => (
            <span
              key={condition}
              className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
            >
              {condition}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
