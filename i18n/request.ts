import { getRequestConfig } from "next-intl/server"

import { defaultLocale, loadMessages, locales } from "@/lib/i18n"

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale

  const locale =
    (requestedLocale && locales.includes(requestedLocale)
      ? requestedLocale
      : null) ??
    defaultLocale

  return {
    locale,
    messages: await loadMessages(locale),
  }
})
