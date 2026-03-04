"use client"

import * as React from "react"
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TimelineItem } from "@/types/case-files"

type SubItem = { id: string; label: string; checked: boolean; description: string }

export function ChecklistItem({
  item,
  onOpenNotes,
  onMarkCompleted,
  isSubItem = false,
  isExpanded: controlledExpanded,
  onToggleExpand,
  onOpenInModal,
  completedIds,
}: {
  item: TimelineItem | SubItem
  onOpenNotes: (item: { id: string; label: string }, isGeneral?: boolean) => void
  onMarkCompleted?: (itemId: string, itemLabel: string) => void
  isSubItem?: boolean
  isExpanded?: boolean
  onToggleExpand?: () => void
  onOpenInModal?: (item: TimelineItem) => void
  completedIds?: Set<string>
}) {
  const [internalExpanded, setInternalExpanded] = React.useState(false)
  const isControlled = controlledExpanded !== undefined && onToggleExpand !== undefined
  const isExpanded = isControlled ? controlledExpanded : internalExpanded
  const useModal = onOpenInModal && !isSubItem

  const [internalChecked, setInternalChecked] = React.useState(item.checked)
  const isChecked = completedIds?.has(item.id) ?? internalChecked
  const hasSubItems = "subItems" in item && item.subItems && item.subItems.length > 0
  const subItems = hasSubItems ? item.subItems! : []
  const showCheckbox = !("hideCheckbox" in item && item.hideCheckbox)

  const handleMarkCompleted = () => {
    setInternalChecked(true)
    onMarkCompleted?.(item.id, item.label)
  }

  const handleRowClick = () => {
    if (useModal && onOpenInModal) {
      onOpenInModal(item as TimelineItem)
    } else if (!useModal) {
      if (isControlled) {
        onToggleExpand?.()
      } else {
        setInternalExpanded((p) => !p)
      }
    }
  }

  return (
    <div className={cn("bg-background border border-border/50 rounded-md overflow-hidden shadow-sm", isSubItem && "ml-6 border-l-2 border-l-primary/30")}>
      <div className={cn("flex gap-3 p-3", isSubItem ? "items-center" : "items-start")}>
        {showCheckbox ? (
          <Checkbox
            id={item.id}
            checked={isChecked}
            onCheckedChange={(checked) => setInternalChecked(checked === true)}
            className={cn("shrink-0", isSubItem ? "mt-0" : "mt-0.5")}
          />
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={useModal ? () => onOpenInModal?.(item as TimelineItem) : handleRowClick}
          onKeyDown={useModal ? undefined : (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), handleRowClick())}
          role="button"
          tabIndex={0}
          aria-expanded={useModal ? undefined : isExpanded}
          aria-label={useModal ? "Open details" : (isExpanded ? "Collapse details" : "Expand details")}
        >
          <div className={cn("flex justify-between gap-2 flex-1 min-w-0", isSubItem ? "items-center" : "items-start")}>
            <Label htmlFor={showCheckbox ? item.id : undefined} className={cn("font-normal leading-relaxed flex-1 py-0.5", isSubItem ? "text-xs" : "text-sm", showCheckbox && "cursor-pointer")}>
              {item.label}
            </Label>
            {!isSubItem && (useModal ? (
              <ChevronRight className="size-4 text-muted-foreground shrink-0" aria-hidden />
            ) : (
              <span className="shrink-0 p-1 rounded transition-colors pointer-events-none" aria-hidden>
                {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
              </span>
            ))}
          </div>
          {!useModal && isExpanded && (
            <div className="mt-2 space-y-2">
              {item.description ? (
                <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2 rounded border border-border/30">{item.description}</p>
              ) : null}
              {hasSubItems && (
                <div className="space-y-2 mt-2">
                  {subItems.map((sub) => (
                    <ChecklistItem key={sub.id} item={sub} onOpenNotes={onOpenNotes} onMarkCompleted={onMarkCompleted} isSubItem completedIds={completedIds} />
                  ))}
                </div>
              )}
              {!isSubItem && (
                <div className="flex flex-wrap gap-2 justify-start">
                  <Button variant="default" size="sm" className="text-xs shrink-0" onClick={handleMarkCompleted}>
                    Complete
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={() => {}}>
                    Skip
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={() => onOpenNotes({ id: item.id, label: item.label }, false)}>
                    Add note
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
