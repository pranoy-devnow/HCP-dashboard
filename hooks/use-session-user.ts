"use client"

import * as React from "react"
import { getSession } from "@/services/authService"
import { SESSION_CHANGE_EVENT } from "@/lib/auth-session"
import type { SessionUser } from "@/types/session"

export function useSessionUser(): SessionUser | null {
  const [user, setUser] = React.useState<SessionUser | null>(null)

  React.useLayoutEffect(() => {
    setUser(getSession())
    const sync = () => setUser(getSession())
    window.addEventListener(SESSION_CHANGE_EVENT, sync)
    return () => window.removeEventListener(SESSION_CHANGE_EVENT, sync)
  }, [])

  return user
}
