"use client"

import * as React from "react"
import {
  IconFileDescription,
  IconInnerShadowTop,
  IconCalendarEvent,
  IconLayoutGrid,
  IconRefresh,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import {
  resetAlertsReadState,
  MY_DAY_DEMO_PENDING_UNREAD,
  resetPendingConsultsToUnreadCount,
} from "@/services"
import { NavUser } from "@/components/nav-user"
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
      title: "My Day",
      url: "/my-day",
      icon: IconCalendarEvent,
    },
    {
      title: "Case files",
      url: "/case-files",
      icon: IconFileDescription,
    },
    {
      title: "Cards",
      url: "/cards",
      icon: IconLayoutGrid,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const handleResetNotifications = () => {
    resetAlertsReadState()
    resetPendingConsultsToUnreadCount(MY_DAY_DEMO_PENDING_UNREAD)
  }

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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              variant="outline"
              tooltip="Reset My Day notifications"
              aria-label="Reset My Day demo: mark all alerts unread and leave two pending consults unread"
              onClick={handleResetNotifications}
            >
              <IconRefresh />
              <span className="truncate group-data-[collapsible=icon]:hidden">Reset</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
