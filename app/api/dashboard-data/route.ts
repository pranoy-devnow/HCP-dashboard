import { NextResponse } from "next/server"
import { DASHBOARD_DATA_URL } from "@/lib/constants"

/** Server proxy so the browser does not call the AWS endpoint directly. */
export async function GET() {
  try {
    const res = await fetch(DASHBOARD_DATA_URL, { cache: "no-store" })
    if (!res.ok) {
      const text = await res.text()
      console.error("[api/dashboard-data]", res.status, text)
      return NextResponse.json(
        { error: `Upstream error: ${res.status}` },
        { status: res.status }
      )
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("[api/dashboard-data] fetch failed:", err)
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 502 })
  }
}
