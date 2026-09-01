/**
 * Global Configuration Handler
 * Loads runtime API_URL and BASE_URL from public/config.json
 */

let currentConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "https://crateapi.bexlgems.com/api/",
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://crateapi.bexlgems.com/",
  CART_API_URL: process.env.NEXT_PUBLIC_CART_API_URL || "https://crateapi.bexlgems.com/api/cart",
}

export function setConfig(config) {
  currentConfig = {
    ...currentConfig,
    ...config,
  }
}

export function getConfig() {
  return currentConfig
}

export async function fetchConfig() {
  if (typeof window === "undefined") {
    return currentConfig
  }

  try {
    const response = await fetch("/config.json", {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      setConfig(data)
      return data
    }
  } catch (error) {
    console.warn("Failed to load /config.json, using default config:", error.message)
  }

  return currentConfig
}
