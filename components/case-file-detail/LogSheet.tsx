"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { CompletionEntry, LogEntry, Note } from "@/types/case-files"

function formatDateTime(d: Date) {
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  }
}

export function LogSheet({
  notes,
  completionLog,
  noteContext,
  onAddNote,
  isOpen,
  onClose,
}: {
  notes: Note[]
  completionLog: CompletionEntry[]
  noteContext: { id: string; label: string } | null
  onAddNote: (text: string, source: string) => void
  isOpen: boolean
  onClose: () => void
}) {
  const [newNote, setNewNote] = React.useState("")

  const handleSendNote = () => {
    if (newNote.trim()) {
      const source = noteContext?.label ?? "General notes"
      onAddNote(newNote.trim(), source)
      setNewNote("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendNote()
    }
  }

  const entries: LogEntry[] = React.useMemo(() => {
    const completed: LogEntry[] = completionLog.map((e) => ({
      type: "completed" as const,
      id: e.id,
      by: e.by,
      itemLabel: e.itemLabel,
      timestamp: e.timestamp,
    }))
    const fromNotes: LogEntry[] = notes.map((n) => ({
      type: "note" as const,
      id: n.id,
      text: n.text,
      source: n.source,
      timestamp: n.timestamp,
    }))
    return [...completed, ...fromNotes].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [notes, completionLog])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Log</SheetTitle>
          <SheetDescription className="mt-2">Add notes to the chain. Completions and notes appear here.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {entries.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No activity yet. Start a conversation...
              </div>
            ) : (
              entries.map((entry) => {
                if (entry.type === "completed") {
                  const { date, time } = formatDateTime(entry.timestamp)
                  return (
                    <div key={entry.id} className="flex flex-col gap-1.5">
                      <div className="bg-muted/50 rounded-lg p-4 max-w-[85%] shadow-sm border border-border/50">
                        <p className="text-sm text-foreground leading-relaxed">
                          <span className="font-medium">{entry.by}</span> completed: {entry.itemLabel}
                        </p>
                        <div className="flex flex-col gap-1 pt-2 border-t border-border/50 mt-2">
                          <span className="text-xs text-muted-foreground">{date} at {time}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return (
                  <div key={entry.id} className="flex flex-col gap-1.5">
                    <div className="bg-muted rounded-lg p-4 max-w-[85%] ml-auto shadow-sm">
                      <p className="text-sm text-foreground leading-relaxed mb-2">{entry.text}</p>
                      <div className="flex flex-col gap-1 pt-2 border-t border-border/50">
                        <span className="text-xs font-medium text-muted-foreground">From: {entry.source}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(entry.timestamp).date} at {formatDateTime(entry.timestamp).time}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <div className="border-t px-6 py-4 bg-background">
            <div className="mb-2">
              <span className="text-xs text-muted-foreground">
                {noteContext ? (
                  <>Adding note from: <span className="font-medium">{noteContext.label}</span></>
                ) : (
                  <span className="font-medium">General notes</span>
                )}
              </span>
            </div>
            <div className="flex gap-3">
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your note..."
                className="flex-1"
              />
              <Button onClick={handleSendNote} disabled={!newNote.trim()} size="default">
                Send
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
