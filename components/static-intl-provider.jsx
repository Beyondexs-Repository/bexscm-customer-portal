"use client"

import { NextIntlClientProvider } from "next-intl"
import { useEffect, useMemo, useState } from "react"

import enMessages from "@/languages/en.json"
import esMessages from "@/languages/es.json"
import taMessages from "@/languages/ta.json"
import { defaultLocale, localeStorageKey, locales } from "@/lib/i18n"

const messages = {
  en: enMessages,
  es: esMessages,
  ta: taMessages,
}

function getSavedLocale() {
  if (typeof window === "undefined") return defaultLocale

  const savedLocale = window.localStorage.getItem(localeStorageKey)
  return locales.includes(savedLocale) ? savedLocale : defaultLocale
}

export function StaticIntlProvider({ children }) {
  const [locale, setLocale] = useState(() => getSavedLocale())

  useEffect(() => {
    function handleLocaleChange(event) {
      const nextLocale = event.detail

      if (locales.includes(nextLocale)) {
        setLocale(nextLocale)
      }
    }

    window.addEventListener("crate-locale-change", handleLocaleChange)

    return () => {
      window.removeEventListener("crate-locale-change", handleLocaleChange)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(() => messages[locale] ?? messages[defaultLocale], [locale])

  return (
    <NextIntlClientProvider locale={locale} messages={value} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  )
}
