"use client"

import type { SessionUser } from "@/types/session"

const SESSION_KEY = "hcp-session-user"

function getStored(): SessionUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as SessionUser
    return data?.email ? data : null
  } catch {
    return null
  }
}

/** Returns the currently signed-in user, or null if not signed in. */
export function getSessionUser(): SessionUser | null {
  return getStored()
}

const SESSION_CHANGE_EVENT = "hcp-session-change"

function notifySessionChange() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(SESSION_CHANGE_EVENT))
}

/** Store the signed-in user (call after successful login). */
export function setSessionUser(user: { email: string; name?: string; avatar?: string }) {
  if (typeof window === "undefined") return
  try {
    const name = user.name ?? user.email.split("@")[0] ?? "User"
    const data: SessionUser = {
      name,
      email: user.email,
      avatar: user.avatar,
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
    notifySessionChange()
  } catch {
    // ignore
  }
}

/** Clear the session (call on logout). */
export function clearSession(): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(SESSION_KEY)
    notifySessionChange()
  } catch {
    // ignore
  }
}
