import type { PumpingSession } from "@/types/pumping-sessions"

/** Mock recent pumping sessions for case file detail. */
export function getRecentPumpingSessions(): PumpingSession[] {
  return [
    {
      id: "1",
      dateTime: "2026-02-06 at 10:00",
      durationMinutes: 15,
      badges: [
        { label: "Symphony NICU", variant: "equipment" },
        { label: "Initiate", variant: "phase" },
      ],
      leftMl: 0.4,
      rightMl: 0.4,
      totalMl: 0.8,
      totalDisplay: "<1 ml",
      comfortSettings: {
        shieldSizes: "L: 24mm / R: 24mm",
        vacuumLevel: 6,
        comfortNotes:
          "Fourth session - small drops collected, colostrum. Comfort 4/5 - improving",
      },
    },
    {
      id: "2",
      dateTime: "2026-02-06 at 06:00",
      durationMinutes: 15,
      badges: [
        { label: "Symphony NICU", variant: "equipment" },
        { label: "Initiate", variant: "phase" },
      ],
      leftMl: 0.2,
      rightMl: 0.3,
      totalMl: 0.5,
      totalDisplay: "<1 ml",
      comfortSettings: {
        shieldSizes: "L: 24mm / R: 24mm",
        vacuumLevel: 5,
        comfortNotes: "Third session - colostrum only. Comfort 3/5.",
      },
    },
    {
      id: "3",
      dateTime: "2026-02-05 at 22:00",
      durationMinutes: 10,
      badges: [
        { label: "Symphony NICU", variant: "equipment" },
        { label: "Initiate", variant: "phase" },
      ],
      leftMl: 0.1,
      rightMl: 0.1,
      totalMl: 0.2,
      totalDisplay: "<1 ml",
      comfortSettings: {
        shieldSizes: "L: 24mm / R: 24mm",
        vacuumLevel: 4,
        comfortNotes: "Second session - few drops. Comfort 4/5.",
      },
    },
  ]
}
