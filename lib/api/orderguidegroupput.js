import { apiFetch, buildApiUrl } from "./apiClient";

export const ORDER_GUIDE_GROUPS_URL = buildApiUrl("/orderguidegroups");

export async function updateOrderGuideGroupApi({
  orderGuideGroupID,
  name,
  modifyBY,
} = {}) {
  // Validate Group ID
  const resolvedGroupID = Number(orderGuideGroupID);

  if (
    orderGuideGroupID === undefined ||
    orderGuideGroupID === null ||
    Number.isNaN(resolvedGroupID)
  ) {
    throw new Error("Order Guide Group ID is required");
  }

  // Validate Group name
  const resolvedName = String(name || "").trim();

  if (!resolvedName) {
    throw new Error("Order Guide Group name is required");
  }

  // Convert user ID to number
  const resolvedModifyBy = Number(modifyBY);

  if (
    modifyBY === undefined ||
    modifyBY === null ||
    Number.isNaN(resolvedModifyBy)
  ) {
    throw new Error("Modify By User ID is required");
  }

  // Request body
  const requestBody = {
    name: resolvedName,
    modifyBY: resolvedModifyBy,
  };

  console.log("Update Order Guide Group Request:", {
    orderGuideGroupID: resolvedGroupID,
    ...requestBody,
  });

  // PUT API call
  const data = await apiFetch(`/orderguidegroups/${resolvedGroupID}`, {
    method: "PUT",
    body: JSON.stringify(requestBody),
  });

  console.log("Update Order Guide Group Response:", data);

  return data;
}
