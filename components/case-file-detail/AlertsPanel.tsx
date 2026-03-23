"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  getAlertsByCaseId,
  loadAlertsReadIds,
  markAlertRead,
} from "@/services/alertsService"
import type { Alert, AlertSeverity } from "@/types/alerts"

function severityVariant(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400"
    case "high":
      return "bg-orange-500/15 text-orange-700 dark:text-orange-400"
    case "medium":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function formatAlertType(type: Alert["type"]): string {
  return type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export interface AlertsPanelProps {
  caseId: string
  className?: string
}

export function AlertsPanel({ caseId, className }: AlertsPanelProps) {
  const alerts = React.useMemo(() => getAlertsByCaseId(caseId), [caseId])
  const [readIds, setReadIds] = React.useState(() => loadAlertsReadIds())

  React.useEffect(() => {
    const handler = () => setReadIds(loadAlertsReadIds())
    window.addEventListener("hcp-alerts-read-changed", handler)
    return () => window.removeEventListener("hcp-alerts-read-changed", handler)
  }, [])

  if (alerts.length === 0) return null

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="size-4 text-muted-foreground" />
          Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {alerts.map((alert) => {
            const isRead = readIds.has(alert.id)
            return (
              <li
                key={alert.id}
                className={cn(
                  "flex flex-col gap-2 rounded-lg border p-3 transition-colors",
                  isRead ? "bg-muted/30 border-muted" : "bg-background"
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn("text-xs font-normal", severityVariant(alert.severity))}
                  >
                    {formatAlertType(alert.type)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                  {!isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto h-7 text-xs"
                      onClick={() => markAlertRead(alert.id)}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
                <p className={cn("text-sm", isRead && "text-muted-foreground")}>
                  {alert.message}
                </p>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
