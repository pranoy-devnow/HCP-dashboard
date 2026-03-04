"use client"

import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Line, LineChart, ReferenceDot, CartesianGrid, XAxis, YAxis } from "recharts"
import { parseWeightKg, postmenstrualAgeWeeks } from "@/lib/case-file-detail-helpers"
import { fentonWeightData, fentonChartConfig } from "@/lib/case-files-chart-data"
import type { CaseFileRecord } from "@/types/case-files"

function genderLabel(babyGender: CaseFileRecord["babyGender"]): string {
  if (babyGender === "Baby Girl") return "Female"
  if (babyGender === "Baby Boy") return "Male"
  return "Unknown"
}

export function BabyModalContent({ patient }: { patient: CaseFileRecord }) {
  const babyWeightKg = parseWeightKg(patient.currentWeight)
  const pmaWeeks = postmenstrualAgeWeeks(patient.gestationalAgeWeeks, patient.age)
  const babyLabel = `${patient.motherLastName}, ${patient.babyGender}`
  const gender = genderLabel(patient.babyGender)

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-semibold text-foreground">Fenton Growth Chart - Weight for Age</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
            {gender} • GA: {patient.gestationalAgeWeeks}w
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300">
            Z-Score: -3.00
          </Badge>
        </div>
      </div>
      <ChartContainer
        config={fentonChartConfig}
        className="aspect-auto h-[300px] w-full min-w-0 overflow-visible [&_.recharts-cartesian-axis-tick_text]:fill-foreground [&_.recharts-cartesian-axis-tick_text]:text-xs"
      >
        <LineChart accessibilityLayer data={fentonWeightData} margin={{ left: 52, right: 24, top: 20, bottom: 44 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="week" type="number" domain={[30, 40]} tickLine={{ stroke: "#64748b", strokeWidth: 1 }} axisLine={{ stroke: "#475569", strokeWidth: 2 }} tickMargin={10} tickFormatter={(v) => `${v}`} label={{ value: "Postmenstrual Age (weeks)", position: "bottom", offset: 24 }} />
          <YAxis tickLine={{ stroke: "#64748b", strokeWidth: 1 }} axisLine={{ stroke: "#475569", strokeWidth: 2 }} tickMargin={10} domain={[0.4, 4.5]} tickFormatter={(v) => `${v}`} label={{ value: "Weight (kg)", angle: -90, position: "insideLeft", offset: 10 }} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line dataKey="p3" type="monotone" stroke="var(--color-p3)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
          <Line dataKey="p10" type="monotone" stroke="var(--color-p10)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
          <Line dataKey="p50" type="monotone" stroke="var(--color-p50)" strokeWidth={2} dot={false} />
          <Line dataKey="p90" type="monotone" stroke="var(--color-p90)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
          <Line dataKey="p97" type="monotone" stroke="var(--color-p97)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
          <ReferenceDot x={pmaWeeks} y={babyWeightKg} r={6} fill="var(--color-baby)" stroke="var(--color-baby)" strokeWidth={2} />
        </LineChart>
      </ChartContainer>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground pt-2">
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 border-b-2 border-dashed border-[hsl(350,70%,60%)]" /> 3rd %ile</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 border-b-2 border-dashed border-[hsl(25,90%,55%)]" /> 10th %ile</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 border-b-2 border-[hsl(220,80%,50%)]" /> 50th %ile (Median)</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 border-b-2 border-dashed border-[hsl(25,90%,55%)]" /> 90th %ile</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 border-b-2 border-dashed border-[hsl(350,70%,60%)]" /> 97th %ile</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[hsl(270,60%,55%)]" /> {babyLabel}</span>
      </div>
    </div>
  )
}
