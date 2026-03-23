/** Single pumping session for the Recent Sessions tab. */
export interface PumpingSession {
  id: string
  dateTime: string
  durationMinutes: number
  badges: { label: string; variant: "equipment" | "phase" }[]
  leftMl: number
  rightMl: number
  totalMl: number
  /** Total display string when very small (e.g. "<1 ml"). */
  totalDisplay?: string
  comfortSettings: {
    shieldSizes: string
    vacuumLevel: number
    comfortNotes: string
  }
}
