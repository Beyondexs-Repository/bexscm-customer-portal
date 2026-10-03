import { getCustomerNumber } from "@/lib/customer"
import { buildApiUrl, getAuthHeaders } from "./apiClient"

export function getMessagesApiUrl() {
  return buildApiUrl("/messages")
}

/**
 * Calls the Crate Messages API endpoint (buildApiUrl("/messages")).
 * Used for order creation messages and text-based item list extraction.
 *
 * @param {Object} options
 * @param {string} options.message - The text message sent by user (e.g. "Please prepare the following order...")
 * @param {string} [options.custnmbr="400001"] - Static customer number ("400001")
 * @returns {Promise<{success: boolean, isOrderRequest?: boolean, reply?: string, added?: Array, skipped?: Array}>}
 */
export async function postMessageApi({
  message = "",
  custnmbr = getCustomerNumber(),
}) {
  const payload = {
    custnmbr: String(custnmbr || getCustomerNumber()).trim(),
    message: String(message || "").trim(),
  }

  const url = getMessagesApiUrl()

  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let errorMessage = `Messages API error (HTTP ${response.status})`
    try {
      const errData = await response.json()
      errorMessage = errData?.reply || errData?.message || errData?.Message || errData?.error || errorMessage
    } catch {
      // ignore
    }
    throw new Error(errorMessage)
  }

  return response.json()
}

/**
 * Determines whether a given text message is an order placement / preparation request.
 *
 * @param {string} text
 * @returns {boolean}
 */
export function isOrderPlacementText(text = "") {
  if (!text) return false
  const t = String(text).toLowerCase().trim()

  const keywords = [
    "place order",
    "place an order",
    "place item",
    "place items",
    "prepare order",
    "prepare the following order",
    "prepare following order",
    "item place order",
    "order the following",
    "add to cart",
    "add item",
    "add items",
    "add top",
    "add each",
    "add 10",
    "add 5",
    "add 1",
    "add 2",
    "add 3",
    "add 4",
    "add 6",
    "add 7",
    "add 8",
    "add 9",
    "order this",
    "order these",
    "yes order",
    "yes add",
    "please add",
    "add that",
    "order item",
    "order items",
    "add product",
    "add products",
    "yes please add",
    "order these items",
    "add these items",
  ]

  if (keywords.some((k) => t.includes(k))) {
    return true
  }

  // Detect list formatting e.g. "- 27 Pork Tenderloin" or "1. Chicken Wings" or "33 Ground Beef"
  const hasItemLines = /^\s*[-*•]?\s*\d+\s+[a-zA-Z]/m.test(text) || /^\s*\d+[\.\)]\s+[a-zA-Z]/m.test(text)
  return hasItemLines
}

/**
 * Extracts recent item names from prior bot conversation history messages
 *
 * @param {Array} messages
 * @returns {Array<string>} List of item names extracted
 */
export function extractRecentItemNames(messages = []) {
  if (!Array.isArray(messages)) return []
  const botMsgs = [...messages].reverse().filter((m) => m && m.sender === "bot")

  for (const msg of botMsgs) {
    const text = msg.text || ""
    const items = []

    // Pattern 1: Numbered or dashed lists e.g. "1. Chicken Wings Jumbo - 500007"
    const numberedMatches = text.matchAll(/\d+[\.\)]\s*([^0-9\n–-]+)/g)
    for (const m of numberedMatches) {
      const name = m[1].trim()
      if (name && name.length > 2 && !/^(here|available|items|product|would|let|your|the|order)/i.test(name)) {
        if (!items.includes(name)) items.push(name)
      }
    }
    if (items.length > 0) return items

    // Pattern 2: Bulleted or dashed lines e.g. "- Chicken Wings Jumbo - 1/10# USA"
    const lines = text.split("\n")
    for (const line of lines) {
      const lineMatch = line.match(/^\s*(?:\d+[\.\)]|[-*•])\s*([^0-9–-]+)/)
      if (lineMatch && lineMatch[1]) {
        const name = lineMatch[1].trim()
        if (name && name.length > 2 && !/^(here|available|items|product|would|let|your|the|order)/i.test(name)) {
          if (!items.includes(name)) items.push(name)
        }
      }
    }
    if (items.length > 0) return items
  }

  return []
}
