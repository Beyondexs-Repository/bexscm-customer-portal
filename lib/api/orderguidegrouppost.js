import { apiFetch, buildApiUrl } from "./apiClient";

export const ORDER_GUIDE_GROUPS_URL = buildApiUrl("/orderguidegroups");

export async function createOrderGuideGroupApi({
  orderGuideID,
  name,
  createdBY,
} = {}) {
  // Validate Order Guide ID
  const resolvedOrderGuideID = Number(orderGuideID);

  if (
    orderGuideID === undefined ||
    orderGuideID === null ||
    Number.isNaN(resolvedOrderGuideID)
  ) {
    throw new Error("Order Guide ID is required");
  }

  // Validate Group name
  const resolvedName = String(name || "").trim();

  if (!resolvedName) {
    throw new Error("Order Guide Group name is required");
  }

  // Convert logged-in user ID to number
  const resolvedCreatedBy = Number(createdBY);

  if (
    createdBY === undefined ||
    createdBY === null ||
    Number.isNaN(resolvedCreatedBy)
  ) {
    throw new Error("Created By User ID is required");
  }

  // Request body
  const requestBody = {
    orderGuideID: resolvedOrderGuideID,
    name: resolvedName,
    createdBY: resolvedCreatedBy,
  };

  console.log("Create Order Guide Group Request:", requestBody);

  // POST API call
  const data = await apiFetch("/orderguidegroups", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  console.log("Create Order Guide Group Response:", data);

  return data;
}
