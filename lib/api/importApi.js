import { buildApiUrl, getAuthorizationToken } from "./apiClient"

export function getImportApiUrl() {
  return buildApiUrl("/import")
}

/**
 * Posts a file attachment to the Crate Import API endpoint:
 * POST buildApiUrl("/import")
 * Content-Type: multipart/form-data
 *
 * Form Data parameters:
 * - CustNmbr: "400001"
 * - File: <binary file object>
 *
 * @param {Object} options
 * @param {File|Blob} options.file - File attached by user in chatbot
 * @param {string} [options.custnmbr="400001"] - Static customer number string ("400001")
 * @returns {Promise<{success: boolean, message?: string, reply?: string, added?: Array, skipped?: Array}>}
 */
export async function postImportApi({
  file,
  custnmbr = "400001",
}) {
  if (!file) {
    throw new Error("No file provided for import.")
  }

  const formData = new FormData()
  formData.append("CustNmbr", String(custnmbr || "400001").trim())
  formData.append("File", file, file.name || "attachment")

  const url = getImportApiUrl()

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: getAuthorizationToken(),
    },
    body: formData,
  })

  if (!response.ok) {
    let errorMessage = `Import API error (HTTP ${response.status})`
    try {
      const errData = await response.json()
      errorMessage = errData?.message || errData?.reply || errData?.Message || errData?.error || errorMessage
    } catch {
      // ignore
    }
    throw new Error(errorMessage)
  }

  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return response.json()
  }

  const text = await response.text()
  try {
    return text ? JSON.parse(text) : { success: true, message: "File imported successfully." }
  } catch {
    return { success: true, message: text || "File imported successfully." }
  }
}
