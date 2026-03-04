import type { ChartConfig } from "@/components/ui/chart"

/** Mock hourly milk volume for mother modal (session index used in tooltip). */
export const hourlyMilkVolumeData = [
  { hour: "06:00", volume: 25, session: 1 },
  { hour: "08:00", volume: 52, session: 2 },
  { hour: "10:00", volume: 78, session: 3 },
  { hour: "12:00", volume: 50, session: 4 },
  { hour: "14:00", volume: 15, session: 5 },
  { hour: "16:00", volume: 54, session: 6 },
  { hour: "18:00", volume: 88, session: 7 },
  { hour: "20:00", volume: 48, session: 8 },
  { hour: "22:00", volume: 32, session: 9 },
]

/** Mock left vs right breast output for mother modal. */
export const leftVsRightData = [
  { time: "18:00", left: 58, right: 55 },
  { time: "22:00", left: 46, right: 48 },
  { time: "06:00", left: 50, right: 47 },
  { time: "10:00", left: 49, right: 51 },
  { time: "14:00", left: 48, right: 50 },
  { time: "18:00", left: 46, right: 47 },
  { time: "22:00", left: 47, right: 48 },
]

export const hourlyChartConfig = {
  volume: { label: "Milk (ml)", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

export const leftRightChartConfig = {
  left: { label: "Left Breast (ml)", color: "hsl(350 70% 65%)" },
  right: { label: "Right Breast (ml)", color: "hsl(270 60% 60%)" },
} satisfies ChartConfig

/** Fenton growth chart: weight-for-age percentile curves (approximate, 30–40 weeks PMA). */
export const fentonWeightData = [
  { week: 30, p3: 0.9, p10: 1.0, p50: 1.3, p90: 1.6, p97: 1.8 },
  { week: 31, p3: 1.0, p10: 1.1, p50: 1.4, p90: 1.75, p97: 2.0 },
  { week: 32, p3: 1.1, p10: 1.2, p50: 1.6, p90: 2.0, p97: 2.2 },
  { week: 33, p3: 1.2, p10: 1.35, p50: 1.8, p90: 2.2, p97: 2.5 },
  { week: 34, p3: 1.4, p10: 1.5, p50: 2.0, p90: 2.5, p97: 2.8 },
  { week: 35, p3: 1.55, p10: 1.7, p50: 2.2, p90: 2.75, p97: 3.1 },
  { week: 36, p3: 1.7, p10: 1.9, p50: 2.4, p90: 3.0, p97: 3.3 },
  { week: 37, p3: 1.85, p10: 2.05, p50: 2.6, p90: 3.25, p97: 3.6 },
  { week: 38, p3: 2.0, p10: 2.2, p50: 2.8, p90: 3.5, p97: 3.9 },
  { week: 39, p3: 2.15, p10: 2.35, p50: 3.0, p90: 3.75, p97: 4.15 },
  { week: 40, p3: 2.3, p10: 2.5, p50: 3.2, p90: 4.0, p97: 4.4 },
]

export const fentonChartConfig = {
  p3: { label: "3rd %ile", color: "hsl(350 70% 60%)" },
  p10: { label: "10th %ile", color: "hsl(25 90% 55%)" },
  p50: { label: "50th %ile (Median)", color: "hsl(220 80% 50%)" },
  p90: { label: "90th %ile", color: "hsl(25 90% 55%)" },
  p97: { label: "97th %ile", color: "hsl(350 70% 60%)" },
  baby: { label: "Baby", color: "hsl(270 60% 55%)" },
} satisfies ChartConfig
