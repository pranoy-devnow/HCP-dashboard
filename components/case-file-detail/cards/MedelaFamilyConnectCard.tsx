"use client"

import { Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { MedelaFamilyConnectCardData } from "@/types/case-file-detail-cards"

export interface MedelaFamilyConnectCardProps {
  data: MedelaFamilyConnectCardData
  className?: string
  onActionClick?: () => void
}

/**
 * Connect-to-app CTA — layout aligned with MilkVolumeAlertCard / UrgentActionCard.
 */
export function MedelaFamilyConnectCard({
  data,
  className,
  onActionClick,
}: MedelaFamilyConnectCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full min-h-0 flex-col gap-0 border border-sky-200 bg-sky-50/80 py-4 shadow-sm dark:border-sky-900/50 dark:bg-sky-950/25",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start gap-2 space-y-0 px-4 pb-3 pt-0">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-800 dark:bg-sky-400/20 dark:text-sky-200">
          <Smartphone className="size-4" aria-hidden />
        </div>
        <CardTitle className="pt-0.5 text-base font-semibold text-sky-950 dark:text-sky-100 sm:text-lg">
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-4 pb-4 pt-0">
        <p className="text-sm leading-snug text-sky-900/90 dark:text-sky-100/90">
          {data.subtitle}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-sky-300 text-sky-900 hover:bg-sky-100 dark:border-sky-700 dark:text-sky-100 dark:hover:bg-sky-900/50 sm:w-auto"
          onClick={onActionClick}
        >
          {data.actionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
