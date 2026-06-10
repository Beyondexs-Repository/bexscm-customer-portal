"use client"

import { useEffect, useState } from "react"
import { MoonIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

import { Switch } from "@/components/ui/switch"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const t = useTranslations("sidebar")

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&_svg]:size-4 [&_svg]:shrink-0">
          <MoonIcon />
          <span className="truncate">{t("darkMode")}</span>
          <Switch
            aria-label={t("toggleDarkMode")}
            checked={mounted && resolvedTheme === "dark"}
            className="ml-auto group-data-[collapsible=icon]:hidden"
            disabled={!mounted}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
