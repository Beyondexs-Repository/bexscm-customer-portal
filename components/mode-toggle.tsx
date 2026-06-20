"use client"

import { useEffect, useState } from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themeLabels = {
  light: "Light",
  dark: "Dark",
  system: "System",
}

const themeIcons = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
}

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const t = useTranslations("sidebar")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const CurrentIcon = themeIcons[theme] ?? MonitorIcon

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&_svg]:size-4 [&_svg]:shrink-0"
              aria-label={t("darkMode")}
            >
              <CurrentIcon />

              <span className="truncate group-data-[collapsible=icon]:hidden">
                {t("darkMode")}
              </span>

              <span className="ml-auto truncate group-data-[collapsible=icon]:hidden">
                {themeLabels[theme] ?? "System"}
              </span>

              <ChevronDownIcon className="ml-1 group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-36">
            {Object.entries(themeLabels).map(([value, label]) => {
              const Icon = themeIcons[value]

              return (
                <DropdownMenuItem
                  key={value}
                  onSelect={() => setTheme(value)}
                  className="justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </div>

                  {theme === value ? (
                    <CheckIcon className="size-4" />
                  ) : null}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}