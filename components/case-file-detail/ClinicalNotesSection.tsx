"use client"

import * as React from "react"
import {
  ClipboardList,
  CalendarClock,
  Lightbulb,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DetailModal } from "./DetailModal"
import { getClinicalNotesByCaseId } from "@/services/clinicalNotesService"
import type {
  ClinicalNoteCategory,
  ClinicalNoteCategoryId,
} from "@/types/clinical-notes"
import { cn } from "@/lib/utils"

const CATEGORY_ICONS: Record<
  ClinicalNoteCategoryId,
  React.ComponentType<{ className?: string }>
> = {
  interventions: ClipboardList,
  "follow-up": CalendarClock,
  recommendations: Lightbulb,
}

export interface ClinicalNotesSectionProps {
  caseId: string
  className?: string
}

/** Clinical Notes section: Interventions, Follow-up, Recommendations — each opens a modal. */
export function ClinicalNotesSection({ caseId, className }: ClinicalNotesSectionProps) {
  const categories = React.useMemo(
    () => getClinicalNotesByCaseId(caseId),
    [caseId]
  )
  const [activeCategory, setActiveCategory] =
    React.useState<ClinicalNoteCategory | null>(null)

  return (
    <>
      <section
        className={cn("space-y-4", className)}
        aria-labelledby="clinical-notes-heading"
      >
        <h2
          id="clinical-notes-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          Clinical Notes
        </h2>
        <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-3">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.id]
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
              >
                <Card className="h-full gap-0 border-border/80 py-0 shadow-sm transition-colors group-hover:border-primary/40 group-hover:bg-muted/30">
                  <CardContent className="flex items-center gap-3 px-4 py-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                      <Icon className="size-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {category.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                    <ChevronRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden
                    />
                  </CardContent>
                </Card>
              </button>
            )
          })}
        </div>
      </section>

      {activeCategory != null && (
        <DetailModal
          title={activeCategory.title}
          onClose={() => setActiveCategory(null)}
          dialogClassName="max-w-lg"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {activeCategory.description}
            </p>
            <ul className="space-y-3">
              {activeCategory.content.map((paragraph) => (
                <li
                  key={paragraph}
                  className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 text-sm leading-relaxed text-foreground"
                >
                  {paragraph}
                </li>
              ))}
            </ul>
          </div>
        </DetailModal>
      )}
    </>
  )
}
