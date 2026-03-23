"use client"

import * as React from "react"
import { Droplets, Clock, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MetricCardData, PumpingMetricCardData, MetricIconKey } from "@/types/case-file-detail-cards"

const METRIC_ICONS: Record<MetricIconKey, React.ComponentType<{ className?: string }>> = {
  droplets: Droplets,
  clock: Clock,
}

export interface MetricCardProps {
  data: MetricCardData
  className?: string
}

/** Single metric card (e.g. Avg Daily Volume): same layout as DataCard — icon on top, label, value. */
export function MetricCard({ data, className }: MetricCardProps) {
  const Icon = METRIC_ICONS[data.iconKey]
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground flex flex-col gap-1.5 p-3",
        className
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
        {Icon && <Icon className="size-4" />}
      </div>
      <p className="text-xs text-muted-foreground">{data.title}</p>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold">{data.value}</span>
          {data.trend === "up" && (
            <TrendingUp className="size-4 shrink-0 text-green-600 dark:text-green-400" />
          )}
        </div>
        {data.subInfo != null && (
          <div className="text-xs text-muted-foreground">{data.subInfo}</div>
        )}
      </div>
    </div>
  )
}

export interface PumpingMetricCardProps {
  data: PumpingMetricCardData
  className?: string
}

/** Pumping frequency metric card: same layout as DataCard — icon on top, label, then value rows with sub-info. */
export function PumpingMetricCard({ data, className }: PumpingMetricCardProps) {
  const Icon = METRIC_ICONS[data.iconKey]
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground flex flex-col gap-1.5 p-3",
        className
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400">
        {Icon && <Icon className="size-4" />}
      </div>
      <p className="text-xs text-muted-foreground">{data.title}</p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="font-semibold">{data.averagePerDay}</div>
          <div className="text-xs text-muted-foreground">Target: {data.target}</div>
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="font-semibold">{data.past24Hours}</div>
          <div className="text-xs text-muted-foreground">{data.past24HoursLabel}</div>
        </div>
      </div>
    </div>
  )
}
