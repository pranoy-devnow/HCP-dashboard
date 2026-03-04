"use client"

import { useCallback, useMemo, useState } from "react"
import { NotificationTimeline, type NotificationItem } from "@/components/notification-timeline"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { notifications, loadReadIds, saveReadIds } from "@/lib/notifications-data"

function categorizeNotifications(notifications: NotificationItem[]) {
  const today: NotificationItem[] = []
  const thisWeek: NotificationItem[] = []
  const earlier: NotificationItem[] = []

  notifications.forEach((notification) => {
    const timestamp = notification.timestamp?.toLowerCase() || ""

    if (
      timestamp.includes("just now") ||
      timestamp.includes("minute") ||
      timestamp.includes("hour") ||
      timestamp.includes("1h ago") ||
      timestamp.includes("2h ago") ||
      timestamp.includes("3h ago") ||
      timestamp.includes("4h ago") ||
      timestamp.includes("5h ago")
    ) {
      today.push(notification)
    } else if (
      timestamp.includes("yesterday") ||
      timestamp.includes("2 days") ||
      timestamp.includes("3 days") ||
      timestamp.includes("4 days") ||
      timestamp.includes("5 days")
    ) {
      thisWeek.push(notification)
    } else {
      earlier.push(notification)
    }
  })

  return { today, thisWeek, earlier }
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("today")
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds())

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev).add(id)
      saveReadIds(next)
      return next
    })
  }, [])

  const { today, thisWeek, earlier } = useMemo(
    () => categorizeNotifications(notifications),
    []
  )

  return (
    <div className="px-4 lg:px-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-4">
          <TabsList className="w-fit">
            <TabsTrigger value="today">
              Today
              {today.length > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({today.length})
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="thisWeek">
              This Week
              {thisWeek.length > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({thisWeek.length})
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="earlier">
              Earlier
              {earlier.length > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({earlier.length})
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="today" className="mt-0">
          {today.length > 0 ? (
            <NotificationTimeline notifications={today} readIds={readIds} onMarkRead={markRead} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No notifications for today
            </p>
          )}
        </TabsContent>

        <TabsContent value="thisWeek" className="mt-0">
          {thisWeek.length > 0 ? (
            <NotificationTimeline notifications={thisWeek} readIds={readIds} onMarkRead={markRead} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No notifications for this week
            </p>
          )}
        </TabsContent>

        <TabsContent value="earlier" className="mt-0">
          {earlier.length > 0 ? (
            <NotificationTimeline notifications={earlier} readIds={readIds} onMarkRead={markRead} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No earlier notifications
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
