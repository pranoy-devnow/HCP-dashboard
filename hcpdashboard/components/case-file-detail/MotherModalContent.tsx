"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { getVolumeBarColor } from "@/lib/case-file-detail-helpers"
import {
  hourlyMilkVolumeData,
  leftVsRightData,
  hourlyChartConfig,
  leftRightChartConfig,
} from "@/lib/case-files-chart-data"

export function MotherModalContent() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="hourly" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="hourly">Hourly milk volume trend</TabsTrigger>
          <TabsTrigger value="leftRight">Left vs Right</TabsTrigger>
        </TabsList>
        <TabsContent value="hourly" className="mt-4">
          <p className="text-sm font-medium mb-2">Hourly milk volume (ml)</p>
          <ChartContainer config={hourlyChartConfig} className="aspect-auto h-[220px] w-full">
            <BarChart accessibilityLayer data={hourlyMilkVolumeData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} tickFormatter={(v) => `${v} ml`} />
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
                {hourlyMilkVolumeData.map((entry, index) => (
                  <Cell key={`${entry.hour}-${index}`} fill={getVolumeBarColor(entry.volume)} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </TabsContent>
        <TabsContent value="leftRight" className="mt-4">
          <p className="text-sm font-medium mb-2">Left vs Right breast output (ml)</p>
          <ChartContainer config={leftRightChartConfig} className="h-[220px] w-full">
            <BarChart data={leftVsRightData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="left" fill="var(--color-left)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="right" fill="var(--color-right)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  )
}
