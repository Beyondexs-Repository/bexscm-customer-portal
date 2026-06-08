"use client";

import { useState } from "react";
import {
  ChevronRight,
  Download,
  GripVertical,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { downloadPARSheet } from "@/lib/PdfGenerators/PARSheet";

function countOrderProducts(order) {
  return order.groups.reduce(
    (total, group) => total + group.products.length,
    0,
  );
}

function touchOrder(order) {
  return {
    ...order,
    updatedAt: new Date().toISOString(),
  };
}

function formatUpdatedAt(value) {
  if (!value) return "Updated just now";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));

  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `Updated ${days} day${days === 1 ? "" : "s"} ago`;
}

export function QuickOrderList({
  quickOrders,
  setQuickOrders,
  selectedOrderId,
  setSelectedOrderId,
  selectedGroupId,
  setSelectedGroupId,
  onCreate,
}) {
  const [dialog, setDialog] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [draggedOrderId, setDraggedOrderId] = useState(null);

  function closeDialog() {
    setDialog(null);
    setDraftName("");
  }

  function openAddGroup(order) {
    setDialog({ type: "add-group", order });
    setDraftName("");
  }

  function openRenameOrder(order) {
    setDialog({ type: "rename-order", order });
    setDraftName(order.name);
  }

  function openRenameGroup(order, group) {
    setDialog({ type: "rename-group", order, group });
    setDraftName(group.name);
  }

  function saveNameDialog() {
    const name = draftName.trim();
    if (!name || !dialog) return;

    if (dialog.type === "add-group") {
      const group = {
        id: crypto.randomUUID(),
        name,
        products: [],
      };

      setQuickOrders((orders) =>
        orders.map((order) =>
          order.id === dialog.order.id
            ? touchOrder({ ...order, groups: [...order.groups, group] })
            : order,
        ),
      );
      setExpandedOrderId(dialog.order.id);
      setSelectedGroupId(group.id);
      closeDialog();
      return;
    }

    if (dialog.type === "rename-order") {
      setQuickOrders((orders) =>
        orders.map((order) =>
          order.id === dialog.order.id ? touchOrder({ ...order, name }) : order,
        ),
      );
      closeDialog();
      return;
    }

    if (dialog.type === "rename-group") {
      setQuickOrders((orders) =>
        orders.map((order) =>
          order.id === dialog.order.id
            ? touchOrder({
                ...order,
                groups: order.groups.map((group) =>
                  group.id === dialog.group.id ? { ...group, name } : group,
                ),
              })
            : order,
        ),
      );
      closeDialog();
    }
  }

  function confirmDelete() {
    if (!dialog) return;

    if (dialog.type === "delete-order") {
      setQuickOrders((orders) =>
        orders.filter((order) => order.id !== dialog.order.id),
      );

      if (selectedOrderId === dialog.order.id) {
        setSelectedOrderId(null);
        setSelectedGroupId(null);
      }
      if (expandedOrderId === dialog.order.id) {
        setExpandedOrderId(null);
      }
      closeDialog();
      return;
    }

    if (dialog.type === "delete-group") {
      const nextGroup =
        dialog.order.groups.find((group) => group.id !== dialog.group.id)?.id ??
        null;

      setQuickOrders((orders) =>
        orders.map((order) =>
          order.id === dialog.order.id
            ? touchOrder({
                ...order,
                groups: order.groups.filter(
                  (group) => group.id !== dialog.group.id,
                ),
              })
            : order,
        ),
      );

      if (selectedGroupId === dialog.group.id) {
        setSelectedGroupId(nextGroup);
      }
      closeDialog();
    }
  }

  function moveOrder(sourceOrderId, targetOrderId) {
    if (!sourceOrderId || sourceOrderId === targetOrderId) return;

    setQuickOrders((orders) => {
      const sourceIndex = orders.findIndex(
        (order) => order.id === sourceOrderId,
      );
      const targetIndex = orders.findIndex(
        (order) => order.id === targetOrderId,
      );

      if (sourceIndex === -1 || targetIndex === -1) return orders;

      const nextOrders = [...orders];
      const [movedOrder] = nextOrders.splice(sourceIndex, 1);
      nextOrders.splice(targetIndex, 0, touchOrder(movedOrder));

      return nextOrders;
    });
  }

  const isNameDialog =
    dialog?.type === "add-group" ||
    dialog?.type === "rename-order" ||
    dialog?.type === "rename-group";
  const isDeleteDialog =
    dialog?.type === "delete-order" || dialog?.type === "delete-group";

  return (
    <>
      <aside className="min-h-0 overflow-hidden rounded-lg border bg-card/55 p-3 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Order Guides</h2>

          <Button size="sm" className="h-8" onClick={onCreate}>
            <Plus className="size-4" />
            Create
          </Button>
        </div>

        <div className="no-scrollbar h-[calc(100vh-11rem)] space-y-3 overflow-y-auto pr-1">
          {quickOrders.map((order, orderIndex) => {
            const isSelectedOrder = order.id === selectedOrderId;
            const isExpandedOrder =
              order.id === expandedOrderId || isSelectedOrder;

            return (
              <section
                key={order.id}
                onDragOver={(event) => {
                  if (!draggedOrderId || draggedOrderId === order.id) return;
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  moveOrder(draggedOrderId, order.id);
                  setDraggedOrderId(null);
                }}
                className={cn(
                  "rounded-lg border bg-background/50 p-3 transition-colors",
                  isExpandedOrder && "border-primary/80",
                  draggedOrderId === order.id && "opacity-60",
                )}
              >
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    draggable
                    aria-label={`Drag ${order.name}`}
                    className="mt-1 grid size-7 shrink-0 cursor-grab place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
                    onDragStart={(event) => {
                      setDraggedOrderId(order.id);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", order.id);
                    }}
                    onDragEnd={() => setDraggedOrderId(null)}
                  >
                    <GripVertical className="size-4" />
                  </button>

                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-start justify-between gap-3 rounded-md text-left"
                    onClick={() => {
                      if (isExpandedOrder) {
                        setExpandedOrderId(null);
                        setSelectedOrderId(null);
                        setSelectedGroupId(null);
                        return;
                      }

                      setExpandedOrderId(order.id);
                    }}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3 className="truncate text-sm font-semibold">
                          {order.name}
                        </h3>
                        {orderIndex === 0 ? (
                          <Badge className="h-4 px-1.5 text-[10px]">
                            Default
                          </Badge>
                        ) : null}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {countOrderProducts(order)} items -{" "}
                        {formatUpdatedAt(order.updatedAt)}
                      </p>
                    </div>

                    <ChevronRight
                      className={cn(
                        "mt-2 size-4 shrink-0 text-muted-foreground transition-transform",
                        isExpandedOrder && "rotate-90",
                      )}
                    />
                  </button>
                </div>

                {isExpandedOrder ? (
                  <div className="mt-4 space-y-2">
                    {order.groups.map((group) => {
                      const isSelectedGroup = group.id === selectedGroupId;

                      return (
                        <div
                          key={group.id}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-md border border-transparent px-3 py-2.5 text-sm",
                            isSelectedGroup
                              ? "bg-primary/25 text-foreground"
                              : "bg-muted/35",
                          )}
                        >
                          <button
                            type="button"
                            className="min-w-0 flex-1 truncate text-left font-medium"
                            onClick={() => {
                              setExpandedOrderId(order.id);
                              setSelectedOrderId(order.id);
                              setSelectedGroupId(group.id);
                            }}
                          >
                            {group.name}
                          </button>

                          <span className="rounded-full bg-background/75 px-2 py-0.5 text-xs font-semibold">
                            {group.products.length}
                          </span>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                aria-label={`${group.name} options`}
                              >
                                <MoreVertical />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem
                                onSelect={() => openRenameGroup(order, group)}
                              >
                                <Pencil className="size-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                disabled={order.groups.length <= 1}
                                onSelect={() =>
                                  setDialog({
                                    type: "delete-group",
                                    order,
                                    group,
                                  })
                                }
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      );
                    })}

                    <Button
                      variant="outline"
                      className="h-10 w-full border-dashed bg-transparent"
                      onClick={() => openAddGroup(order)}
                    >
                      <Plus className="size-4" />
                      Add Group
                    </Button>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRenameOrder(order)}
                      >
                        <Pencil className="size-4" />
                        Rename
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setDialog({ type: "delete-order", order })
                        }
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      className="h-8 mt-0 w-full"
                      onClick={() => downloadPARSheet(order)}
                    >
                      <Download className="size-4" />
                      Download PAR Sheet
                    </Button>
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </aside>

      <Dialog
        open={isNameDialog}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialog?.type === "add-group"
                ? "Add Group"
                : dialog?.type === "rename-order"
                  ? "Rename Order Guide"
                  : "Rename Group"}
            </DialogTitle>
            <DialogDescription>
              Enter the name you want to use.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="quickOrderDialogName">Name</Label>
            <Input
              id="quickOrderDialogName"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") saveNameDialog();
              }}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={saveNameDialog}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteDialog}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialog?.type === "delete-order"
                ? "Delete Order Guide"
                : "Delete Group"}
            </DialogTitle>
            <DialogDescription>
              This action removes the selected item from your saved order
              guides.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
