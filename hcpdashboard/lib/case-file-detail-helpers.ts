import { getBirthDate } from "@/lib/time-since-birth"
import type { TimelineSectionKey } from "@/types/case-files"

/** Bar color by milk volume tier (low / mid / high). */
export function getVolumeBarColor(volume: number): string {
  if (volume <= 35) return "hsl(0 70% 52%)"
  if (volume <= 65) return "hsl(220 70% 55%)"
  return "hsl(142 60% 42%)"
}

/** Parse weight string (e.g. "2.85 kg") to number in kg. */
export function parseWeightKg(weightStr: string): number {
  const match = weightStr.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

/** Compute postmenstrual age in weeks from gestational weeks + age string. */
export function postmenstrualAgeWeeks(gestationalWeeks: number, ageStr: string): number {
  const daysMatch = ageStr.match(/(\d+)\s*days?/i)
  const weeksMatch = ageStr.match(/(\d+)\s*weeks?/i)
  if (daysMatch) return gestationalWeeks + parseInt(daysMatch[1], 10) / 7
  if (weeksMatch) return gestationalWeeks + parseInt(weeksMatch[1], 10)
  return gestationalWeeks
}

/** Hours since birth; 0 if birth is in the future. */
export function getHoursSinceBirth(
  dateOfBirth: string,
  birthTime: string,
  now: Date = new Date()
): number {
  const birth = getBirthDate(dateOfBirth, birthTime)
  if (!birth) return 0
  const ms = now.getTime() - birth.getTime()
  return Math.max(0, ms / (1000 * 60 * 60))
}

/** Which care timeline section is "current" for this many hours since birth. */
export function getCurrentSectionKey(hoursSinceBirth: number): TimelineSectionKey | null {
  if (hoursSinceBirth < 0) return null
  if (hoursSinceBirth < 6) return "0-6"
  if (hoursSinceBirth < 12) return "6-12"
  if (hoursSinceBirth < 18) return "12-18"
  if (hoursSinceBirth < 24) return "18-24"
  return null
}
