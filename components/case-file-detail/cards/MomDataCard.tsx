"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Droplets,
  Clock,
  BarChart3,
  Scale,
  Calendar,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MomDataCardIconKey, MomDataCardItem } from "@/types/case-file-detail-cards"

const ICONS: Record<MomDataCardIconKey, React.ComponentType<{ className?: string }>> = {
  droplets: Droplets,
  clock: Clock,
  trend: BarChart3,
  scale: Scale,
  calendar: Calendar,
}

const ICON_BG: Record<MomDataCardIconKey, string> = {
  droplets: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
  clock: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400",
  trend: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
  scale: "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400",
  calendar: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400",
}

export interface MomDataCardProps {
  item: MomDataCardItem
  onKnowMore?: () => void
  className?: string
}

/** Single card for Mom Data section: icon, label, value/trend, and optional Know more button. */
export function MomDataCard({ item, onKnowMore, className }: MomDataCardProps) {
  const Icon = ICONS[item.iconKey]
  const showKnowMoreButton = onKnowMore != null
  return (
    <div
      className={cn(
        "flex h-full min-h-[12rem] flex-col gap-1.5 rounded-lg border bg-card p-3 text-card-foreground",
        className
      )}
    >
      {/* flex-1 only when a bottom button exists so “Know more” rows stay aligned */}
      <div
        className={cn(
          "flex min-h-0 flex-col gap-1.5",
          showKnowMoreButton && "flex-1"
        )}
      >
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            ICON_BG[item.iconKey]
          )}
        >
          {Icon && <Icon className="size-4" />}
        </div>
        <p className="text-xs text-muted-foreground">{item.label}</p>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">{item.value}</span>
            {item.trend === "up" && (
              <TrendingUp className="size-4 shrink-0 text-green-600 dark:text-green-400" />
            )}
            {item.trend === "down" && (
              <TrendingDown className="size-4 shrink-0 text-red-600 dark:text-red-400" />
            )}
          </div>
          {item.subInfo != null && (
            <div className="text-xs text-muted-foreground">{item.subInfo}</div>
          )}
        </div>
      </div>
      {showKnowMoreButton && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-auto h-8 w-full shrink-0 justify-between gap-2 border-violet-300/80 bg-violet-50/90 text-xs font-semibold text-violet-900 shadow-sm hover:bg-violet-100 hover:text-violet-950 dark:border-violet-600/50 dark:bg-violet-950/40 dark:text-violet-100 dark:hover:bg-violet-900/60 dark:hover:text-violet-50"
          onClick={onKnowMore}
        >
          <span>Know more</span>
          <ChevronRight className="size-4 shrink-0 opacity-80" aria-hidden />
        </Button>
      )}
    </div>
  )
}
