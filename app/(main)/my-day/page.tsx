"use client"

import * as React from "react"
import Link from "next/link"
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Clock,
  FolderOpen,
  MapPin,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { getCaseFiles, getBabyTitle } from "@/services/caseFilesService"
import { getAlerts, markAlertRead } from "@/services/alertsService"
import { markPendingConsultRead } from "@/services/pendingConsultReadService"
import { useAlertsReadIds } from "@/hooks/use-alerts-read-ids"
import { usePendingConsultReadIds } from "@/hooks/use-pending-consult-read-ids"
import {
  getPriorityCases,
  getPriorityBadgeLabel,
  getPriorityReason,
  getLocationLabel,
  formatAgeForMyDay,
  formatAlertDeliveryChip,
  formatAlertFeedingStatusChip,
  formatAlertCSectionReasonChip,
  isCSectionDelivery,
} from "@/lib/my-day-helpers"
import { getHoursSinceBirth } from "@/lib/case-file-detail-helpers"
import { formatAgeLive } from "@/lib/time-since-birth"
import { caseFileHrefFromMyDay } from "@/lib/case-file-back-navigation"
import { formatMyDayAlertDayHeading, groupAlertsByLocalDay } from "@/lib/alert-day-grouping"

export default function MyDayPage() {
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  const caseFiles = React.useMemo(() => getCaseFiles(), [])
  const priorityCases = React.useMemo(() => getPriorityCases(caseFiles, now), [caseFiles, now])
  const alerts = React.useMemo(() => getAlerts(), [])
  const readAlertIds = useAlertsReadIds()
  const pendingConsultReadIds = usePendingConsultReadIds()

  /** All clinical alerts appear under Critical Alerts; every row uses red styling. */
  const criticalAlertsAll = React.useMemo(() => alerts, [alerts])
  /** Tab badge: alerts not yet opened / marked read (same idea as Pending Consults). */
  const criticalAlertsUnreadCount = React.useMemo(
    () => criticalAlertsAll.filter((a) => !readAlertIds.has(a.id)).length,
    [criticalAlertsAll, readAlertIds]
  )
  const criticalAlertsSorted = React.useMemo(() => {
    return [...criticalAlertsAll].sort((a, b) => {
      const aRead = readAlertIds.has(a.id) ? 1 : 0
      const bRead = readAlertIds.has(b.id) ? 1 : 0
      return aRead - bRead
    })
  }, [criticalAlertsAll, readAlertIds])
  const criticalAlertsByDay = React.useMemo(
    () => groupAlertsByLocalDay(criticalAlertsSorted, now),
    [criticalAlertsSorted, now]
  )
  const totalPatients = caseFiles.length
  const pendingConsultsUnreadCount = React.useMemo(
    () => priorityCases.filter((f) => !pendingConsultReadIds.has(f.id)).length,
    [priorityCases, pendingConsultReadIds]
  )
  const priorityCasesSorted = React.useMemo(() => {
    return [...priorityCases].sort((a, b) => {
      const aRead = pendingConsultReadIds.has(a.id) ? 1 : 0
      const bRead = pendingConsultReadIds.has(b.id) ? 1 : 0
      return aRead - bRead
    })
  }, [priorityCases, pendingConsultReadIds])

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <Tabs defaultValue="critical-alerts" className="w-full">
        <TabsList className="!h-auto w-full grid grid-cols-3 gap-3 rounded-none border-0 bg-transparent p-0 shadow-none">
          <TabsTrigger
            value="critical-alerts"
            aria-label={`Critical alerts, ${criticalAlertsUnreadCount} unread`}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200",
              "data-[state=active]:border-red-500/50 data-[state=active]:bg-red-50/40 data-[state=active]:shadow-md dark:data-[state=active]:bg-red-950/20",
              "data-[state=inactive]:border-border data-[state=inactive]:bg-muted/40 data-[state=inactive]:hover:border-red-500/30 data-[state=inactive]:hover:bg-muted/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400">
              <AlertTriangle className="size-5" />
            </span>
            <span className="text-sm font-semibold text-foreground">Critical Alerts</span>
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {criticalAlertsUnreadCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="pending-consults"
            aria-label={`Pending consults, ${pendingConsultsUnreadCount} unread`}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200",
              "data-[state=active]:border-amber-500/50 data-[state=active]:bg-amber-50/40 data-[state=active]:shadow-md dark:data-[state=active]:bg-amber-950/20",
              "data-[state=inactive]:border-border data-[state=inactive]:bg-muted/40 data-[state=inactive]:hover:border-amber-500/30 data-[state=inactive]:hover:bg-muted/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
              <Calendar className="size-5" />
            </span>
            <span className="text-sm font-semibold text-foreground">Pending Consults</span>
            <span className="text-2xl font-bold tabular-nums text-foreground">{pendingConsultsUnreadCount}</span>
          </TabsTrigger>
          <TabsTrigger
            value="total-patients"
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200",
              "data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-md dark:data-[state=active]:bg-primary/10",
              "data-[state=inactive]:border-border data-[state=inactive]:bg-muted/40 data-[state=inactive]:hover:border-primary/50 data-[state=inactive]:hover:bg-muted/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Users className="size-5" />
            </span>
            <span className="text-sm font-semibold text-foreground">Total Patients</span>
            <span className="text-2xl font-bold tabular-nums text-foreground">{totalPatients}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="critical-alerts" className="mt-4 outline-none">
          {criticalAlertsAll.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No alerts.</p>
          ) : (
            <div className="space-y-6">
              {criticalAlertsByDay.map(({ dayKey, alerts: dayAlerts }) => (
                <section
                  key={dayKey}
                  aria-labelledby={`alerts-day-${dayKey}`}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" aria-hidden />
                    <h2
                      id={`alerts-day-${dayKey}`}
                      className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {formatMyDayAlertDayHeading(dayKey, now)}
                    </h2>
                    <div className="h-px flex-1 bg-border" aria-hidden />
                  </div>
                  <ul className="space-y-3">
                    {dayAlerts.map((alert) => {
                      const isRead = readAlertIds.has(alert.id)
                      const caseFile = caseFiles.find((f) => f.id === alert.caseId)
                      /** Fixed order: Gravida → method of feeding → sodium → delivery (last). */
                      const deliveryBadge =
                        caseFile?.deliveryType &&
                        !isCSectionDelivery(caseFile.deliveryType)
                          ? {
                              label: formatAlertDeliveryChip(caseFile.deliveryType),
                              key: "delivery",
                            }
                          : caseFile?.deliveryType &&
                              isCSectionDelivery(caseFile.deliveryType) &&
                              caseFile.reasonForCSection?.trim()
                            ? {
                                label: formatAlertCSectionReasonChip(
                                  caseFile.reasonForCSection
                                ),
                                key: "c-section-reason",
                              }
                            : caseFile?.deliveryType &&
                                isCSectionDelivery(caseFile.deliveryType) &&
                                !caseFile.reasonForCSection?.trim()
                              ? { label: "C-section", key: "c-section-only" }
                              : null
                      const detailBadges = [
                        caseFile?.gravida != null && {
                          label: `Gravida: ${caseFile.gravida}`,
                          key: "gravida",
                        },
                        caseFile?.feedingStatus && {
                          label: formatAlertFeedingStatusChip(caseFile.feedingStatus),
                          key: "feeding-status",
                        },
                        caseFile?.sodiumLevel && {
                          label: `Sodium level: ${caseFile.sodiumLevel}`,
                          key: "sodium",
                        },
                        deliveryBadge,
                      ].filter((b): b is { label: string; key: string } => Boolean(b && b.label))
                      return (
                        <li key={alert.id}>
                          <Link
                            href={caseFileHrefFromMyDay(alert.caseId)}
                            onClick={() => markAlertRead(alert.id)}
                            aria-label={
                              isRead
                                ? `${alert.patientName}, opened. ${alert.message}`
                                : `${alert.patientName}, unread alert. ${alert.message}`
                            }
                            className={cn(
                              "group flex items-center gap-3 rounded-lg border-l-4 p-4 transition-colors",
                              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                              isRead
                                ? "border-l-transparent border border-border bg-muted/25 hover:bg-muted/45 dark:bg-muted/20 dark:hover:bg-muted/35"
                                : "border border-red-200/80 border-l-red-600 bg-red-50/70 hover:bg-red-100/80 dark:border-red-900/60 dark:border-l-red-500 dark:bg-red-950/40 dark:hover:bg-red-950/50"
                            )}
                          >
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  isRead ? "text-muted-foreground" : "text-red-950 dark:text-red-100"
                                )}
                              >
                                {alert.patientName}
                              </p>
                              <p
                                className={cn(
                                  "text-sm leading-snug",
                                  isRead ? "text-muted-foreground" : "text-red-950 dark:text-red-100/95"
                                )}
                              >
                                <span className="sr-only">Alert: </span>
                                {alert.message}
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                {detailBadges.map(({ label, key }) => (
                                  <Badge
                                    key={key}
                                    variant="secondary"
                                    className={cn(
                                      "shrink-0 text-xs",
                                      isRead
                                        ? "border-border bg-muted/80 text-muted-foreground"
                                        : "border border-red-200/60 bg-red-100/50 text-red-900/85 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-200/90"
                                    )}
                                  >
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <ChevronRight
                              className={cn(
                                "size-5 shrink-0 transition-transform group-hover:translate-x-0.5",
                                isRead
                                  ? "text-muted-foreground group-hover:text-foreground"
                                  : "text-red-600/70 group-hover:text-red-700 dark:text-red-400/80 dark:group-hover:text-red-300"
                              )}
                              aria-hidden
                            />
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending-consults" className="mt-4 outline-none">
          <div className="rounded-lg border bg-card">
            <div className="p-4">
              {priorityCases.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No pending consults.
                </p>
              ) : (
                <ul className="space-y-3">
                  {priorityCasesSorted.map((file) => {
                    const isOpened = pendingConsultReadIds.has(file.id)
                    const hours = getHoursSinceBirth(file.dateOfBirth, file.birthTime, now)
                    const badgeLabel = getPriorityBadgeLabel(file.status)
                    const isInitialConsult = badgeLabel === "Initial Consult"
                    return (
                      <li key={file.id}>
                        <Link
                          href={caseFileHrefFromMyDay(file.id)}
                          onClick={() => markPendingConsultRead(file.id)}
                          aria-label={
                            isOpened
                              ? `${file.motherName}, opened pending consult. ${getPriorityReason(file, hours)}`
                              : `${file.motherName}, unread pending consult. ${getPriorityReason(file, hours)}`
                          }
                          className={cn(
                            "group flex flex-col gap-2 rounded-lg border-l-4 p-4 transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            isOpened
                              ? "border-l-transparent border border-border bg-muted/25 hover:bg-muted/45 dark:bg-muted/20 dark:hover:bg-muted/35"
                              : "border-l-yellow-500 bg-yellow-50/80 hover:bg-yellow-50 dark:border-l-yellow-400 dark:bg-yellow-950/35 dark:hover:bg-yellow-950/45"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span
                                  className={cn(
                                    "font-semibold text-sm",
                                    isOpened ? "text-muted-foreground" : "text-foreground"
                                  )}
                                >
                                  {file.motherName}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "text-xs font-medium shrink-0 border-0",
                                    isOpened
                                      ? "bg-muted text-muted-foreground"
                                      : isInitialConsult
                                        ? "bg-yellow-500/90 text-yellow-950 hover:bg-yellow-500 dark:bg-yellow-500/80 dark:text-yellow-950"
                                        : "bg-amber-500/85 text-amber-950 hover:bg-amber-500 dark:bg-amber-500/75 dark:text-amber-950"
                                  )}
                                >
                                  {badgeLabel}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                <Clock className="size-3.5 shrink-0" />
                                <span className="tabular-nums">
                                  {formatAgeForMyDay(file.dateOfBirth, file.birthTime, now)}
                                </span>
                              </div>
                              <p
                                className={cn(
                                  "text-sm",
                                  isOpened ? "text-muted-foreground" : "text-foreground/90"
                                )}
                              >
                                {getPriorityReason(file, hours)}
                              </p>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                                <MapPin className="size-3.5 shrink-0" />
                                <span>{getLocationLabel(file)}</span>
                              </div>
                            </div>
                            <ChevronRight
                              className={cn(
                                "size-5 shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5",
                                isOpened ? "text-muted-foreground" : "text-muted-foreground group-hover:text-foreground"
                              )}
                            />
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="total-patients" className="mt-4 outline-none">
          <div className="rounded-lg border bg-card">
            <div className="p-4">
              {caseFiles.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No patients.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caseFiles.map((file) => (
                    <Link
                      key={file.id}
                      href={caseFileHrefFromMyDay(file.id)}
                      className={cn(
                        "group relative flex flex-col items-start gap-3 p-4 bg-background border rounded-lg",
                        "hover:border-primary/50 hover:shadow-md transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20"
                      )}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary shrink-0">
                          <FolderOpen className="size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                            {getBabyTitle(file)}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Mother: {file.motherName} · Room {file.location.room}, Bed {file.location.bed}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                        <Badge variant="secondary" className="tabular-nums font-medium shrink-0">
                          Age: {formatAgeLive(file.dateOfBirth, file.birthTime, now)}
                        </Badge>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            file.status === "High priority" && "bg-red-500/15 text-red-600 dark:text-red-400",
                            file.status === "Critical Window" && "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                            file.status === "Needs Follow-up" && "bg-orange-500/15 text-orange-700 dark:text-orange-400",
                            !["High priority", "Critical Window", "Needs Follow-up"].includes(file.status) && "bg-primary/10 text-primary"
                          )}
                        >
                          {file.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
