/** Parse dateOfBirth (MM/DD/YYYY) + birthTime (HH:mm) into a Date. */
export function getBirthDate(dateOfBirth: string, birthTime: string): Date | null {
  const [mm, dd, yyyy] = dateOfBirth.split("/").map(Number)
  const [h, m] = birthTime.split(":").map(Number)
  if ([mm, dd, yyyy, h, m].some((n) => Number.isNaN(n))) return null
  const d = new Date(yyyy, mm - 1, dd, h, m, 0, 0)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * Live format: "Xh Ym" (or "24h+"). No seconds — avoids noisy per-second UI updates.
 * Uses demo cycle (0–24h repeat) when >= 24h.
 */
export function formatAgeLive(dateOfBirth: string, birthTime: string, now: Date): string {
  const birth = getBirthDate(dateOfBirth, birthTime)
  if (!birth) return "—"
  let totalSeconds = Math.max(0, (now.getTime() - birth.getTime()) / 1000)
  if (totalSeconds >= 24 * 3600) totalSeconds = totalSeconds % (24 * 3600)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  if (h >= 24) return "24h+"
  return `${h}h ${m}m`
}
