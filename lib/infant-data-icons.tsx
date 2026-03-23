"use client"

import * as React from "react"
import {
  Calendar,
  Clock,
  Activity,
  Scale,
  Baby,
  BottleWine,
  Droplets,
  Zap,
} from "lucide-react"
import type { DataCardItem } from "@/types/case-file-detail-cards"
import type { InfantDataIconKey, InfantDataItemData } from "./case-file-detail-cards-data"

const ICONS: Record<InfantDataIconKey, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  clock: Clock,
  activity: Activity,
  scale: Scale,
  baby: Baby,
  bottle: BottleWine,
  droplets: Droplets,
  zap: Zap,
}

const ICON_BG: Record<InfantDataIconKey, string> = {
  calendar: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400",
  clock: "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400",
  activity: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
  scale: "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400",
  baby: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
  bottle: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400",
  droplets: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400",
  zap: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400",
}

/** Map InfantDataItemData[] to DataCardItem[] for use with InfantDataSection. */
export function mapInfantDataToCardItems(items: InfantDataItemData[]): DataCardItem[] {
  return items.map((row) => {
    const Icon = ICONS[row.iconKey]
    return {
      icon: Icon ? <Icon className="size-4" /> : null,
      iconBgClass: ICON_BG[row.iconKey],
      label: row.label,
      value: row.value,
      subInfo: row.subInfo,
    }
  })
}
