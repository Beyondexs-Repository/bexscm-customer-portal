import { apiFetch, buildApiUrl } from "./apiClient";

export const ORDER_GUIDE_GROUPS_URL = buildApiUrl("/orderguidegroups");

/**
 * Gets all Order Guide Groups for a particular Order Guide
 *
 * GET /orderguidegroups/orderguide/{orderGuideID}
 *
 * Example:
 * GET /orderguidegroups/orderguide/6
 *
 * @param {number|string} orderGuideID
 * @returns {Promise<Object>} API response
 */
export async function getOrderGuideGroupApi(orderGuideID) {
  // Validate Order Guide ID
  const resolvedOrderGuideID = Number(orderGuideID);

  if (
    orderGuideID === undefined ||
    orderGuideID === null ||
    Number.isNaN(resolvedOrderGuideID)
  ) {
    throw new Error("Order Guide ID is required");
  }

  console.log("Get Groups for Order Guide ID:", resolvedOrderGuideID);

  // GET API call
  const data = await apiFetch(
    `/orderguidegroups/orderguide/${resolvedOrderGuideID}`,
    {
      method: "GET",
    },
  );

  console.log("Get Order Guide Groups Response:", data);

  return data;
}
