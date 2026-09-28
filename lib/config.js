/**
 * Global Configuration Handler
 * Single Source of Truth Loader for public/config.json
 */

let currentConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "https://crateapi.bexlgems.com/api/",
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://crateapi.bexlgems.com/",
  // CART_API_URL: process.env.NEXT_PUBLIC_CART_API_URL || "https://crateapi.bexlgems.com/api/cart",
  COMMON_IMAGE_BASE_URL: "https://crateapi.bexlgems.com/Images/Items/",
  API_AUTHORIZATION: process.env.NEXT_PUBLIC_API_AUTHORIZATION || "EDBh8df8gF4GyvPiIysdrEKBbP6pA4Qxswkbd4tv8Q",
  DEFAULT_CUSTNMBR: "400001",
  DEFAULT_EMAIL: "yogeshbose2016@gmail.com",
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

export async function loadConfig() {
  if (typeof window === "undefined") {
    return currentConfig
  }

  try {
    const response = await fetch(`/config.json?v=${Date.now()}`, {
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
    console.warn("Failed to load /config.json, using fallback configuration:", error.message)
  }

  return currentConfig
}

export async function fetchConfig() {
  return loadConfig()
}
