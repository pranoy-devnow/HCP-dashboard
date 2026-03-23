/** Client-only persistence for which pending consult rows were opened from My Day. */

export const STORAGE_KEY_PENDING_CONSULT_READ_IDS = "hcp-pending-consult-read-ids"

export const PENDING_CONSULT_READ_CHANGED_EVENT = "hcp-pending-consult-read-changed"

export function loadPendingConsultReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PENDING_CONSULT_READ_IDS)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

export function savePendingConsultReadIds(ids: Set<string>): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY_PENDING_CONSULT_READ_IDS, JSON.stringify([...ids]))
    window.dispatchEvent(new CustomEvent(PENDING_CONSULT_READ_CHANGED_EVENT))
  } catch {
    // ignore
  }
}
