"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog } from "radix-ui"
import type { TimelineItem } from "@/types/case-files"
import { ChecklistItem } from "./ChecklistItem"

export function SubsectionModal({
  item,
  onClose,
  onOpenNotes,
  onMarkCompleted,
  onSkip,
  isNotesOpen = false,
  completedIds,
}: {
  item: TimelineItem
  onClose: () => void
  onOpenNotes: (item: { id: string; label: string }, isGeneral?: boolean) => void
  onMarkCompleted?: (itemId: string, itemLabel: string) => void
  onSkip?: (itemId: string) => void
  isNotesOpen?: boolean
  completedIds?: Set<string>
}) {
  const hasSubItems = item.subItems && item.subItems.length > 0
  const handleMarkCompleted = () => {
    onMarkCompleted?.(item.id, item.label)
    onClose()
  }

  return (
    <Dialog.Root open onOpenChange={(open) => !open && !isNotesOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 cursor-pointer"
          onClick={() => !isNotesOpen && onClose()}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-0 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onEscapeKeyDown={() => onClose()}
          onInteractOutside={(e) => {
            if (isNotesOpen) e.preventDefault()
            else onClose()
          }}
        >
          <div className="flex flex-col max-h-[85vh]">
            <div className="flex flex-col gap-2 border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold text-foreground pr-8">
                  {item.label}
                </Dialog.Title>
                <Dialog.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none -mr-2">
                  <X className="size-5" />
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              </div>
            </div>
            <div className="overflow-y-auto px-6 py-4 space-y-4">
              {item.description ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              ) : null}
              {hasSubItems && (
                <div className="space-y-2">
                  <div className="space-y-2 rounded-lg border border-border/50 bg-muted/20 p-3">
                    {item.subItems!.map((sub) => (
                      <ChecklistItem key={sub.id} item={sub} onOpenNotes={onOpenNotes} onMarkCompleted={onMarkCompleted} isSubItem completedIds={completedIds} />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 justify-start items-center pt-4 mt-4 border-t border-border/50">
                <Button variant="default" size="sm" className="text-xs shrink-0" onClick={handleMarkCompleted}>
                  Complete
                </Button>
                <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={() => { onSkip?.(item.id); onClose(); }}>
                  Skip
                </Button>
                <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={() => onOpenNotes({ id: item.id, label: item.label }, false)}>
                  Add note
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
