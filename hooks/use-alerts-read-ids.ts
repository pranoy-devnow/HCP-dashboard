"use client"

import * as React from "react"
import { loadAlertsReadIds } from "@/services/alertsService"

/**
 * Subscribes to persisted alert read IDs (localStorage + same-tab updates).
 * Starts empty on first paint to match SSR; syncs before paint via layout effect.
 */
export function useAlertsReadIds(): Set<string> {
  const [readIds, setReadIds] = React.useState<Set<string>>(() => new Set())

  React.useLayoutEffect(() => {
    setReadIds(loadAlertsReadIds())

    const sync = () => {
      setReadIds(loadAlertsReadIds())
    }

    window.addEventListener("hcp-alerts-read-changed", sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener("hcp-alerts-read-changed", sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  return readIds
}
