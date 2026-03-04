"use client"

import * as React from "react"
import {
  IconBell,
  IconBook2,
  IconFileDescription,
  IconFiles,
  IconInnerShadowTop,
  IconUserCircle,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { getSession } from "@/services/authService"
import { useUnreadNotificationCount } from "@/lib/notifications-data"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navMain = [
    {
      title: "Notifications",
      url: "/notifications",
      icon: IconBell,
    },
    {
      title: "Case files",
      url: "/case-files",
      icon: IconFileDescription,
    },
    {
      title: "Learning",
      url: "/learning",
      icon: IconBook2,
    },
    {
      title: "Documents",
      url: "/documents",
      icon: IconFiles,
    },
    {
      title: "Mock profile",
      url: "/case-files/mock",
      icon: IconUserCircle,
    },
  ]
  const unreadCount = useUnreadNotificationCount()
  const badgeCounts = { Notifications: unreadCount }
  const sessionUser = React.useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {}
      const onStorage = () => cb()
      window.addEventListener("storage", onStorage)
      window.addEventListener("hcp-session-change", onStorage)
      return () => {
        window.removeEventListener("storage", onStorage)
        window.removeEventListener("hcp-session-change", onStorage)
      }
    },
    () => getSession(),
    () => null
  )

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Medela</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} badgeCounts={badgeCounts} />
      </SidebarContent>
      {sessionUser && (
        <SidebarFooter>
          <NavUser user={sessionUser} />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
