"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { TrendingUp, Scale, BarChart3, Calendar, AlertCircle, Activity, MessageSquare } from "lucide-react"
import { getVolumeBarColor } from "@/lib/case-file-detail-helpers"
import {
  hourlyMilkVolumeData as fallbackHourlyMilkVolumeData,
  leftVsRightData as fallbackLeftVsRightData,
  hourlyChartConfig,
  leftRightChartConfig,
} from "@/lib/case-files-chart-data"
import { getRecentPumpingSessions } from "@/lib/pumping-sessions-data"
import type { HourlyVolumePoint, LeftRightPoint } from "@/lib/dashboard-data-parser"
import type { PumpingSession } from "@/types/pumping-sessions"
import { cn } from "@/lib/utils"

export type PumpingSessionsTab = "trend" | "leftRight" | "recent"

export interface PumpingSessionsSectionProps {
  /**
   * When set, hides the tab bar and renders only that panel — for Mom Data “Know more” modals.
   */
  singleTab?: PumpingSessionsTab
  sessions?: PumpingSession[]
  hourlyVolume?: HourlyVolumePoint[]
  leftVsRight?: LeftRightPoint[]
}

export function PumpingSessionsSection({
  singleTab,
  sessions: sessionsProp,
  hourlyVolume,
  leftVsRight,
}: PumpingSessionsSectionProps) {
  const sessions = React.useMemo(
    () => sessionsProp ?? getRecentPumpingSessions(),
    [sessionsProp]
  )
  const hourlyData = hourlyVolume && hourlyVolume.length > 0 ? hourlyVolume : fallbackHourlyMilkVolumeData
  const leftRightData = leftVsRight && leftVsRight.length > 0 ? leftVsRight : fallbackLeftVsRightData

  if (singleTab === "trend") {
    return (
      <div className="w-full p-3">
        <MilkVolumeTrendPanel data={hourlyData} />
      </div>
    )
  }
  if (singleTab === "leftRight") {
    return (
      <div className="w-full p-3">
        <LeftVsRightPanel data={leftRightData} />
      </div>
    )
  }
  if (singleTab === "recent") {
    return (
      <div className="w-full pt-1">
        <RecentSessionsContent sessions={sessions} />
      </div>
    )
  }

  const tabsContent = (
    <Tabs defaultValue="recent" className="w-full">
      <TabsList className="w-full h-auto flex flex-wrap gap-0 rounded-none border-b bg-muted/40 p-0 [&>button]:rounded-none [&>button]:border-b-2 [&>button]:border-transparent [&>button]:data-[state=active]:border-primary [&>button]:data-[state=active]:bg-background [&>button]:data-[state=active]:shadow-sm">
        <TabsTrigger value="trend" className="flex-1 min-w-0 gap-1.5 px-4 py-3">
          <TrendingUp className="size-4 shrink-0" />
          <span className="hidden sm:inline">Milk Volume Trend</span>
        </TabsTrigger>
        <TabsTrigger value="leftRight" className="flex-1 min-w-0 gap-1.5 px-4 py-3">
          <Scale className="size-4 shrink-0" />
          <span className="hidden sm:inline">Left vs Right</span>
        </TabsTrigger>
        <TabsTrigger value="recent" className="flex-1 min-w-0 gap-1.5 px-4 py-3">
          <BarChart3 className="size-4 shrink-0" />
          <span className="hidden sm:inline">Recent Sessions</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="trend" className="mt-0 p-3">
        <MilkVolumeTrendPanel data={hourlyData} />
      </TabsContent>

      <TabsContent value="leftRight" className="mt-0 p-3">
        <LeftVsRightPanel data={leftRightData} />
      </TabsContent>

      <TabsContent value="recent" className="mt-0">
        <RecentSessionsContent sessions={sessions} />
      </TabsContent>
    </Tabs>
  )

  return (
    <Card className="py-4 shadow-sm" aria-labelledby="pumping-volume-heading">
      <CardHeader className="px-4 pb-2 pt-4">
        <CardTitle id="pumping-volume-heading" className="text-lg" role="heading" aria-level={2}>
          Pumping & volume
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {tabsContent}
      </CardContent>
    </Card>
  )
}

function MilkVolumeTrendPanel({ data }: { data: HourlyVolumePoint[] }) {
  const maxVolume = Math.max(100, ...data.map((point) => point.volume))
  return (
    <>
      <p className="text-sm font-medium mb-2">Hourly milk volume (ml)</p>
      <ChartContainer config={hourlyChartConfig} className="aspect-auto h-[200px] w-full">
        <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={[0, maxVolume]}
            tickFormatter={(v) => `${v} ml`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                labelFormatter={(_, payload) => {
                  const session = payload?.[0]?.payload?.session
                  return session != null ? `Session ${session}` : ""
                }}
              />
            }
          />
          <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`${entry.hour}-${index}`} fill={getVolumeBarColor(entry.volume)} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </>
  )
}

function LeftVsRightPanel({ data }: { data: LeftRightPoint[] }) {
  return (
    <>
      <p className="text-sm font-medium mb-2">Left vs Right breast output (ml)</p>
      <ChartContainer config={leftRightChartConfig} className="h-[200px] w-full">
        <BarChart data={data} margin={{ left: 0, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="left" fill="var(--color-left)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="right" fill="var(--color-right)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </>
  )
}

function RecentSessionsContent({ sessions }: { sessions: PumpingSession[] }) {
  return (
    <div className="rounded-lg border bg-card mx-3 mb-3">
      <h3 className="text-sm font-semibold px-3 pt-3 pb-2">Recent Pumping Sessions</h3>
      <div className="divide-y">
        {sessions.map((session) => (
          <SessionRow key={session.id} session={session} />
        ))}
      </div>
    </div>
  )
}

function SessionRow({ session }: { session: PumpingSession }) {
  return (
    <div className="px-3 py-3 space-y-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 shrink-0 text-muted-foreground" />
            <span className="font-medium">{session.dateTime}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {session.badges.map((badge) => (
              <Badge
                key={badge.label}
                variant="secondary"
                className={cn(
                  "text-xs font-normal",
                  badge.variant === "equipment" && "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
                  badge.variant === "phase" && "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                )}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
          <p className="w-full text-sm text-muted-foreground pl-6">{session.durationMinutes} minutes</p>
        </div>
        <div className="w-full sm:w-auto sm:min-w-[120px] grid grid-cols-3 gap-2 text-sm text-right">
          <div>
            <span className="text-muted-foreground block text-xs">Left</span>
            <span className="font-medium">{session.leftMl} ml</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">Right</span>
            <span className="font-medium">{session.rightMl} ml</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">Total</span>
            <span className="font-medium">{session.totalDisplay ?? `${session.totalMl} ml`}</span>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-muted/50 p-2 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Session Comfort Settings
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
              <AlertCircle className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Shield Sizes</p>
              <p className="text-sm font-medium">{session.comfortSettings.shieldSizes}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <Activity className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Vacuum Level</p>
              <p className="text-sm font-medium">{session.comfortSettings.vacuumLevel}</p>
            </div>
          </div>
          <div className="flex gap-2 md:col-span-1">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              <MessageSquare className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Comfort Notes</p>
              <p className="text-sm">{session.comfortSettings.comfortNotes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
