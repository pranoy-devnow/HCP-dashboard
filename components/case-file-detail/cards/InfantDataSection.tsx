"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataCard } from "./DataCard"
import type { DataCardItem } from "@/types/case-file-detail-cards"
import { cn } from "@/lib/utils"

export interface InfantDataSectionProps {
  /** Grid of data items (e.g. gestational age, weight, feeding route). */
  items: DataCardItem[]
  title?: string
  className?: string
}

/** Section with title and a grid of modular data cards (e.g. Infant data). */
export function InfantDataSection({
  items,
  title = "Infant data",
  className,
}: InfantDataSectionProps) {
  return (
    <Card
      className={cn(
        "border-green-200/50 bg-green-50/60 py-4 shadow-sm dark:border-green-800/30 dark:bg-green-950/20",
        className
      )}
      aria-labelledby="infant-data-heading"
    >
      <CardHeader className="px-4 pb-2 pt-4">
        <CardTitle id="infant-data-heading" className="text-lg" role="heading" aria-level={2}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => (
            <DataCard key={i} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
