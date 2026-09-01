import { getConfig } from "@/lib/config"

export const COMMON_BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://crateapi.bexlgems.com/api"
export const COMMON_IMAGE_BASE_URL = "https://crateapi.bexlgems.com/Images/Items/"
export const DEFAULT_AUTHORIZATION_TOKEN =
  process.env.NEXT_PUBLIC_API_AUTHORIZATION || "EDBh8df8gF4GyvPiIysdrEKBbP6pA4Qxswkbd4tv8Q"

/**
 * Returns central Authorization Token from config or fallback
 */
export function getAuthorizationToken() {
  const config = getConfig()
  return config.API_AUTHORIZATION || DEFAULT_AUTHORIZATION_TOKEN
}

/**
 * Common Headers Generator for all project API calls
 *
 * @param {Object} [customHeaders={}]
 * @returns {Object} Headers with Authorization token
 */
export function getAuthHeaders(customHeaders = {}) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: getAuthorizationToken(),
    ...customHeaders,
  }
}

/**
 * Resolves full API URL for any given relative endpoint path.
 * Example: buildApiUrl("/items") -> "https://crateapi.bexlgems.com/api/items"
 * Example: buildApiUrl("/customers/400001/orders") -> "https://crateapi.bexlgems.com/api/customers/400001/orders"
 *
 * @param {string} endpoint - Relative API endpoint path
 * @returns {string} Full API URL
 */
export function buildApiUrl(endpoint = "") {
  const config = getConfig()
  let baseUrl = config.API_URL || COMMON_BASE_API_URL

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1)
  }

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  return `${baseUrl}${path}`
}

/**
 * Common fetch helper for making API requests using the centralized base URL and Authorization token.
 * Automatically formats headers, handles JSON serialization, and processes errors.
 *
 * @param {string} endpoint - Relative endpoint path (e.g. "/items", "/cart")
 * @param {RequestInit} [options={}] - Standard fetch options
 * @returns {Promise<any>} Response object or JSON
 */
export async function apiFetch(endpoint, options = {}) {
  const url = buildApiUrl(endpoint)
  const headers = getAuthHeaders(options.headers || {})

  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `API Request to ${url} failed with status ${response.status}`
    try {
      const contentType = response.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const errorJson = await response.json()
        errorMessage =
          errorJson.error ||
          errorJson.message ||
          errorJson.Message ||
          errorJson.status ||
          errorMessage
      } else {
        const text = await response.text()
        if (text && text.trim() && text.length < 200) {
          errorMessage = text.trim()
        }
      }
    } catch {
      // Fallback to default message
    }
    throw new Error(errorMessage)
  }

  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return response.json()
  }

  const text = await response.text()
  try {
    return text ? JSON.parse(text) : { success: true }
  } catch {
    return { success: true, rawResponse: text }
  }
}
