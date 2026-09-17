"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

const themes = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const currentTheme = mounted ? (theme ?? "system") : "system"
  const current = themes.find((item) => item.value === currentTheme) ?? themes[2]
  const CurrentIcon = current.icon

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&_svg]:size-4 [&_svg]:shrink-0"
              aria-label="Theme"
            >
              <CurrentIcon />
              <span className="truncate group-data-[collapsible=icon]:hidden">Theme</span>
              <span className="ml-auto truncate group-data-[collapsible=icon]:hidden">
                {current.label}
              </span>
              <ChevronDownIcon className="ml-1 group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {themes.map((item) => {
              const Icon = item.icon

              return (
                <DropdownMenuItem
                  key={item.value}
                  onSelect={() => setTheme(item.value)}
                  className="justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="size-4" />
                    {item.label}
                  </span>
                  {currentTheme === item.value ? <CheckIcon className="size-4" /> : null}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
