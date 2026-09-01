import staticItems from "@/data/livedata/Items.json"
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

/**
 * Fetch items list from GET /items
 * Uses common base API URL configured in apiClient.js
 * Falls back to static Items.json if API call fails
 */
export async function fetchItemsApi() {
  try {
    const items = await apiFetch("/items", { method: "GET" })
    if (!Array.isArray(items)) {
      throw new Error("Items API response is not an array")
    }
    return items
  } catch (error) {
    console.warn("Using fallback static items data due to API error:", error.message)
    return staticItems
  }
}
