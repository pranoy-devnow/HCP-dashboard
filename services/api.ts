/**
 * Shared API configuration and helpers.
 * When adding real backend calls, use getApiBaseUrl() and apiRequest() here.
 * Do not call fetch/axios from components or pages—only from service files.
 */

import { FALLBACK_APP_URL } from "@/lib/constants"

/**
 * Base URL for API requests. Use in services when calling the backend.
 * Prefer env NEXT_PUBLIC_APP_URL or VERCEL_URL so it works in production.
 */
export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env?.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  return FALLBACK_APP_URL
}

/**
 * Call this from services when you add real API endpoints.
 * Example: const data = await apiRequest<CaseFileRecord[]>('/api/case-files')
 */
export async function apiRequest<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const base = getApiBaseUrl()
  const url = path.startsWith("http") ? path : `${base}${path}`
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })
    if (!res.ok) {
      const text = await res.text()
      console.error(`[api] ${res.status} ${path}:`, text)
      throw new Error(`API error: ${res.status} ${path}`)
    }
    const data = (await res.json()) as T
    return data
  } catch (err) {
    console.error(`[api] request failed ${path}:`, err)
    throw err
  }
}
