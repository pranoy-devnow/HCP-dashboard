/**
 * Session / auth. All session reads and writes go through this service.
 * When the backend is ready, login can call POST /api/auth/login and then setSession with the response.
 */

import type { SessionUser } from "@/types/session"
import {
  getSessionUser as libGetSessionUser,
  setSessionUser as libSetSessionUser,
  clearSession as libClearSession,
} from "@/lib/auth-session"

/** Return the current session user, or null if not signed in. */
export function getSession(): SessionUser | null {
  try {
    return libGetSessionUser()
  } catch (err) {
    console.error("[authService] getSession failed:", err)
    return null
  }
}

/** Store session after successful login. Later: call API first, then setSession with token/user. */
export function setSession(user: { email: string; name?: string; avatar?: string }): void {
  try {
    libSetSessionUser(user)
  } catch (err) {
    console.error("[authService] setSession failed:", err)
  }
}

/** Clear session (logout). */
export function clearSession(): void {
  try {
    libClearSession()
  } catch (err) {
    console.error("[authService] clearSession failed:", err)
  }
}
