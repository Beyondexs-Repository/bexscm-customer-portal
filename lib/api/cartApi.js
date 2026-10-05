import { requireCustomerNumber } from "@/lib/customer"
import { apiFetch, buildApiUrl, DEFAULT_AUTHORIZATION_TOKEN } from "./apiClient"


export const DEFAULT_SOURCE = "App/Web"
// export const DEFAULT_HOSTED_CART_API_URL = buildApiUrl("/cart")

/**
 * Sends a POST request to add an item to the Cart API (/cart)
 * Uses common base API URL configured in apiClient.js
 * 
 * Payload structure:
 * {
 *   "CUSTNMBR": "400001",
 *   "ItemNumber": "500001",
 *   "ItemName": "Sirloin Tri Tip - 1/10# (Certified Angus Beef) USA",
 *   "Quantity": 3,
 *   "Source": "App/Web"
 * }
 * 
 * @param {Object} params
 * @returns {Promise<Object>} Server response
 */
export async function postCartApi({
  itemNumber,
  ItemNumber,
  ITEMNMBR,
  itemnmbr,
  sku,
  id,
  itemName,
  ItemName,
  ITEMDESC,
  itemdesc,
  name,
  quantity,
  Quantity,
  custnmbr,
  source = DEFAULT_SOURCE,
} = {}) {
  const resolvedItemNumber = String(
    itemNumber ?? ItemNumber ?? ITEMNMBR ?? itemnmbr ?? sku ?? id ?? ""
  ).trim()

  const resolvedItemName = String(
    itemName ?? ItemName ?? ITEMDESC ?? itemdesc ?? name ?? ""
  ).trim()

  const rawQty = quantity !== undefined ? quantity : (Quantity !== undefined ? Quantity : 1)

  const payload = {
    CUSTNMBR: requireCustomerNumber(custnmbr),
    ItemNumber: resolvedItemNumber,
    ItemName: resolvedItemName,
    Quantity: Number(rawQty),
    Source: source,
  }

  return apiFetch("/cart", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

/**
 * Sends a PUT request to update quantity or delete (qty 0) a cart item:
 * PUT /cart/customer/{custnmbr}/item/{itemNumber}
 * Uses common base API URL configured in apiClient.js
 * 
 * Body structure:
 * {
 *   "quantity": 10
 * }
 * 
 * @param {Object} params
 * @returns {Promise<Object>} Server response
 */
export async function updateCartQuantityApi({
  itemNumber,
  ItemNumber,
  ITEMNMBR,
  itemnmbr,
  sku,
  id,
  quantity,
  Quantity,
  custnmbr,
} = {}) {
  const resolvedCust = requireCustomerNumber(custnmbr)
  const resolvedItemNumber = String(
    itemNumber ?? ItemNumber ?? ITEMNMBR ?? itemnmbr ?? sku ?? id ?? ""
  ).trim()
  const rawQty = quantity !== undefined ? quantity : (Quantity !== undefined ? Quantity : 1)
  const resolvedQuantity = Number(rawQty)

  const endpoint = `/cart/customer/${encodeURIComponent(resolvedCust)}/item/${encodeURIComponent(resolvedItemNumber)}`

  return apiFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify({ quantity: resolvedQuantity }),
  })
}

/**
 * Sends a POST request to place an order for a customer:
 * POST /checkout/{custnmbr}
 * Uses common base API URL configured in apiClient.js
 * 
 * Output:
 * {
 *   "success": true,
 *   "orderNumber": 101842,
 *   "orderAmount": 590.2
 * }
 * 
 * @param {string} [custnmbr="400001"] Customer Number static default "400001"
 * @returns {Promise<Object>} Response with success status, orderNumber, and orderAmount
 */
export async function checkoutOrderApi(custnmbr) {
  const resolvedCust = requireCustomerNumber(custnmbr)
  const endpoint = `/checkout/${encodeURIComponent(resolvedCust)}`

  return apiFetch(endpoint, {
    method: "POST",
  })
}

/**
 * Sends a POST request to import a document file into the cart:
 * POST /cartimport/import-document
 * Content-Type: multipart/form-data
 * 
 * Form Data:
 * - CustNmbr: "400001"
 * - File: <binary file>
 * 
 * @param {Object} params
 * @param {File|Blob} params.file - Uploaded document file
 * @param {string} [params.custnmbr="400001"] - Customer number (default static value "400001")
 * @returns {Promise<Object>} Response object
 */
export async function importDocumentCartApi({ file, custnmbr } = {}) {
  const resolvedCust = requireCustomerNumber(custnmbr)
  const url = buildApiUrl("/cartimport/import-document")

  const formData = new FormData()
  formData.append("CustNmbr", resolvedCust)
  if (file) {
    formData.append("File", file, file.name || "document")
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: DEFAULT_AUTHORIZATION_TOKEN,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Import document request failed with status ${response.status}`)
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

/**
 * Sends a GET request to fetch customer cart items:
 * GET /cart/customer/{custnmbr}
 *
 * @param {string} [custnmbr="400001"] Customer Number static default "400001"
 * @returns {Promise<Array>} Array of cart items from backend
 */
// export async function getCustomerCartApi(custnmbr) {
//   const resolvedCust = requireCustomerNumber(custnmbr)
//   const endpoint = `/cart/customer/${encodeURIComponent(resolvedCust)}`
//   return apiFetch(endpoint, {
//     method: "GET",
//   })
// }
