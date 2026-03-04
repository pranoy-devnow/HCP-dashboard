"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconLogin, IconLogout } from "@tabler/icons-react"
import { DEFAULT_USER_IMAGE } from "@/lib/constants"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getSession, clearSession } from "@/services/authService"
import { cn } from "@/lib/utils"

function initials(name: string, email: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase().slice(0, 2)
  }
  if (name.length >= 2) return name.slice(0, 2).toUpperCase()
  const local = email.split("@")[0] ?? ""
  return local.slice(0, 2).toUpperCase() || "?"
}

function useSessionUser() {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {}
      const onUpdate = () => cb()
      window.addEventListener("storage", onUpdate)
      window.addEventListener("hcp-session-change", onUpdate)
      return () => {
        window.removeEventListener("storage", onUpdate)
        window.removeEventListener("hcp-session-change", onUpdate)
      }
    },
    () => getSession(),
    () => null
  )
}

/**
 * Header profile: always shows a round button (avatar when signed in, user icon when not).
 * Click opens a dropdown: when signed in, profile + Log out; when not, Sign in.
 */
export function HeaderProfile({ className }: { className?: string }) {
  const router = useRouter()
  const user = useSessionUser()
  const initial = user ? initials(user.name, user.email) : ""

  const handleLogout = () => {
    clearSession()
    router.push("/login")
  }

  const triggerClass = cn(
    "flex size-10 shrink-0 items-center justify-center rounded-full outline-none ring-sidebar-ring transition-[box-shadow,opacity] focus-visible:ring-2 hover:opacity-90 active:opacity-80",
    "border-2 border-background shadow-sm ring-1 ring-border",
    !user && "bg-muted text-muted-foreground",
    className
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={triggerClass}
          aria-label={user ? "Open account menu" : "Sign in or open account menu"}
        >
          {user ? (
            <Avatar className="size-8 rounded-full border-0 shadow-none ring-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-full text-xs font-medium bg-primary/10 text-primary">
                {initial}
              </AvatarFallback>
            </Avatar>
          ) : (
            <img
              src={DEFAULT_USER_IMAGE}
              alt=""
              className="size-8 rounded-full object-cover"
              width={32}
              height={32}
            />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-56">
        {user ? (
          <>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2.5">
                <Avatar className="size-9 shrink-0 border border-border">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-sm font-medium bg-muted text-muted-foreground">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 min-w-0 text-left">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Signed in</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout className="size-4" />
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="py-2 text-muted-foreground font-normal">
              Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center gap-2 cursor-pointer">
                <IconLogin className="size-4" />
                Sign in
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
