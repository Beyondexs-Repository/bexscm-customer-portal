"use client"

import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { ChevronDownIcon, LanguagesIcon, CheckIcon } from "lucide-react"

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
import { localeCookieName, locales } from "@/lib/i18n"

const localeLabels = {
  en: "English",
  es: "Spanish",
}

export function LocaleSwitcher() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("sidebar")

  function handleChange(nextLocale) {
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&_svg]:size-4 [&_svg]:shrink-0"
              aria-label={t("translate")}
            >
              <LanguagesIcon />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                {t("translate")}
              </span>
              <span className="ml-auto truncate group-data-[collapsible=icon]:hidden">
                {localeLabels[locale] ?? "English"}
              </span>
              <ChevronDownIcon className="ml-1 group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {locales.map((item) => (
              <DropdownMenuItem
                key={item}
                onSelect={() => handleChange(item)}
                className="justify-between"
              >
                <span>{localeLabels[item]}</span>
                {locale === item ? <CheckIcon className="size-4" /> : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
