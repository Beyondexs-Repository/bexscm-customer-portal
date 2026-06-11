export const locales = ["en", "es", "ta"]
export const defaultLocale = "en"
export const localeCookieName = "aloha-locale"

export async function loadMessages(locale) {
  const safeLocale = locales.includes(locale) ? locale : defaultLocale
  const messages = await import(`../languages/${safeLocale}.json`)
  return messages.default
}
