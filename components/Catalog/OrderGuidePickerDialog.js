"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { DeleteOrderGroupItem } from "@/redux/slices/postSlice";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { createOrderGroupItemApi } from "@/lib/api/ordergroupitempost";


const createOrderGroupItemApiv1_POST = async ({
  orderGuideGroupID,
  itemNumber,
  itemName,
  quantity,
  createdBY,
}) => {
  try {
    const url =
      `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems`;

    const requestBody = {
      orderGuideGroupID,
      itemNumber,
      itemName,
      quantity,
      createdBY,
    };

    console.log("POST URL:", url);
    console.log("POST Body:", requestBody);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();

    console.log("POST Status:", response.status);
    console.log("POST Raw Response:", responseText);

    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch {
      console.warn("Response is not JSON:", responseText);
    }

    console.log("POST Parsed Response:", result);

    if (!response.ok) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to create order group item. HTTP ${response.status}`,
      );
    }

    if (!result?.success) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          "Failed to create order group item.",
      );
    }

    return result;
  } catch (error) {
    console.error("Create Order Group Item Error:", error);
    throw error;
  }
};


export function isProductInGroup(group, productId) {
  return Boolean(group.products?.some((product) =>
    String(product.itemNumber || product.itemnumber || product.ITEMNMBR || product.itemnmbr || product.sku || product.id).trim() === String(productId).trim(),
  ));
}

function countSelectedGroups(order, products) {
  return order.groups.filter((group) =>
    products.every((product) => isProductInGroup(group, product.id)),
  ).length;
}

export function OrderGuidePickerDialog({
  product,
  products,
  quickOrders,
  open,
  onOpenChange,
  onAdd,
  onRemove,
  onAddComplete,
}) {
  const t = useTranslations("catalog");
  const dispatch = useDispatch();
  const [savingGroupId, setSavingGroupId] = useState(null);
  const [error, setError] = useState("");
  const selectedProducts = products ?? (product ? [product] : []);
  const selectionKey = selectedProducts.map((item) => item.id).join(",");

  const defaultOpenOrders =
    selectedProducts.length > 0 && quickOrders.length > 0
      ? quickOrders
          .filter((order) => countSelectedGroups(order, selectedProducts) > 0)
          .map((order) => order.id)
      : [];

  async function handleGroupCheck(order, group, checked) {
    if (savingGroupId !== null) return;
    setError("");

    if (!checked) {
      setSavingGroupId(group.id);
      try {
        // Catalog product numbers and saved order-group row IDs are different.
        const response = await fetch(`${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/group/${group.id}`, {
          headers: { Accept: "application/json", Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}` },
        });
        const result = await response.json();
        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error(result.Msg || result.message || "Unable to load saved products.");
        }
        for (const item of selectedProducts) {
          const savedItems = result.data.filter((saved) => isProductInGroup({ products: [saved] }, item.id));
          for (const saved of savedItems) {
            if (!saved.orderGroupItemID) throw new Error("Saved product ID is missing.");
            await dispatch(DeleteOrderGroupItem(saved.orderGroupItemID)).unwrap();
          }
          for (const localItem of group.products.filter((saved) => isProductInGroup({ products: [saved] }, item.id))) {
            onRemove(order.id, localItem.id, group.id);
          }
        }
      } catch (error) {
        setError(typeof error === "string" ? error : error.message || "Unable to remove products. Please try again.");
      } finally {
        setSavingGroupId(null);
      }
      return;
    }

    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
      setError("Logged-in user not found.");
      return;
    }

    setSavingGroupId(group.id);
    try {
      for (const item of selectedProducts) {
        if (isProductInGroup(group, item.id)) continue;
        await createOrderGroupItemApiv1_POST({
          orderGuideGroupID: group.id,
          itemNumber: item.id,
          itemName: item.name,
          quantity: 1,
          createdBY: storedUser,
        });
        onAdd(order.id, item, group.id);
      }
      onAddComplete?.();
    } catch (error) {
      setError(error.message || "Unable to add products. Please try again.");
    } finally {
      setSavingGroupId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (savingGroupId === null) { setError(""); onOpenChange(nextOpen); }
    }}>
      <DialogContent showCloseButton={savingGroupId === null} className="max-h-[min(92svh,44rem)] overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addToOrderGuide")}</DialogTitle>
          <DialogDescription>
            {t("orderGuidePickerDescription")}
          </DialogDescription>
        </DialogHeader>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {/* {savingGroupId !== null && <p role="status" className="text-sm text-muted-foreground">Adding products...</p>} */}

        {selectedProducts.length === 0 ? null : quickOrders.length === 0 ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              {t("createOrderGuideFirst")}
            </p>
            <Button asChild>
              <Link href="/order-guide">{t("createOrderGuide")}</Link>
            </Button>
          </div>
        ) : (
          <div className="no-scrollbar max-h-[calc(min(92svh,44rem)-8.5rem)] space-y-3 overflow-y-auto py-2 pr-1">
            <p className="truncate text-sm font-semibold">{selectedProducts.length === 1 ? selectedProducts[0].name : `${selectedProducts.length} products selected`}</p>

            <Accordion
              key={selectionKey}
              type="multiple"
              defaultValue={defaultOpenOrders}
              className="gap-2"
            >
              {quickOrders.map((order) => {
                const selectedCount = countSelectedGroups(order, selectedProducts);

                return (
                  <AccordionItem
                    key={order.id}
                    value={order.id}
                    className="rounded-md border bg-background px-3"
                  >
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <span className="grid min-w-0 gap-1">
                        <span className="truncate font-semibold">
                          {order.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {selectedCount > 0
                            ? t("groupsSelected", { count: selectedCount })
                            : t("groupsAvailable", {
                                count: order.groups.length,
                              })}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3">
                      <div className="ml-3 space-y-2 border-l pl-3">
                        {order.groups.map((group) => {
                          const checked = selectedProducts.every((item) => isProductInGroup(group, item.id));
                          const otherItemCount = group.products.filter((item) =>
                            !selectedProducts.some((selected) => isProductInGroup({ products: [item] }, selected.id)),
                          ).length;

                          return (
                            <label
                              key={group.id}
                              className="flex cursor-pointer items-start gap-3 rounded-md bg-muted/35 p-2 text-sm transition-colors hover:bg-muted/60"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={savingGroupId !== null}
                                onChange={(event) => {
                                  handleGroupCheck(
                                    order,
                                    group,
                                    event.target.checked,
                                  );
                                }}
                                className="mt-0.5 size-4 accent-blue-600"
                              />
                              <span className="grid min-w-0 gap-1">
                                <span className="truncate font-medium">
                                  {group.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                  {t("otherItems", { count: otherItemCount })}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
