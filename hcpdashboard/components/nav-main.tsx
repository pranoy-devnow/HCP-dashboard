"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  badgeCounts,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    /** Optional custom tooltip (string or TooltipContent props). Defaults to title. */
    tooltip?: string | { children: React.ReactNode }
    /** Optional visible label below the link when sidebar is expanded (e.g. legend). */
    sublabel?: React.ReactNode
  }[]
  /** Optional badge counts by item title, e.g. { Notifications: 5 } for unread count */
  badgeCounts?: Record<string, number>
}) {
  const pathname = usePathname()
  const { setOpen, state } = useSidebar()

  const handleNavClick = () => {
    setOpen(false)
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const count = badgeCounts?.[item.title] ?? 0
            return (
              <SidebarMenuItem key={item.title} className="relative">
                <SidebarMenuButton asChild tooltip={item.tooltip ?? item.title} isActive={pathname === item.url}>
                  <Link href={item.url} onClick={handleNavClick} className="flex items-center gap-2">
                    {item.icon && <item.icon />}
                    <span className="flex-1 truncate">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.sublabel != null && state === "expanded" && (
                  <div className="px-2 pb-1.5 pt-0.5 text-[11px] text-muted-foreground leading-tight">
                    {item.sublabel}
                  </div>
                )}
                {count > 0 && (
                  <span
                    className="pointer-events-none absolute right-1 top-1/2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold tabular-nums text-white shadow-sm ring-2 ring-background group-data-[collapsible=icon]:right-0.5 group-data-[collapsible=icon]:top-0.5 group-data-[collapsible=icon]:translate-y-0 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:min-w-4 group-data-[collapsible=icon]:text-[9px]"
                    aria-label={`${count} unread notifications`}
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
