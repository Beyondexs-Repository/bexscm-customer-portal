export const locales = ["en", "es", "ta"]
export const defaultLocale = "en"
export const localeCookieName = "aloha-locale"
export const localeStorageKey = "crate.locale"
// export const localeLabels = {
//   en: "English",
//   es: "Español",
//   ta: "தமிழ்",
// };

export const localeLabels = {
	en: "English",
	es: "Spanish",
	ta: "Tamil",
};

export async function loadMessages(locale) {
  const safeLocale = locales.includes(locale) ? locale : defaultLocale
  const messages = await import(`../languages/${safeLocale}.json`)
  return messages.default
}
