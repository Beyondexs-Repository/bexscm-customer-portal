import { getCustomerNumber } from "./customer"

export const sessionStorageKey = "crate.session"
const loginNumberStorageKey = "crate.login-number"

export function getLoginNumber() {
  if (typeof window === "undefined" || !hasSession()) return ""
  return window.localStorage.getItem(loginNumberStorageKey) ?? ""
}

export function subscribeToSession(callback) {
  window.addEventListener("storage", callback)
  window.addEventListener("crate-session-change", callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener("crate-session-change", callback)
  }
}

export function hasSession() {
  if (typeof window === "undefined") return false

  return window.localStorage.getItem(sessionStorageKey) === "demo" && Boolean(getCustomerNumber())
}

export function saveSession(phone = "") {
  window.localStorage.setItem(sessionStorageKey, "demo")
  window.localStorage.setItem(loginNumberStorageKey, String(phone).replace(/\D/g, ""))
  window.dispatchEvent(new Event("crate-session-change"))
}

export function clearSession() {
  window.localStorage.removeItem(sessionStorageKey)
  window.localStorage.removeItem(loginNumberStorageKey)
  window.localStorage.removeItem("custnmbr")
  window.localStorage.removeItem("loggedInUser")
  window.localStorage.removeItem("roles")
  window.dispatchEvent(new Event("crate-session-change"))
}
