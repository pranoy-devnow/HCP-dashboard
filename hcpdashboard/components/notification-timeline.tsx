"use client"

import Link from "next/link"
import { IconClock, IconFileText, IconArrowRight } from "@tabler/icons-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { NotificationTimelineProps } from "@/types/notifications"

export type { NotificationItem, NotificationSeverity } from "@/types/notifications"

function caseInitials(label: string): string {
  const parts = label.split(",").map((s) => s.trim())
  const first = parts[0]?.[0] ?? ""
  const second = parts[1]?.replace(/^Baby\s+/i, "")?.[0] ?? ""
  return (first + second).toUpperCase().slice(0, 2) || "?"
}

/** Unread accent (left bar): red only. */
const UNREAD_ACCENT = "bg-red-500 dark:bg-red-500"

/** Unread avatar tint: red only. */
const UNREAD_AVATAR = "bg-red-500/15 text-red-700 dark:text-red-400"

export function NotificationTimeline({
  notifications,
  readIds = new Set(),
  onMarkRead,
}: NotificationTimelineProps) {
  return (
    <div className="flex flex-col gap-3">
      {notifications.map((notification) => {
        const isCase = notification.type === "case"
        const isRead = readIds.has(notification.id)
        const caseId = notification.caseId
        const caseLabel = notification.caseLabel ?? "Case"
        const timeRange = notification.timeRange
        const checklistItemId = notification.checklistItemId
        const searchParams = new URLSearchParams()
        if (timeRange) searchParams.set("section", timeRange)
        if (checklistItemId) searchParams.set("item", checklistItemId)
        searchParams.set("from", "notifications")
        const query = searchParams.toString()
        const href = caseId
          ? `/case-files/${caseId}?${query}`
          : undefined

        const handleClick = () => {
          onMarkRead?.(notification.id)
        }

        const cardContent = (
          <>
            {/* Left accent: red when unread, grey when read */}
            <div
              className={cn(
                "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-colors",
                isRead && "bg-muted-foreground/25",
                !isRead && UNREAD_ACCENT
              )}
            />

            <div className="flex items-center gap-3 py-3 pr-4 pl-4">
              {/* Patient: compact chip (avatar + name) */}
              <div className="flex shrink-0 items-center gap-2 rounded-full bg-muted/50 py-1.5 pl-1.5 pr-3 border border-border/50 min-w-0 max-w-[180px]">
                <Avatar className="h-7 w-7 shrink-0 border-0">
                  <AvatarFallback
                    className={cn(
                      "text-[10px] font-semibold",
                      isRead && "bg-muted text-muted-foreground",
                      !isRead && UNREAD_AVATAR
                    )}
                  >
                    {isCase ? (
                      <IconFileText className="h-3.5 w-3.5" />
                    ) : (
                      caseInitials(caseLabel)
                    )}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-foreground truncate">{caseLabel}</span>
              </div>

              {/* Message */}
              <p className="flex-1 min-w-0 text-sm text-foreground leading-snug line-clamp-2">
                {notification.title}
              </p>

              {/* Timestamp + arrow */}
              <div className="flex shrink-0 items-center gap-3">
                {notification.timestamp && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <IconClock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span className="text-xs whitespace-nowrap">{notification.timestamp}</span>
                  </div>
                )}
                {href && (
                  <span className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden>
                    <IconArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                )}
              </div>
            </div>
          </>
        )

        const cardClass = cn(
          "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
          "transition-all duration-200",
          href && "group hover:shadow-md hover:border-primary/30 cursor-pointer",
          isRead && "opacity-80 border-muted-foreground/20"
        )

        return (
          <div key={notification.id}>
            {href ? (
              <Link href={href} className={cn("block", cardClass)} onClick={handleClick}>
                {cardContent}
              </Link>
            ) : (
              <div className={cardClass}>
                {cardContent}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
