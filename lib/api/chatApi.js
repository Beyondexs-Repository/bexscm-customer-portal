import { getCustomerNumber, requireCustomerNumber } from "@/lib/customer"
import { buildApiUrl, getAuthHeaders } from "./apiClient"


export function getChatApiUrl() {
  return buildApiUrl("/Chat")
}

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
  customerNumber = getCustomerNumber(),
  email = "",
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
    customerNumber: requireCustomerNumber(customerNumber),
    email,
    history: Array.isArray(history)
      ? history.map((item) => ({
          role: String(item?.role || "user").trim(),
          content: String(item?.content || "").trim(),
        }))
      : [],
  }

  const url = getChatApiUrl()

  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
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
