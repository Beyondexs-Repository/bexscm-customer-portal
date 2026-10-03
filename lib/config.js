/** API settings are supplied by the deployment environment. */
const apiUrl = (process.env.NEXT_PUBLIC_NRL_API_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "")
const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "")
let currentConfig = {
  API_URL: apiUrl,
  BASE_URL: baseUrl,
  COMMON_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_COMMON_IMAGE_BASE_URL || (baseUrl ? baseUrl + "/Images/Items/" : ""),
  API_AUTHORIZATION: process.env.NEXT_PUBLIC_AUTH_TOKEN || process.env.NEXT_PUBLIC_API_AUTHORIZATION || "",
}
export function setConfig(config) { currentConfig = { ...currentConfig, ...config } }
export function getConfig() { return currentConfig }
export async function loadConfig() { return currentConfig }
export async function fetchConfig() { return loadConfig() }
