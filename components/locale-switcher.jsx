"use client"

import { useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { LanguagesIcon } from "lucide-react"

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { localeStorageKey, localeLabels, locales } from "@/lib/i18n"
export function LocaleSwitcher() {
    const t = useTranslations("auth")
  const activeLocale = useLocale()
  const [selectedLocale, setSelectedLocale] = useState(activeLocale)

  useEffect(() => {
    // Pick up the saved choice on mount
    const saved = window.localStorage.getItem(localeStorageKey)
    if (saved && locales.includes(saved)) setSelectedLocale(saved)

    // Update live when the login page (or anything else) changes language
    function handleLocaleChange(event) {
      if (event.detail) setSelectedLocale(event.detail)
    }

    // Keep other tabs in sync too
    function handleStorage(event) {
      if (event.key === localeStorageKey && event.newValue) {
        setSelectedLocale(event.newValue)
      }
    }

    window.addEventListener("crate-locale-change", handleLocaleChange)
    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("crate-locale-change", handleLocaleChange)
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  // Keep in sync if the provider's locale itself changes
  useEffect(() => {
    setSelectedLocale(activeLocale)
  }, [activeLocale])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!">
          <LanguagesIcon className="size-4 shrink-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden"> {t("language")}</span>
          {/* <span className="truncate group-data-[collapsible=icon]:hidden">Language</span> */}
          <span className="ml-auto truncate text-muted-foreground group-data-[collapsible=icon]:hidden">{localeLabels[selectedLocale] ?? localeLabels.en}</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
