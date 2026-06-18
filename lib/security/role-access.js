import { canRoleUsePageAction } from "@/config/role-pages"

export const ROLE_COOKIE_NAME = "aloha-login-role"

export const ROLES = {
  STORE_MANAGER: "store-manager",
  STORE_EMPLOYEE: "store-employee",
}

export const PAGE_ACTIONS = {
  CLEAR_CHAT: "clearChat",
  DOWNLOAD_INVOICE: "downloadInvoice",
  SEARCH_MESSAGES: "searchMessages",
}

export function decodeRoleCookieValue(value) {
  try {
    return decodeURIComponent(value ?? "")
  } catch {
    return value ?? ""
  }
}

export function getRoleFromCookieString(cookieString) {
  return decodeRoleCookieValue(
    String(cookieString ?? "")
      .split("; ")
      .find((cookie) => cookie.startsWith(`${ROLE_COOKIE_NAME}=`))
      ?.split("=")[1],
  )
}

export function getBrowserRole() {
  if (typeof window === "undefined") return ""

  return getRoleFromCookieString(window.document.cookie)
}

export function canAccessPageAction(role, pathname, action) {
  return canRoleUsePageAction(role, pathname, action)
}
