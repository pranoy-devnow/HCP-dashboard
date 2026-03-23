"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SiteHeaderUserMenu } from "@/components/site-header-user-menu"

const pageTitles: Record<string, string> = {
  "/my-day": "My Day",
  "/case-files": "Case Files",
  "/cards": "Reference cards",
  "/settings": "Settings",
  "/dashboard": "Dashboard",
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? (pathname.startsWith("/case-files/") ? "Case File" : "Dashboard")

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 overflow-visible border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 overflow-visible px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1 shrink-0" />
          <Separator
            orientation="vertical"
            className="mx-2 shrink-0 data-[orientation=vertical]:h-4"
          />
          <h1 className="min-w-0 truncate text-base font-medium">{title}</h1>
        </div>
        <SiteHeaderUserMenu />
      </div>
    </header>
  )
}
