import { getCustomerNumber } from "@/lib/customer"
import { apiFetch, buildApiUrl } from "./apiClient";



export const ORDER_GUIDE_LIST_URL = buildApiUrl(
  "/orderguides/customer",
);

/**
 * Fetch Order Guides by Customer Number
 *
 * @param {string} custnmbr - Customer number
 * @returns {Promise<Array>} Order guide list
 */
export async function fetchOrderGuideListApi(custnmbr = getCustomerNumber()) {
  const resolvedCust = String(custnmbr || getCustomerNumber()).trim();

  if (!resolvedCust) {
    throw new Error("Customer number is required");
  }

  const endpoint = `/orderguides/customer/${encodeURIComponent(resolvedCust)}`;

  console.log("Fetching Order Guides:", endpoint);

  const response = await apiFetch(endpoint, {
    method: "GET",
  });

  console.log("Order Guide List API Response:", response);

  // API returns:
  // {
  //   status: "Y",
  //   success: true,
  //   data: [...]
  // }

  if (!response?.success) {
    throw new Error(response?.message || "Failed to fetch order guides");
  }

  const list = Array.isArray(response?.data) ? response.data : [];

  return list;
}
