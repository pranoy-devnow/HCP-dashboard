"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { DataCardItem } from "@/types/case-file-detail-cards"

export interface DataCardProps {
  item: DataCardItem
  className?: string
}

/** Single modular data card: icon, label, value, optional sub-info (e.g. badge). */
export function DataCard({ item, className }: DataCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground flex flex-col gap-1.5 p-3",
        className
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          item.iconBgClass ?? "bg-muted"
        )}
      >
        {item.icon}
      </div>
      <p className="text-xs text-muted-foreground">{item.label}</p>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="font-semibold">{item.value}</div>
        {item.subInfo != null && (
          <div className="text-xs text-muted-foreground">{item.subInfo}</div>
        )}
      </div>
    </div>
  )
}
