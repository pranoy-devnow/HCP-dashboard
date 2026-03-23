import { redirect } from "next/navigation"

/**
 * Dashboard route redirects to My Day as the primary HCP landing.
 * The previous dashboard content (charts, table) has been superseded by My Day.
 */
export default function DashboardPage() {
  redirect("/my-day")
}
