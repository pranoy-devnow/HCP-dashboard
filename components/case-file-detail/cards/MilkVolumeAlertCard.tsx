"use client"

import { Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { MilkVolumeAlertCardData } from "@/types/case-file-detail-cards"

export interface MilkVolumeAlertCardProps {
  data: MilkVolumeAlertCardData
  className?: string
  onActionClick?: () => void
}

/**
 * Milk volume trend alert — layout density aligned with UrgentActionCard / AtRiskConditionsCard.
 */
export function MilkVolumeAlertCard({ data, className, onActionClick }: MilkVolumeAlertCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full min-h-0 flex-col gap-0 border border-orange-200 bg-orange-50/80 py-4 shadow-sm dark:border-orange-900/50 dark:bg-orange-950/25",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start gap-2 space-y-0 px-4 pb-3 pt-0">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300">
          <Droplets className="size-4" aria-hidden />
        </div>
        <CardTitle className="pt-0.5 text-base font-semibold text-orange-950 dark:text-orange-100 sm:text-lg">
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-4 pb-4 pt-0">
        <p className="text-sm leading-snug text-orange-900/90 dark:text-orange-100/90">{data.message}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-orange-300 text-orange-900 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-100 dark:hover:bg-orange-900/50 sm:w-auto"
          onClick={onActionClick}
        >
          {data.actionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
