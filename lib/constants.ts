/**
 * Centralized config and asset paths.
 * Use these instead of hardcoding URLs or magic strings in components.
 */

/** Fallback base URL when VERCEL_URL and NEXT_PUBLIC_APP_URL are not set (e.g. local dev). */
export const FALLBACK_APP_URL = "http://localhost:3000"

/** Default avatar/image when user has no profile image. */
export const DEFAULT_USER_IMAGE = "/Images/user.png"

/** Hero image used on login page and in metadata. */
export const LOGIN_HERO_IMAGE = "/Images/login-hero.jpg"

/** Primary route after sign-in from the login screen (not Case Files). */
export const POST_LOGIN_REDIRECT_PATH = "/my-day" as const

/** Display name for the current user in demo/log (e.g. completion log "by"). */
export const CURRENT_USER_NAME = "Jake"

/** Reviewer options for case file / data table assignee dropdowns. */
export const REVIEWER_OPTIONS = [
  "Eddie Lake",
  "Jamik Tashpulatov",
  "Emily Whalen",
] as const

export type ReviewerOption = (typeof REVIEWER_OPTIONS)[number]
