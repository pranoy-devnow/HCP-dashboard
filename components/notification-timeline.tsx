"use client"

import Link from "next/link"
import { IconClock, IconFileText, IconArrowRight } from "@tabler/icons-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

/** Severity for unread styling: high = urgent (red), medium = default (primary/amber), low = info (blue). */
export type NotificationSeverity = "low" | "medium" | "high"

export interface NotificationItem {
  id: string
  title: string
  type: "case" | "checklist"
  status?: "pending" | "completed"
  /** Affects unread accent color. Ignored when read (grey). */
  severity?: NotificationSeverity
  timestamp?: string
  /** Case file ID – links notification to a patient case. Clicking navigates to case file. */
  caseId?: string
  /** Display label for the case, e.g. "Johnson, Baby Girl". */
  caseLabel?: string
  /** Care timeline section (e.g. "0-6", "6-12") – used to open the right section on the patient page. */
  timeRange?: string
  /** Checklist item ID in that section – used to scroll to/highlight the subsection on the patient page. */
  checklistItemId?: string
}

interface NotificationTimelineProps {
  notifications: NotificationItem[]
  /** IDs of notifications the user has opened; these are shown as read (grey). */
  readIds?: Set<string>
  /** Called when user clicks a notification so it can be marked read. */
  onMarkRead?: (id: string) => void
}

function caseInitials(label: string): string {
  const parts = label.split(",").map((s) => s.trim())
  const first = parts[0]?.[0] ?? ""
  const second = parts[1]?.replace(/^Baby\s+/i, "")?.[0] ?? ""
  return (first + second).toUpperCase().slice(0, 2) || "?"
}

const SEVERITY_ACCENT = {
  high: "bg-red-500 dark:bg-red-500",
  medium: "bg-primary",
  low: "bg-blue-500 dark:bg-blue-500",
} as const

const SEVERITY_AVATAR = {
  high: "bg-red-500/15 text-red-700 dark:text-red-400",
  medium: "bg-primary/15 text-primary",
  low: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
} as const

export function NotificationTimeline({
  notifications,
  readIds = new Set(),
  onMarkRead,
}: NotificationTimelineProps) {
  return (
    <div className="flex flex-col gap-3">
      {notifications.map((notification) => {
        const isCase = notification.type === "case"
        const isCompleted = notification.status === "completed"
        const isPending = notification.status === "pending"
        const isRead = readIds.has(notification.id)
        const severity = notification.severity ?? "medium"
        const caseId = notification.caseId
        const caseLabel = notification.caseLabel ?? "Case"
        const timeRange = notification.timeRange
        const checklistItemId = notification.checklistItemId
        const searchParams = new URLSearchParams()
        if (timeRange) searchParams.set("section", timeRange)
        if (checklistItemId) searchParams.set("item", checklistItemId)
        const query = searchParams.toString()
        const href = caseId
          ? `/case-files/${caseId}${query ? `?${query}` : ""}`
          : undefined

        const handleClick = () => {
          onMarkRead?.(notification.id)
        }

        const cardContent = (
          <>
            {/* Left accent: severity when unread, grey when read */}
            <div
              className={cn(
                "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-colors",
                isRead && "bg-muted-foreground/25",
                !isRead && isPending && SEVERITY_ACCENT[severity],
                !isRead && isCompleted && "bg-muted-foreground/20",
                !isRead && !isPending && !isCompleted && "bg-muted-foreground/10"
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
                      !isRead &&
                        (isCase
                          ? SEVERITY_AVATAR[severity]
                          : isCompleted
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : SEVERITY_AVATAR[severity])
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
