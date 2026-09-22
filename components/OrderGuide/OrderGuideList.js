"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronRight,
  Download,
  GripVertical,
  MoreVertical,
  Package2,
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

function countOrderProducts(order) {
  return order.groups.reduce(
    (total, group) => total + group.products.length,
    0,
  );
}

function countUniqueOrderProducts(order) {
  return new Set(
    order.groups.flatMap((group) => group.products.map((product) => product.id)),
  ).size;
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

function OrderGuideCard({
  order,
  orderIndex,
  isSelectedOrder,
  isExpandedOrder,
  selectedGroupId,
  onToggleExpand,
  onSelectGroup,
  onOpenRenameOrder,
  onOpenRenameGroup,
  onOpenEditGroupPar,
  onOpenDeleteOrder,
  onOpenDeleteGroup,
  onAddGroup,
  canEdit,
  canDelete,
}) {
  const t = useTranslations("orderGuide")
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-background/50 p-3 transition-colors",
        isExpandedOrder && "border-primary/80",
        isDragging && "opacity-70 shadow-lg",
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          aria-label={`Drag ${order.name}`}
          className="mt-1 grid size-7 shrink-0 cursor-grab place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
          {...(canEdit ? attributes : {})}
          {...(canEdit ? listeners : {})}
        >
          <GripVertical className="size-4" />
        </button>

        <button
          type="button"
          className="flex min-w-0 flex-1 items-start justify-between gap-3 rounded-md text-left"
          onClick={onToggleExpand}
        >
          <div className="min-w-0 space-y-1">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate text-sm font-semibold">{order.name}</h3>
              {orderIndex === 0 ? (
                <Badge className="h-4 px-1.5 text-[10px]">{t("default")}</Badge>
              ) : null}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {countOrderProducts(order)} items - {formatUpdatedAt(order.updatedAt)}
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
          <div
            className={cn(
              "flex items-center justify-between gap-2 rounded-md border border-transparent px-3 py-2.5 text-sm",
              isSelectedOrder && selectedGroupId === "all"
                ? "bg-primary/25 text-foreground"
                : "bg-muted/35",
            )}
          >
            <button
              type="button"
              className="min-w-0 flex-1 truncate text-left font-medium"
              onClick={() => onSelectGroup(order.id, "all")}
            >
              All
            </button>
            <span className="rounded-full bg-background/75 px-2 py-0.5 text-xs font-semibold">
              {countUniqueOrderProducts(order)}
            </span>
            {canEdit ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs" aria-label="All options">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onSelect={() => onOpenEditGroupPar(order, {
                      id: "all",
                      name: "All",
                      isAll: true,
                      products: order.groups.flatMap((group) => group.products),
                    })}
                  >
                    <Package2 className="size-4" />
                    {t("editPar")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
          {order.groups.map((group) => {
            const isSelectedGroup = isSelectedOrder && group.id === selectedGroupId;

            return (
              <div
                key={group.id}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-md border border-transparent px-3 py-2.5 text-sm",
                  isSelectedGroup ? "bg-primary/25 text-foreground" : "bg-muted/35",
                )}
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left font-medium"
                  onClick={() => onSelectGroup(order.id, group.id)}
                >
                  {group.name}
                </button>

                <span className="rounded-full bg-background/75 px-2 py-0.5 text-xs font-semibold">
                  {group.products.length}
                </span>

                {(canEdit || canDelete) ? <DropdownMenu>
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
                    {canEdit ? <DropdownMenuItem onSelect={() => onOpenRenameGroup(order, group)}>
                      <Pencil className="size-4" />
                      {t("rename")}
                    </DropdownMenuItem> : null}
                    {canEdit ? <DropdownMenuItem onSelect={() => onOpenEditGroupPar(order, group)}>
                      <Package2 className="size-4" />
                      {t("editPar")}
                    </DropdownMenuItem> : null}
                    {canDelete ? <DropdownMenuItem
                      variant="destructive"
                      disabled={order.groups.length <= 1}
                      onSelect={() => onOpenDeleteGroup(order, group)}
                    >
                      <Trash2 className="size-4" />
                      {t("delete")}
                    </DropdownMenuItem> : null}
                  </DropdownMenuContent>
                </DropdownMenu> : null}
              </div>
            );
          })}

          {canEdit ? <Button
            variant="outline"
            className="h-10 w-full border-dashed bg-transparent"
            onClick={() => onAddGroup(order)}
          >
            <Plus className="size-4" />
            {t("addGroup")}
          </Button> : null}

          {(canEdit || canDelete) ? <div className="grid grid-cols-2 gap-2 pt-1">
            {canEdit ? <Button variant="outline" size="sm" onClick={() => onOpenRenameOrder(order)}>
              <Pencil className="size-4" />
              {t("rename")}
            </Button> : null}
            {canDelete ? <Button variant="destructive" size="sm" onClick={() => onOpenDeleteOrder(order)}>
              <Trash2 className="size-4" />
              {t("delete")}
            </Button> : null}
          </div> : null}
          <Button size="sm" className="mt-0 h-8 w-full">
            <Download className="size-4" />
            {t("downloadPARSheet")}
          </Button>
        </div>
      ) : null}
    </section>
  );
}

export function OrderGuideList({
  quickOrders,
  setQuickOrders,
  selectedOrderId,
  setSelectedOrderId,
  selectedGroupId,
  setSelectedGroupId,
  onCreate,
  canCreate,
  canEdit,
  canDelete,
}) {
  const t = useTranslations("orderGuide")
  const [dialog, setDialog] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [parDraft, setParDraft] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeOrder = useMemo(
    () => quickOrders.find((order) => order.id === activeOrderId) ?? null,
    [activeOrderId, quickOrders],
  );

  function closeDialog() {
    setDialog(null);
    setDraftName("");
    setParDraft("");
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

  function openEditGroupPar(order, group) {
    setDialog({ type: "edit-group-par", order, group });
    setParDraft(
      group.par == null
        ? String(group.products[0]?.par ?? "")
        : String(group.par),
    );
  }

  function saveGroupPar() {
    if (dialog?.type !== "edit-group-par") return;

    const value = parDraft.trim() === "" ? null : Number(parDraft);
    if (value !== null && (!Number.isFinite(value) || value < 0)) return;

    setQuickOrders((orders) =>
      orders.map((order) =>
        order.id === dialog.order.id
          ? touchOrder({
              ...order,
              groups: order.groups.map((group) =>
                dialog.group.isAll || group.id === dialog.group.id
                  ? {
                      ...group,
                      par: value,
                      products: group.products.map((product) => ({
                        ...product,
                        par: value,
                      })),
                    }
                  : group,
              ),
            })
          : order,
      ),
    );
    closeDialog();
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

  function handleDragEnd(event) {
    if (!canEdit) return

    const { active, over } = event;

    setActiveOrderId(null);

    if (!over || active.id === over.id) return;

    setQuickOrders((orders) => {
      const oldIndex = orders.findIndex((order) => order.id === active.id);
      const newIndex = orders.findIndex((order) => order.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return orders;

      return arrayMove(orders, oldIndex, newIndex).map((order) =>
        order.id === active.id ? touchOrder(order) : order,
      );
    });
  }

  function handleDragCancel() {
    setActiveOrderId(null);
  }

  const isNameDialog =
    dialog?.type === "add-group" ||
    dialog?.type === "rename-order" ||
    dialog?.type === "rename-group";
  const isDeleteDialog =
    dialog?.type === "delete-order" || dialog?.type === "delete-group";

  return (
    <>
      <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border bg-card/55 p-2 shadow-sm lg:p-2.5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold lg:text-lg">Order Guides</h2>

          {canCreate ? <Button size="sm" className="h-8" onClick={onCreate}>
            <Plus className="size-4" />
            Create
          </Button> : null}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={({ active }) => setActiveOrderId(active.id)}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={quickOrders.map((order) => order.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="no-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
              {quickOrders.map((order, orderIndex) => {
                const isSelectedOrder = order.id === selectedOrderId;
                const isExpandedOrder =
                  order.id === expandedOrderId || isSelectedOrder;

                return (
                  <OrderGuideCard
                    key={order.id}
                    order={order}
                    orderIndex={orderIndex}
                    isSelectedOrder={isSelectedOrder}
                    isExpandedOrder={isExpandedOrder}
                    selectedGroupId={selectedGroupId}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onToggleExpand={() => {
                      if (isExpandedOrder) {
                        setExpandedOrderId(null);
                        setSelectedOrderId(null);
                        setSelectedGroupId(null);
                        return;
                      }

                      setExpandedOrderId(order.id);
                      setSelectedOrderId(order.id);
                      setSelectedGroupId("all");
                    }}
                    onSelectGroup={(orderId, groupId) => {
                      setExpandedOrderId(orderId);
                      setSelectedOrderId(orderId);
                      setSelectedGroupId(groupId);
                    }}
                    onOpenRenameOrder={openRenameOrder}
                    onOpenRenameGroup={openRenameGroup}
                    onOpenEditGroupPar={openEditGroupPar}
                    onOpenDeleteOrder={(orderToDelete) =>
                      setDialog({ type: "delete-order", order: orderToDelete })
                    }
                    onOpenDeleteGroup={(orderToDelete, groupToDelete) =>
                      setDialog({
                        type: "delete-group",
                        order: orderToDelete,
                        group: groupToDelete,
                      })
                    }
                    onAddGroup={openAddGroup}
                  />
                );
              })}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeOrder ? (
              <section className="rounded-lg border border-primary/80 bg-background/95 p-3 shadow-2xl">
                <div className="flex items-start gap-2">
                  <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-md text-primary">
                    <GripVertical className="size-4" />
                  </div>

                  <div className="flex min-w-0 flex-1 items-start justify-between gap-3 rounded-md text-left">
                    <div className="min-w-0 space-y-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3 className="truncate text-sm font-semibold">
                          {activeOrder.name}
                        </h3>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {countOrderProducts(activeOrder)} items -{" "}
                        {formatUpdatedAt(activeOrder.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}
          </DragOverlay>
        </DndContext>
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
              {t("cancel")}
            </Button>
            <Button onClick={saveNameDialog}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog?.type === "edit-group-par"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("editPar")}</DialogTitle>
            <DialogDescription>
              This PAR value will be applied to every product in {dialog?.group?.isAll ? "all groups" : dialog?.group?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="groupParValue">{t("parValue")}</Label>
            <Input
              id="groupParValue"
              type="number"
              min="0"
              value={parDraft}
              onChange={(event) => setParDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") saveGroupPar();
              }}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              {t("cancel")}
            </Button>
            <Button onClick={saveGroupPar}>{t("save")}</Button>
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
                ? t("deleteOrderGuide")
                : t("deleteGroup")}
            </DialogTitle>
            <DialogDescription>
              This action removes the selected item from your saved order
              guides.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
