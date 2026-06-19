import { canRoleUsePageAction } from "@/config/role-pages"

export const ROLE_COOKIE_NAME = "aloha-login-role"

export const ROLES = {
  STORE_MANAGER: "store-manager",
  STORE_EMPLOYEE: "store-employee",
}

export const PAGE_ACTIONS = {
  ADD_PRODUCT_TO_ORDER_GUIDE: "addProductToOrderGuide",
  ADD_TO_CART: "addToCart",
  ADD_TO_ORDER_GUIDE: "addToOrderGuide",
  CLEAR_CHAT: "clearChat",
  CREATE_EMPLOYEE: "createEmployee",
  CREATE_ORDER_GUIDE: "createOrderGuide",
  CREATE_USER: "createUser",
  DELETE_EMPLOYEE: "deleteEmployee",
  DELETE_ORDER_GUIDE: "deleteOrderGuide",
  DELETE_USER: "deleteUser",
  DOWNLOAD_INVOICE: "downloadInvoice",
  EDIT_EMPLOYEE: "editEmployee",
  EDIT_ORDER_GUIDE: "editOrderGuide",
  EDIT_USER: "editUser",
  PLACE_ORDER: "placeOrder",
  REORDER: "reorder",
  SEARCH_MESSAGES: "searchMessages",
  VIEW_ORDER_DETAILS: "viewOrderDetails",
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
