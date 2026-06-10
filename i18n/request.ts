import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"

import { defaultLocale, loadMessages, localeCookieName, locales } from "@/lib/i18n"

export default getRequestConfig(async ({ requestLocale }) => {
  const cookieStore = await cookies()
  const storedLocale = cookieStore.get(localeCookieName)?.value
  const requestedLocale = await requestLocale

  const locale =
    (storedLocale && locales.includes(storedLocale) ? storedLocale : null) ??
    (requestedLocale && locales.includes(requestedLocale)
      ? requestedLocale
      : null) ??
    defaultLocale

  return {
    locale,
    messages: await loadMessages(locale),
  }
})
