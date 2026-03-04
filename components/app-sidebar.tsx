"use client"

import * as React from "react"
import {
  IconBell,
  IconBook2,
  IconFileDescription,
  IconFiles,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const unreadCount = useUnreadNotificationCount()
  const badgeCounts = { Notifications: unreadCount }
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
        <NavMain items={data.navMain} badgeCounts={badgeCounts} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
