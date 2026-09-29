import { COMMON_BASE_API_URL } from "./apiClient"

/**
 * Config API Service module
 * Fetches dynamic runtime configuration from config.json or API endpoints
 */

const DEFAULT_CONFIG_URL = process.env.NEXT_PUBLIC_CONFIG_URL || "/config.json"
const DEFAULT_GLOBAL_URL = COMMON_BASE_API_URL

/**
 * Fetch application runtime configuration from public/config.json
 * @returns {Promise<Object>} Configuration object
 */
export async function fetchAppConfig() {
  const defaultFallback = {
    appName: process.env.NEXT_PUBLIC_APP_NAME || "Bex SCM",
    globalUrl: DEFAULT_GLOBAL_URL,
    endpoints: {
      auth: "/auth",
      catalog: "/products",
      orders: "/orders",
    },
    features: {
      enableQuickOrders: true,
    },
  }

  // During SSR build phase (no browser window), return environment config directly
  if (typeof window === "undefined" && !DEFAULT_CONFIG_URL.startsWith("http")) {
    return defaultFallback
  }

  try {
    const configUrl = process.env.NEXT_PUBLIC_CONFIG_URL || DEFAULT_CONFIG_URL
    const response = await fetch(configUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      ...data,
      globalUrl: data.globalUrl || DEFAULT_GLOBAL_URL,
    }
  } catch (error) {
    return {
      ...defaultFallback,
      isFallback: true,
      error: error.message,
    }
  }
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
