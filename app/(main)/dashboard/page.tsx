import { redirect } from "next/navigation"
import { POST_LOGIN_REDIRECT_PATH } from "@/lib/constants"

/**
 * Dashboard route redirects to My Day as the primary HCP landing.
 * The previous dashboard content (charts, table) has been superseded by My Day.
 */
export default function DashboardPage() {
  redirect(POST_LOGIN_REDIRECT_PATH)
}
