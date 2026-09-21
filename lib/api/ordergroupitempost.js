import { apiFetch, buildApiUrl } from "./apiClient";

export const ORDER_GROUP_ITEMS_URL = buildApiUrl("/ordergroupitems");

export async function createOrderGroupItemApi({
  orderGuideGroupID,
  itemNumber,
  itemName,
  quantity,
  createdBY,
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

  // Validate Item Number
  const resolvedItemNumber = String(itemNumber || "").trim();

  if (!resolvedItemNumber) {
    throw new Error("Item Number is required");
  }

  // Validate Item Name
  const resolvedItemName = String(itemName || "").trim();

  if (!resolvedItemName) {
    throw new Error("Item Name is required");
  }

  // Validate Quantity
  const resolvedQuantity = Number(quantity);

  if (
    quantity === undefined ||
    quantity === null ||
    Number.isNaN(resolvedQuantity) ||
    resolvedQuantity <= 0
  ) {
    throw new Error("Quantity must be greater than 0");
  }

  // Validate Created By
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
    orderGuideGroupID: resolvedGroupID,
    itemNumber: resolvedItemNumber,
    itemName: resolvedItemName,
    quantity: resolvedQuantity,
    createdBY: resolvedCreatedBy,
  };

  console.log("Create Order Group Item Request:", requestBody);

  // POST API call
  const data = await apiFetch("/ordergroupitems", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  console.log("Create Order Group Item Response:", data);

  return data;
}
