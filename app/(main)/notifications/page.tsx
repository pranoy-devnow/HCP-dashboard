"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { NotificationTimeline, type NotificationItem } from "@/components/notification-timeline"
import { getNotifications, loadReadIds, saveReadIds } from "@/services/notificationsService"
import { cn } from "@/lib/utils"

function getDateGroupLabel(timestamp: string | undefined): string {
  const t = (timestamp ?? "").toLowerCase()
  if (
    t.includes("just now") ||
    t.includes("minute") ||
    t.includes("hour") ||
    t.includes("1h ago") ||
    t.includes("2h ago") ||
    t.includes("3h ago") ||
    t.includes("4h ago") ||
    t.includes("5h ago")
  ) {
    return "Today"
  }
  if (t.includes("yesterday")) return "Yesterday"
  if (t.includes("2 days")) return "2 days ago"
  if (t.includes("3 days")) return "3 days ago"
  if (t.includes("4 days")) return "4 days ago"
  if (t.includes("5 days")) return "5 days ago"
  if (t.includes("1 week")) return "1 week ago"
  return "Earlier"
}

/** UX: show at most one notification per case so the list isn’t dominated by one patient; we keep the most recent per caseLabel. */
function oneNotificationPerPatient(items: NotificationItem[]): NotificationItem[] {
  const seen = new Set<string>()
  return items.filter((n) => {
    const name = n.caseLabel ?? "Case"
    if (seen.has(name)) return false
    seen.add(name)
    return true
  })
}

/** Group notifications by date label (newest first). Returns [ { label, items }, ... ] */
function groupNotificationsByDate(items: NotificationItem[]): { label: string; items: NotificationItem[] }[] {
  const groups: { label: string; items: NotificationItem[] }[] = []
  let current: { label: string; items: NotificationItem[] } | null = null

  for (const n of items) {
    const label = getDateGroupLabel(n.timestamp)
    if (!current || current.label !== label) {
      current = { label, items: [] }
      groups.push(current)
    }
    current.items.push(n)
  }
  return groups
}

export default function NotificationsPage() {
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    setReadIds(loadReadIds())
  }, [])

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev).add(id)
      saveReadIds(next)
      return next
    })
  }, [])

  const groups = useMemo(
    () => groupNotificationsByDate(oneNotificationPerPatient(getNotifications())),
    []
  )

  if (groups.length === 0) {
    return (
      <div className="px-4 lg:px-6">
        <p className="text-sm text-muted-foreground py-8 text-center">
          No notifications
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <div
        className={cn(
          "flex flex-col gap-6 max-h-[calc(100vh-var(--header-height)-6rem)] overflow-y-auto",
          "pb-4 pr-1 -mr-1" /* scrollbar spacing */
        )}
      >
        {groups.map(({ label, items }, index) => (
          <section key={label} className="flex flex-col gap-3">
            <div
              className={cn(
                "sticky top-0 z-10 flex items-center gap-3 py-1.5 text-xs font-medium text-muted-foreground",
                "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
                "border-b border-border/60",
                index === 0 && "justify-between"
              )}
            >
              <span>{label}</span>
              {index === 0 && (
                <span className="flex items-center gap-1.5 font-normal">
                  <span className="size-1.5 rounded-full bg-red-500 shrink-0" aria-hidden />
                  Time sensitive
                </span>
              )}
            </div>
            <NotificationTimeline
              notifications={items}
              readIds={readIds}
              onMarkRead={markRead}
            />
          </section>
        ))}
      </div>
    </div>
  )
}
