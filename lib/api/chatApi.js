import { DEFAULT_AUTHORIZATION_TOKEN } from "./apiClient"

export const CHAT_API_URL = "https://crateapi.bexlgems.com/api/Chat"

export const STATIC_CUSTOMER_NUMBER = "400001"
export const STATIC_CUSTOMER_EMAIL = "yogeshbose2016@gmail.com"

/**
 * Sends a user query to the Crate AI Chat API.
 * Always sends static customerNumber ("400001") and email ("yogeshbose2016@gmail.com").
 * Order numbers are evaluated strictly after the user enters an order number in text form.
 *
 * @param {Object} options
 * @param {string} options.message - The text message sent by the user.
 * @param {string|number} [options.customerNumber="400001"] - Static customer number string ("400001").
 * @param {string} [options.email="yogeshbose2016@gmail.com"] - Static customer email ("yogeshbose2016@gmail.com").
 * @param {Array<{role: string, content: string}>} [options.history=[]] - Conversation history.
 * @returns {Promise<{reply: string, functionsUsed?: string[]}>}
 */
export async function sendChatMessage({
  message = "",
  customerNumber = STATIC_CUSTOMER_NUMBER,
  email = STATIC_CUSTOMER_EMAIL,
  history = [],
}) {
  const userText = String(message ?? "").trim()

  // Format standalone numeric input as explicit order number query
  let formattedMessage = userText
  if (/^\d{5,7}$/.test(userText)) {
    formattedMessage = `Check status for order ${userText}`
  }

  const payload = {
    message: formattedMessage,
    customerNumber: STATIC_CUSTOMER_NUMBER, // ALWAYS STATIC STRING "400001"
    email: STATIC_CUSTOMER_EMAIL, // ALWAYS STATIC STRING "yogeshbose2016@gmail.com"
    history: Array.isArray(history)
      ? history.map((item) => ({
          role: String(item?.role || "user").trim(),
          content: String(item?.content || "").trim(),
        }))
      : [],
  }

  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: DEFAULT_AUTHORIZATION_TOKEN,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let errorMessage = `Chat API request failed (HTTP ${response.status})`
    try {
      const errData = await response.json()
      if (errData?.errors && typeof errData.errors === "object") {
        const firstKey = Object.keys(errData.errors)[0]
        if (firstKey && Array.isArray(errData.errors[firstKey])) {
          errorMessage = errData.errors[firstKey][0]
        }
      } else {
        errorMessage = errData?.reply || errData?.message || errData?.error || errorMessage
      }
    } catch {
      // Use fallback error message
    }
    throw new Error(errorMessage)
  }

  return response.json()
}
