"use client";

import Link from "next/link";

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

function isProductInGroup(group, productId) {
  return Boolean(group.products?.some((product) => product.id === productId));
}

function countSelectedGroups(order, productId) {
  return order.groups.reduce(
    (total, group) => total + (isProductInGroup(group, productId) ? 1 : 0),
    0,
  );
}

function countOtherGroupProducts(group, productId) {
  return group.products.filter((product) => product.id !== productId).length;
}

export function OrderGuidePickerDialog({
  product,
  quickOrders,
  open,
  onOpenChange,
  onAdd,
  onRemove,
}) {
  const defaultOpenOrders =
    product && quickOrders.length > 0
      ? quickOrders
          .filter((order) => countSelectedGroups(order, product.id) > 0)
          .map((order) => order.id)
      : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92svh,44rem)] overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Order Guide</DialogTitle>
          <DialogDescription>
            Select an order guide, then choose the groups where this product
            should appear.
          </DialogDescription>
        </DialogHeader>

        {!product ? null : quickOrders.length === 0 ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Create an order guide first, then return to add products.
            </p>
            <Button asChild>
              <Link href="/order-guide">Create Order Guide</Link>
            </Button>
          </div>
        ) : (
          <div className="no-scrollbar max-h-[calc(min(92svh,44rem)-8.5rem)] space-y-3 overflow-y-auto py-2 pr-1">
            <p className="truncate text-sm font-semibold">{product.name}</p>

            <Accordion
              key={product.id}
              type="multiple"
              defaultValue={defaultOpenOrders}
              className="gap-2"
            >
              {quickOrders.map((order) => {
                const selectedCount = countSelectedGroups(order, product.id);

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
                            ? `${selectedCount} group${
                                selectedCount === 1 ? "" : "s"
                              } selected`
                            : `${order.groups.length} group${
                                order.groups.length === 1 ? "" : "s"
                              } available`}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3">
                      <div className="ml-3 space-y-2 border-l pl-3">
                        {order.groups.map((group) => {
                          const checked = isProductInGroup(group, product.id);
                          const otherItemCount = countOtherGroupProducts(
                            group,
                            product.id,
                          );

                          return (
                            <label
                              key={group.id}
                              className="flex cursor-pointer items-start gap-3 rounded-md bg-muted/35 p-2 text-sm transition-colors hover:bg-muted/60"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    onAdd(order.id, product, group.id);
                                    return;
                                  }

                                  onRemove(order.id, product.id, group.id);
                                }}
                                className="mt-0.5 size-4 accent-primary"
                              />
                              <span className="grid min-w-0 gap-1">
                                <span className="truncate font-medium">
                                  {group.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                  {otherItemCount} other item
                                  {otherItemCount === 1 ? "" : "s"}
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
