import { apiFetch, buildApiUrl } from "./apiClient";

export const ORDER_GROUP_ITEMS_URL = buildApiUrl("/ordergroupitems");

/**
 * Deletes an Order Group Item
 *
 * DELETE /ordergroupitems/{orderGroupItemID}
 *
 * Example:
 * DELETE /ordergroupitems/2
 *
 * @param {number|string} orderGroupItemID
 * @returns {Promise<Object>} API response
 */
export async function deleteOrderGroupItemApi(orderGroupItemID) {
  // Validate Item ID
  const resolvedItemID = Number(orderGroupItemID);

  if (
    orderGroupItemID === undefined ||
    orderGroupItemID === null ||
    Number.isNaN(resolvedItemID)
  ) {
    throw new Error("Order Group Item ID is required");
  }

  console.log("Delete Order Group Item ID:", resolvedItemID);

  // DELETE API call
  const data = await apiFetch(`/ordergroupitems/${resolvedItemID}`, {
    method: "DELETE",
  });

  console.log("Delete Order Group Item Response:", data);

  return data;
}
