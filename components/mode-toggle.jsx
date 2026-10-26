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
import { useTranslations } from "next-intl"

const themes = [
  { value: "light", label: "Light", icon: SunIcon, color: "text-amber-600 dark:text-amber-400" },
  { value: "dark", label: "Dark", icon: MoonIcon, color: "text-indigo-600 dark:text-indigo-400" },
  { value: "system", label: "System", icon: MonitorIcon, color: "text-sky-600 dark:text-sky-400" },
]

export function ModeToggle() {
  const t = useTranslations("sidebar")
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
              className="flex h-7 w-full items-center gap-1.5 overflow-hidden rounded-md px-2 py-1 text-xs ring-sidebar-ring outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&_svg]:size-4 [&_svg]:shrink-0"
              aria-label="Theme"
            >
              <CurrentIcon className={current.color} />
              <span className="truncate group-data-[collapsible=icon]:hidden">{t("theme")}</span>
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
                    <Icon className={`size-4 ${item.color}`} />
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
