import { apiFetch } from "./apiClient"

/**
 * Sends a POST request to authenticate / request login:
 * POST /auth/login
 * Uses common base API URL and Authorization header configured in apiClient.js
 * 
 * Payload:
 * {
 *   "countryCode": "+91",
 *   "mobileNumber": "8610171847"
 * }
 * 
 * @param {Object} params
 * @param {string} params.countryCode - Calling code (e.g. "+91")
 * @param {string} params.mobileNumber - Digits (e.g. "8610171847")
 * @returns {Promise<Object>} API Response containing user profile or authentication details
 */
export async function loginAuthApi({ countryCode, mobileNumber } = {}) {
  const codeStr = String(countryCode || "+91").trim()
  const cleanCountryCode = codeStr.startsWith("+") ? codeStr : `+${codeStr}`
  const cleanMobileNumber = String(mobileNumber || "").replace(/\D/g, "").trim()

  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      countryCode: cleanCountryCode,
      mobileNumber: cleanMobileNumber,
    }),
  })
}
