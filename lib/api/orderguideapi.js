import { getCustomerNumber } from "@/lib/customer"
import { apiFetch, buildApiUrl } from "./apiClient";



export const ORDER_GUIDES_URL = buildApiUrl("/orderguides");

/**
 * Creates a new Order Guide
 *
 * POST /orderguides
 *
 * Endpoint:
 * /orderguides
 *
 * Request:
 * {
 *   "name": "Beef",
 *   "custnmbr": "400001",
 *   "createdBY": 1
 * }
 *
 * @param {Object} params
 * @param {string} params.name - Order Guide name
 * @param {string} params.custnmbr - Customer number
 * @param {number|string} params.createdBY - Logged-in user ID
 *
 * @returns {Promise<Object>} API response
 */
export async function createOrderGuideApi({
  name,
  custnmbr = getCustomerNumber(),
  createdBY,
} = {}) {
  // Validate Order Guide name
  const resolvedName = String(name || "").trim();

  if (!resolvedName) {
    throw new Error("Order Guide name is required");
  }

  // Validate customer number
  const resolvedCust = String(custnmbr || getCustomerNumber()).trim();

  if (!resolvedCust) {
    throw new Error("Customer number is required");
  }

  // Convert logged-in user ID to number
  const resolvedCreatedBy = Number(createdBY);

  if (!createdBY || Number.isNaN(resolvedCreatedBy)) {
    throw new Error("Created By User ID is required");
  }

  // Request body
  const requestBody = {
    name: resolvedName,
    custnmbr: resolvedCust,
    createdBY: resolvedCreatedBy,
  };

  console.log("Create Order Guide Request:", requestBody);

  // POST API call
  const data = await apiFetch("/orderguides", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  console.log("Create Order Guide Response:", data);

  return data;
}
