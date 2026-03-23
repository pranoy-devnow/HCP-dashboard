"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MomDataCard } from "./MomDataCard"
import type { MomDataCardItem } from "@/types/case-file-detail-cards"
import { cn } from "@/lib/utils"

export interface MomDataSectionProps {
  items: MomDataCardItem[]
  title?: string
  onKnowMore?: (itemId: string) => void
  className?: string
}

/** Section with title and a grid of Mom Data cards (same visual style as Infant data). */
export function MomDataSection({
  items,
  title = "Mom Data",
  onKnowMore,
  className,
}: MomDataSectionProps) {
  return (
    <Card
      className={cn(
        "border-violet-200/50 bg-violet-50/50 py-4 shadow-sm dark:border-violet-800/30 dark:bg-violet-950/20",
        className
      )}
      aria-labelledby="mom-data-section-heading"
    >
      <CardHeader className="px-4 pb-2 pt-4">
        <CardTitle id="mom-data-section-heading" className="text-lg" role="heading" aria-level={2}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-4">
        <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <MomDataCard
              key={item.id}
              item={item}
              onKnowMore={
                onKnowMore != null && item.showKnowMore !== false
                  ? () => onKnowMore(item.id)
                  : undefined
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
