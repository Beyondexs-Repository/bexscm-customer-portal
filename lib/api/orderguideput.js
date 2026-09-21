import { apiFetch } from "./apiClient";

/**
 * Modify Order Guide
 *
 * PUT /orderguides/{orderGuideID}
 *
 * Example:
 * PUT /orderguides/1
 *
 * Request body:
 * {
 *   "name": "Chicken Group",
 *   "modifyBY": 1
 * }
 */
export async function modifyOrderGuideApi({ orderGuideID, name, modifyBY }) {
  if (!orderGuideID) {
    throw new Error("Order Guide ID is required");
  }

  if (!name?.trim()) {
    throw new Error("Order Guide name is required");
  }

  if (!modifyBY) {
    throw new Error("Modify User ID is required");
  }

  const requestBody = {
    name: name.trim(),
    modifyBY: Number(modifyBY),
  };

  console.log("Modify Order Guide Request:", {
    orderGuideID,
    requestBody,
  });

  const data = await apiFetch(`/orderguides/${orderGuideID}`, {
    method: "PUT",
    body: JSON.stringify(requestBody),
  });

  console.log("Modify Order Guide Response:", data);

  return data;
}
