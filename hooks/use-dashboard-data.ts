"use client"

import * as React from "react"
import { getParsedDashboardData } from "@/services/dashboardDataService"
import type { ParsedDashboardData } from "@/lib/dashboard-data-parser"

export interface DashboardDataState {
  data: ParsedDashboardData | null
  isLoading: boolean
  error: string | null
  reload: () => void
}

const DashboardDataContext = React.createContext<DashboardDataState | null>(null)

/** Shared dashboard payload for My Day, case files, and case-file detail. */
export function DashboardDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<ParsedDashboardData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [reloadToken, setReloadToken] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    getParsedDashboardData({ force: reloadToken > 0 })
      .then((parsed) => {
        if (cancelled) return
        setData(parsed)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        console.error("[useDashboardData] load failed:", err)
        setError("Unable to load dashboard data.")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const value = React.useMemo<DashboardDataState>(
    () => ({
      data,
      isLoading,
      error,
      reload: () => setReloadToken((token) => token + 1),
    }),
    [data, isLoading, error]
  )

  return React.createElement(DashboardDataContext.Provider, { value }, children)
}

export function useDashboardData(): DashboardDataState {
  const context = React.useContext(DashboardDataContext)
  if (context) return context

  // Fallback when a page is rendered outside the provider (e.g. cards gallery).
  const [state, setState] = React.useState<DashboardDataState>({
    data: null,
    isLoading: true,
    error: null,
    reload: () => undefined,
  })

  React.useEffect(() => {
    let cancelled = false
    getParsedDashboardData()
      .then((parsed) => {
        if (!cancelled) {
          setState((prev) => ({ ...prev, data: parsed, isLoading: false, error: null }))
        }
      })
      .catch((err) => {
        console.error("[useDashboardData] load failed:", err)
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "Unable to load dashboard data.",
          }))
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
