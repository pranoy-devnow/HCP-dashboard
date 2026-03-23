import type { CaseFileRecord } from "@/types/case-files"
import type { MomDataCardItem } from "@/types/case-file-detail-cards"
import { getAvgDailyVolumeMetric, getPumpingFrequencyMetric } from "./case-file-detail-cards-data"

export function getMomDataItems(patient: CaseFileRecord): MomDataCardItem[] {
  const avgVolume = getAvgDailyVolumeMetric(patient)
  const pumping = getPumpingFrequencyMetric(patient)
  return [
    {
      id: "avg-daily-volume",
      label: "Avg daily volume",
      value: avgVolume.value,
      trend: avgVolume.trend === "neutral" ? undefined : avgVolume.trend,
      iconKey: "droplets",
      showKnowMore: false,
    },
    {
      id: "pumping-avg-per-day",
      label: "Pumping frequency: Average per day",
      value: String(pumping.averagePerDay),
      subInfo: `Target: ${pumping.target}`,
      iconKey: "clock",
      showKnowMore: false,
    },
    {
      id: "pumping-past-24h",
      label: "Pumping frequency: Past 24 hours",
      value: `${pumping.past24Hours} ${pumping.past24HoursLabel}`,
      iconKey: "clock",
      showKnowMore: false,
    },
    {
      id: "milk-trend-volume",
      label: "Milk trend volume",
      value: "Trending up",
      trend: "up",
      iconKey: "trend",
    },
    {
      id: "left-and-right",
      label: "Left and Right",
      value: "0.4 ml / 0.4 ml",
      subInfo: "Last session",
      iconKey: "scale",
    },
    {
      id: "recent-session",
      label: "Recent session",
      value: "3 sessions",
      subInfo: "View details",
      iconKey: "calendar",
    },
  ]
}
