"use client"

import { useCallback, useMemo, useState } from "react"
import { NotificationTimeline, type NotificationItem } from "@/components/notification-timeline"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { caseFiles, babyTitle } from "@/lib/case-files-data"

const STORAGE_KEY_READ_IDS = "hcp-notifications-read-ids"

function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY_READ_IDS)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function saveReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY_READ_IDS, JSON.stringify([...ids]))
  } catch {
    // ignore
  }
}

const caseOptions = caseFiles.map((f) => ({ caseId: f.id, caseLabel: babyTitle(f) }))

const notifications: NotificationItem[] = [
  {
    id: "1",
    title: "Personalized Pumping Plan",
    type: "checklist",
    status: "pending",
    severity: "high",
    timestamp: "Just now",
    caseId: caseOptions[0].caseId,
    caseLabel: caseOptions[0].caseLabel,
    timeRange: "6-12",
    checklistItemId: "19",
  },
  {
    id: "2",
    title: "First pump: assisted checklist",
    type: "checklist",
    status: "pending",
    severity: "high",
    timestamp: "15 minutes ago",
    caseId: caseOptions[0].caseId,
    caseLabel: caseOptions[0].caseLabel,
    timeRange: "0-6",
    checklistItemId: "4",
  },
  {
    id: "3",
    title: "Assisted Pumping Session",
    type: "checklist",
    status: "pending",
    severity: "medium",
    timestamp: "30 minutes ago",
    caseId: caseOptions[1].caseId,
    caseLabel: caseOptions[1].caseLabel,
    timeRange: "6-12",
    checklistItemId: "16",
  },
  {
    id: "4",
    title: "First pump: assisted checklist",
    type: "checklist",
    status: "pending",
    severity: "medium",
    timestamp: "45 minutes ago",
    caseId: caseOptions[1].caseId,
    caseLabel: caseOptions[1].caseLabel,
    timeRange: "0-6",
    checklistItemId: "4",
  },
  {
    id: "5",
    title: "Confirm case (Validate patient willingness)",
    type: "checklist",
    status: "pending",
    severity: "low",
    timestamp: "1 hour ago",
    caseId: caseOptions[2].caseId,
    caseLabel: caseOptions[2].caseLabel,
    timeRange: "0-6",
    checklistItemId: "2",
  },
  {
    id: "6",
    title: "New case logged",
    type: "case",
    status: "completed",
    severity: "low",
    timestamp: "2 hours ago",
    caseId: caseOptions[2].caseId,
    caseLabel: caseOptions[2].caseLabel,
  },
  {
    id: "7",
    title: "Follow-Up & PP2 Preparation",
    type: "checklist",
    status: "completed",
    timestamp: "Yesterday, 3:45 PM",
    caseId: caseOptions[3].caseId,
    caseLabel: caseOptions[3].caseLabel,
    timeRange: "12-18",
    checklistItemId: "s12-1",
  },
  {
    id: "8",
    title: "New case logged",
    type: "case",
    status: "completed",
    timestamp: "Yesterday, 11:30 AM",
    caseId: caseOptions[3].caseId,
    caseLabel: caseOptions[3].caseLabel,
  },
  {
    id: "9",
    title: "Prepare for first consultation with mother",
    type: "checklist",
    status: "completed",
    timestamp: "Yesterday, 9:15 AM",
    caseId: caseOptions[4].caseId,
    caseLabel: caseOptions[4].caseLabel,
    timeRange: "0-6",
    checklistItemId: "5",
  },
  {
    id: "10",
    title: "MOM conversation",
    type: "checklist",
    status: "completed",
    timestamp: "2 days ago",
    caseId: caseOptions[4].caseId,
    caseLabel: caseOptions[4].caseLabel,
    timeRange: "0-6",
    checklistItemId: "1",
  },
  {
    id: "11",
    title: "New case logged",
    type: "case",
    status: "completed",
    timestamp: "3 days ago",
    caseId: caseOptions[5].caseId,
    caseLabel: caseOptions[5].caseLabel,
  },
  {
    id: "12",
    title: "Follow-Up & PP2 Preparation",
    type: "checklist",
    status: "completed",
    timestamp: "4 days ago",
    caseId: caseOptions[5].caseId,
    caseLabel: caseOptions[5].caseLabel,
    timeRange: "12-18",
    checklistItemId: "s12-1",
  },
  {
    id: "13",
    title: "Post-Pumping Assessment",
    type: "checklist",
    status: "completed",
    timestamp: "5 days ago",
    caseId: caseOptions[0].caseId,
    caseLabel: caseOptions[0].caseLabel,
    timeRange: "6-12",
    checklistItemId: "18",
  },
  {
    id: "14",
    title: "New case logged",
    type: "case",
    status: "completed",
    timestamp: "1 week ago",
    caseId: caseOptions[1].caseId,
    caseLabel: caseOptions[1].caseLabel,
  },
  {
    id: "15",
    title: "Follow-Up & PP2 Preparation",
    type: "checklist",
    status: "completed",
    timestamp: "1 week ago",
    caseId: caseOptions[2].caseId,
    caseLabel: caseOptions[2].caseLabel,
    timeRange: "12-18",
    checklistItemId: "s12-1",
  },
]

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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
      </div>

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
