import { apiFetch, buildApiUrl } from "./apiClient";

export const ORDER_GUIDE_GROUPS_URL = buildApiUrl("/orderguidegroups");

/**
 * Deletes an Order Guide Group
 *
 * DELETE /orderguidegroups/{orderGuideGroupID}
 *
 * Example:
 * DELETE /orderguidegroups/3
 *
 * @param {number|string} orderGuideGroupID
 * @returns {Promise<Object>} API response
 */
export async function deleteOrderGuideGroupApi(orderGuideGroupID) {
  // Validate Group ID
  const resolvedGroupID = Number(orderGuideGroupID);

  if (
    orderGuideGroupID === undefined ||
    orderGuideGroupID === null ||
    Number.isNaN(resolvedGroupID)
  ) {
    throw new Error("Order Guide Group ID is required");
  }

  console.log("Delete Order Guide Group ID:", resolvedGroupID);

  // DELETE API call
  const data = await apiFetch(`/orderguidegroups/${resolvedGroupID}`, {
    method: "DELETE",
  });

  console.log("Delete Order Guide Group Response:", data);

  return data;
}
