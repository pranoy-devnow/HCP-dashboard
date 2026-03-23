"use client"

import { useRouter } from "next/navigation"
import { LogOut, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { clearSession } from "@/services/authService"
import { useSessionUser } from "@/hooks/use-session-user"
import { DEFAULT_PROFILE_PHOTO_URL } from "@/lib/profile-avatar"
import { cn } from "@/lib/utils"

function initialsFromUser(name: string, email: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  if (name.length >= 2) return name.slice(0, 2).toUpperCase()
  return (email[0] ?? "?").toUpperCase()
}

/**
 * Account trigger: circular photo, calm hover “lift” inspired by macOS Control Center /
 * dock-style emphasis (scale + ring + shadow, reduced motion respected).
 */
export function SiteHeaderUserMenu() {
  const router = useRouter()
  const sessionUser = useSessionUser()

  const displayName = sessionUser?.name ?? "Guest"
  const displayEmail = sessionUser?.email ?? "Not signed in"
  const initials = sessionUser ? initialsFromUser(sessionUser.name, sessionUser.email) : "?"

  const photoSrc = sessionUser?.avatar?.trim() || DEFAULT_PROFILE_PHOTO_URL

  const handleLogout = () => {
    clearSession()
    router.push("/")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label="Open account menu"
          className={cn(
            "relative h-auto w-auto shrink-0 overflow-visible rounded-full p-0",
            "transition-transform duration-300 ease-out",
            "motion-safe:hover:z-10 motion-safe:hover:scale-[1.08]",
            "motion-safe:active:scale-[0.97]",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "motion-safe:hover:[&>span]:shadow-md motion-safe:hover:[&>span]:ring-primary/40",
            "data-[state=open]:[&>span]:shadow-md data-[state=open]:[&>span]:ring-primary/45"
          )}
        >
          <span
            className={cn(
              "inline-flex rounded-full",
              "ring-2 ring-border/95 dark:ring-border",
              "ring-offset-2 ring-offset-background",
              "shadow-sm",
              "transition-[box-shadow,ring-color] duration-300 ease-out"
            )}
          >
            <Avatar className="size-9 rounded-full">
              <AvatarImage
                src={photoSrc}
                alt={`${displayName} profile photo`}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-semibold tracking-tight">
                {initials}
              </AvatarFallback>
            </Avatar>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-1">
            <span
              className={cn(
                "inline-flex rounded-full",
                "ring-2 ring-border/95 dark:ring-border",
                "ring-offset-2 ring-offset-popover",
                "shadow-sm"
              )}
            >
              <Avatar className="size-10 rounded-full">
                <AvatarImage
                  src={photoSrc}
                  alt={`${displayName} profile photo`}
                  className="object-cover"
                />
                <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
              </Avatar>
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">{displayEmail}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push("/settings")}>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
