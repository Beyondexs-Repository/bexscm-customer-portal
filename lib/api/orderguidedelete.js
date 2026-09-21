import { apiFetch } from "./apiClient";

/**
 * Delete Order Guide
 *
 * DELETE /orderguides/{orderGuideID}
 *
 * Example:
 * DELETE /orderguides/1
 *
 * Response:
 * {
 *   "status": "Y",
 *   "success": true,
 *   "message": "Order Guide deleted successfully."
 * }
 */
export async function deleteOrderGuideApi(orderGuideID) {
  if (!orderGuideID) {
    throw new Error("Order Guide ID is required");
  }

  console.log("Delete Order Guide ID:", orderGuideID);

  const data = await apiFetch(`/orderguides/${orderGuideID}`, {
    method: "DELETE",
  });

  console.log("Delete Order Guide Response:", data);

  return data;
}
