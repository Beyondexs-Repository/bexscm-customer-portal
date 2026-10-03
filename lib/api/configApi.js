import { COMMON_BASE_API_URL } from "./apiClient"
import { getConfig } from "@/lib/config"

const DEFAULT_GLOBAL_URL = COMMON_BASE_API_URL

export async function fetchAppConfig() {
  const config = getConfig()
  return { ...config, globalUrl: config.API_URL }
}

/**
 * Helper to make API calls using the active global URL
 * @param {string} endpoint - API endpoint path (e.g. "/products")
 * @param {string} baseUrl - Current active global URL
 * @param {RequestInit} options - fetch options
 */
export async function callGlobalApi(endpoint, baseUrl = DEFAULT_GLOBAL_URL, options = {}) {
  const cleanBase = baseUrl.replace(/\/$/, "")
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const fullUrl = `${cleanBase}${cleanEndpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Request to ${fullUrl} failed with status ${response.status}`)
  }

  return response.json()
}
