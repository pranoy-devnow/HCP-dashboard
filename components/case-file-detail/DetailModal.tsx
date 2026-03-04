"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Dialog } from "radix-ui"

export function DetailModal({
  title,
  onClose,
  children,
  dialogClassName,
  sessionCount,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  dialogClassName?: string
  sessionCount?: number
}) {
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 cursor-pointer"
          onClick={onClose}
        />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-0 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            dialogClassName
          )}
          onEscapeKeyDown={onClose}
          onInteractOutside={onClose}
        >
          <div className="flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2 min-w-0">
                <Dialog.Title className="text-lg font-semibold text-foreground truncate">
                  {title}
                </Dialog.Title>
                {sessionCount != null && (
                  <Badge variant="secondary" className="shrink-0">
                    {sessionCount} session{sessionCount !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <Dialog.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none -mr-2">
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>
            <div className="overflow-y-auto px-6 py-4">
              {children}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
