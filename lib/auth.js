export const sessionStorageKey = "crate.session"

export function hasSession() {
  if (typeof window === "undefined") return false

  return window.localStorage.getItem(sessionStorageKey) === "demo"
}

export function saveSession() {
  window.localStorage.setItem(sessionStorageKey, "demo")
}

export function clearSession() {
  window.localStorage.removeItem(sessionStorageKey)
}
