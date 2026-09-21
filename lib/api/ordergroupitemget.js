import { apiFetch, buildApiUrl } from "./apiClient";

export const ORDER_GROUP_ITEMS_URL = buildApiUrl("/ordergroupitems");

export async function getOrderGroupItemsApi(orderGuideGroupID) {
  // Validate Group ID
  const resolvedGroupID = Number(orderGuideGroupID);

  if (
    orderGuideGroupID === undefined ||
    orderGuideGroupID === null ||
    Number.isNaN(resolvedGroupID)
  ) {
    throw new Error("Order Guide Group ID is required");
  }

  console.log("Get Order Group Items - Group ID:", resolvedGroupID);

  // GET API call
  const data = await apiFetch(`/ordergroupitems/group/${resolvedGroupID}`, {
    method: "GET",
  });

  console.log("Get Order Group Items Response:", data);

  return data;
}
