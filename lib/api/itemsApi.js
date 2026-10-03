import { requireCustomerNumber } from "@/lib/customer"
import { apiFetch, COMMON_IMAGE_BASE_URL } from "./apiClient"

export const ITEM_IMAGE_BASE_URL = COMMON_IMAGE_BASE_URL

/**
 * Resolves item image URL.
 * If imageVal is a filename or ID (e.g. "500113.png" or "500113"), concatenates to https://crateapi.bexlgems.com/Images/Items/
 * If imageVal is null or empty, returns null.
 *
 * @param {string|null|undefined} imageVal
 * @returns {string|null}
 */
export function resolveItemImageUrl(imageVal) {
  if (!imageVal) return null
  let str = String(imageVal).trim()
  if (!str || str.toLowerCase() === "null" || str.toLowerCase() === "undefined") return null
  if (/^(https?:\/\/|data:|\/)/i.test(str)) {
    return str
  }
  if (!/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(str)) {
    str = `${str}.png`
  }
  const cleanPath = str.replace(/^\/+/, "")
  return `${ITEM_IMAGE_BASE_URL}${cleanPath}`
}

/** Fetch only live catalog data. API errors are returned to the caller. */
export async function fetchItemsApi() {
  const customer = requireCustomerNumber()
  const result = await apiFetch("/items?custNmbr=" + encodeURIComponent(customer), { method: "GET" })
  if (result?.success === false) throw new Error(result.Msg || result.message || "Failed to fetch items.")
  const list = Array.isArray(result) ? result : result?.data
  if (!Array.isArray(list)) throw new Error("Items API response is not an array")
  return list.map(entry => ({ ...(entry.item ?? entry), inOrderGuide: entry.inOrderGuide ?? false }))
}
