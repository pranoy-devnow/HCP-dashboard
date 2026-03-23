import type { Alert } from "@/types/alerts"

function startOfLocalDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/** `YYYY-MM-DD` in local calendar for the given instant. */
export function localDayKey(d: Date): string {
  const x = startOfLocalDay(d)
  const y = x.getFullYear()
  const m = String(x.getMonth() + 1).padStart(2, "0")
  const day = String(x.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Calendar day key for an alert using `dayBucketOffset` from “today” (local). */
export function dayKeyForAlert(now: Date, alert: Alert): string {
  const offset = alert.dayBucketOffset ?? 0
  const x = startOfLocalDay(now)
  x.setDate(x.getDate() - offset)
  return localDayKey(x)
}

/** Human-readable heading for a day row (Today / Yesterday / weekday, date). */
export function formatMyDayAlertDayHeading(dayKey: string, now: Date): string {
  const todayKey = localDayKey(now)
  const yest = startOfLocalDay(now)
  yest.setDate(yest.getDate() - 1)
  const yesterdayKey = localDayKey(yest)

  if (dayKey === todayKey) return "Today"
  if (dayKey === yesterdayKey) return "Yesterday"

  const [Y, M, D] = dayKey.split("-").map(Number)
  if ([Y, M, D].some(Number.isNaN)) return dayKey
  const d = new Date(Y, M - 1, D)
  const sameYear = Y === now.getFullYear()
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" as const }),
  })
}

export type AlertDayGroup<T extends Alert = Alert> = {
  dayKey: string
  alerts: T[]
}

/**
 * Groups alerts by local calendar day (newest day first).
 * Preserves relative order inside each day (e.g. unread-first sort).
 */
export function groupAlertsByLocalDay<T extends Alert>(orderedAlerts: T[], now: Date): AlertDayGroup<T>[] {
  const map = new Map<string, T[]>()

  for (const alert of orderedAlerts) {
    const key = dayKeyForAlert(now, alert)
    const list = map.get(key)
    if (list) list.push(alert)
    else map.set(key, [alert])
  }

  const keys = [...map.keys()].sort((a, b) => b.localeCompare(a))

  return keys.map((dayKey) => ({
    dayKey,
    alerts: map.get(dayKey)!,
  }))
}
