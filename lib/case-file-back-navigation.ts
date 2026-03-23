/** Query key used when opening a case file from another screen (see case file detail back button). */
export const CASE_FILE_FROM_QUERY_KEY = "from" as const

/** Allowed values for `from` when linking to `/case-files/[id]`. */
export const CASE_FILE_FROM_MY_DAY = "my-day" as const

export type CaseFileBackNavigation = {
  path: string
  label: string
}

/** Resolves back path + label from the `from` search param (defaults to Case Files list). */
export function getCaseFileBackNavigation(from: string | null): CaseFileBackNavigation {
  if (from === CASE_FILE_FROM_MY_DAY) {
    return { path: "/my-day", label: "Back to My Day" }
  }
  return { path: "/case-files", label: "Back to Case Files" }
}

/** Append to case file URLs opened from My Day so the detail page can return correctly. */
export function caseFileHrefFromMyDay(caseId: string): string {
  return `/case-files/${caseId}?${CASE_FILE_FROM_QUERY_KEY}=${CASE_FILE_FROM_MY_DAY}`
}
