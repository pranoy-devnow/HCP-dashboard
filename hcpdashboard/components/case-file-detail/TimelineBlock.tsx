"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TimelineItem } from "@/types/case-files"
import { ChecklistItem } from "./ChecklistItem"
import { SubsectionModal } from "./SubsectionModal"

export function TimelineBlock({
  timeRange,
  items,
  onOpenNotes,
  onMarkCompleted,
  onSkip,
  isNotesOpen = false,
  completedIds = new Set(),
  skippedIds = new Set(),
  defaultOpen = false,
  isCurrentSection = false,
}: {
  timeRange: string
  items: TimelineItem[]
  onOpenNotes: (item: { id: string; label: string }, isGeneral?: boolean) => void
  onMarkCompleted?: (itemId: string, itemLabel: string) => void
  onSkip?: (itemId: string) => void
  isNotesOpen?: boolean
  completedIds?: Set<string>
  skippedIds?: Set<string>
  defaultOpen?: boolean
  isCurrentSection?: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [modalItem, setModalItem] = React.useState<TimelineItem | null>(null)

  const doneCount = items.filter((i) => completedIds.has(i.id) || skippedIds.has(i.id)).length
  const totalCount = items.length
  const progressPct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0

  return (
    <div className={cn("flex flex-col w-full transition-opacity", !isCurrentSection && "opacity-70 hover:opacity-100 group/block")}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center justify-between px-6 py-4 bg-background border rounded-xl transition-all w-full text-left group overflow-hidden",
          isCurrentSection ? "hover:border-primary/50 hover:shadow-sm" : "border-border/80 hover:border-muted-foreground/50",
          isOpen && "border-primary/50 shadow-sm bg-accent/30",
          !isCurrentSection && isOpen && "opacity-100"
        )}
      >
        <div className={cn("absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity", isOpen && isCurrentSection && "opacity-100")} />
        <div className="relative flex items-center gap-4 flex-1 min-w-0">
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-sm font-semibold", isCurrentSection ? "text-foreground" : "text-muted-foreground")}>{timeRange} hours</span>
              {isCurrentSection && (
                <span className="text-[10px] font-medium uppercase tracking-wide text-primary bg-primary/15 px-1.5 py-0.5 rounded">Current</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{isOpen ? "Click to collapse" : "Click to expand"}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums w-8">{doneCount}/{totalCount}</span>
          </div>
        </div>
        <div className={cn("relative transition-transform duration-200 shrink-0", isOpen && "rotate-180")}>
          <ChevronDown className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </button>
      {isOpen && (
        <div className="mt-3 mx-2 mb-2 bg-muted/30 rounded-lg border border-border/50 p-4">
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} id={`timeline-item-${item.id}`}>
                <ChecklistItem
                  item={item}
                  onOpenNotes={onOpenNotes}
                  onMarkCompleted={onMarkCompleted}
                  onOpenInModal={(i) => setModalItem(i)}
                  completedIds={completedIds}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {modalItem && (
        <SubsectionModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onOpenNotes={onOpenNotes}
          onMarkCompleted={onMarkCompleted}
          onSkip={onSkip}
          isNotesOpen={isNotesOpen}
          completedIds={completedIds}
        />
      )}
    </div>
  )
}
