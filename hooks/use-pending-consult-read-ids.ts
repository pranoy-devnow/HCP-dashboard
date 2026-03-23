"use client"

import * as React from "react"
import { PENDING_CONSULT_READ_CHANGED_EVENT } from "@/lib/pending-consult-read-data"
import { loadPendingConsultReadIds } from "@/services/pendingConsultReadService"

export function usePendingConsultReadIds(): Set<string> {
  const [readIds, setReadIds] = React.useState<Set<string>>(() => new Set())

  React.useLayoutEffect(() => {
    setReadIds(loadPendingConsultReadIds())

    const sync = () => {
      setReadIds(loadPendingConsultReadIds())
    }

    window.addEventListener(PENDING_CONSULT_READ_CHANGED_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(PENDING_CONSULT_READ_CHANGED_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  return readIds
}
