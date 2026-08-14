/**
 * Dashboard fixture access. All dashboard-data reads go through this service.
 */

import { apiRequest } from "@/services/api"
import { parseDashboardData, type ParsedDashboardData } from "@/lib/dashboard-data-parser"
import type { DashboardApiResponse } from "@/types/dashboard-api"

const DASHBOARD_DATA_PATH = "/api/dashboard-data"

let cachedRaw: DashboardApiResponse | null = null
let inFlight: Promise<DashboardApiResponse> | null = null

/** Fetch the live dashboard payload. Uses an in-memory cache for the session. */
export async function fetchDashboardData(options?: {
  force?: boolean
}): Promise<DashboardApiResponse> {
  if (!options?.force && cachedRaw) return cachedRaw
  if (!options?.force && inFlight) return inFlight

  inFlight = apiRequest<DashboardApiResponse>(DASHBOARD_DATA_PATH)
    .then((data) => {
      cachedRaw = data
      return data
    })
    .catch((err) => {
      console.error("[dashboardDataService] fetchDashboardData failed:", err)
      throw err
    })
    .finally(() => {
      inFlight = null
    })

  return inFlight
}

/** Fetch and parse into dashboard view models. */
export async function getParsedDashboardData(options?: {
  force?: boolean
  now?: Date
}): Promise<ParsedDashboardData> {
  const raw = await fetchDashboardData({ force: options?.force })
  return parseDashboardData(raw, options?.now ?? new Date())
}

export function clearDashboardDataCache(): void {
  cachedRaw = null
}
