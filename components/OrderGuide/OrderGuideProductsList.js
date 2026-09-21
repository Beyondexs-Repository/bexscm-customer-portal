"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronDown,
  LayoutGrid,
  List,
  MoveRight,
  MoreVertical,
  Package2,
  Plus,
  Search,
  ShoppingBasket,
  ShoppingCart,
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCart, useQuickOrders } from "@/app/context/app-context";
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images";
import { resolveItemImageUrl } from "@/lib/api/itemsApi";
// import { deleteOrderGroupItemApi } from "@/lib/api/ordergroupitemdelete";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const deleteOrderGroupItemApiv1_DEL = async (orderGroupItemID) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/${orderGroupItemID}`;

    console.log("Delete Order Guide ID:", orderGroupItemID);
    console.log("Delete Order Guide URL:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
    });

    console.log("Delete Order Guide HTTP Status:", response.status);
    console.log("Delete Order Guide HTTP OK:", response.ok);

    const responseText = await response.text();

    console.log("Delete Order Guide Raw Response:", responseText);

    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.warn("Response is not JSON:", responseText);
    }

    console.log("Delete Order Guide Parsed Response:", result);

    if (!response.ok) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to delete order guide. HTTP ${response.status}`,
      );
    }

    if (!result?.success) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          "Failed to delete order guide.",
      );
    }

    return result;
  } catch (error) {
    console.error("Delete Order Guide Error:", error);
    throw error;
  }
};










function formatPrice(price, unit) {
  return `$${Number(price).toFixed(2)} / ${unit}`;
}

function touchOrder(order) {
  return {
    ...order,
    updatedAt: new Date().toISOString(),
  };
}

function ProductImage({ product }) {
  const resolvedImg = resolveItemImageUrl(product.image) || product.image;
  const categoryFallback = getCategoryPlaceholderImage(product.category);
  const initialImage = resolvedImg || categoryFallback;

  const [imgSrc, setImgSrc] = useState(initialImage);
  const [prevInitial, setPrevInitial] = useState(initialImage);

  if (prevInitial !== initialImage) {
    setPrevInitial(initialImage);
    setImgSrc(initialImage);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        listLayout
          ? "h-full min-h-36"
          : "aspect-[1.15] sm:aspect-[1.2] xl:aspect-[1.28]",
      )}
    >
      <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,var(--muted),var(--background))] text-primary/70">
        <Package2 className="size-8 sm:size-10" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={product.name}
        className="absolute inset-0 size-full object-cover"
        onError={() => {
          if (imgSrc !== categoryFallback) {
            setImgSrc(categoryFallback);
          }
        }}
      />
    </div>
  );
}

function EmptyProductsCard({ canAddProducts }) {
  const t = useTranslations("orderGuide");
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <ShoppingBasket className="size-8 text-muted-foreground" />
        </div>

        <h3 className="text-lg font-semibold">{t("noProductsYet")}</h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Add products from the catalog to build this order guide group.
        </p>

        {canAddProducts ? (
          <Button asChild className="mt-5 h-9">
            <Link href="/catalog">
              <Plus className="size-4" />
              {t("addProducts")}
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function SavedProductCard({
  product,
  layout,
  cartQuantity,
  cartItemId,
  onAddToCart,
  onIncrement,
  onDecrement,
  onChangeGroup,
  onEditPar,
  onRequestDelete,
  canEdit,
  canPlaceOrder,
}) {
  const t = useTranslations("orderGuide");
  const [draftQuantity, setDraftQuantity] = useState(1);
  const isInCart = cartQuantity > 0;
  const quantity = isInCart ? cartQuantity : draftQuantity;
  const parValue = product.par;
  const listLayout = layout === "list";

  return (
    <article
      className={cn(
        "min-w-0 overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm",
        listLayout && "flex",
      )}
    >
      <div className={cn("relative", listLayout && "w-28 shrink-0 sm:w-40")}>
        <Link
          href={`/catalog/details/?id=${encodeURIComponent(product.id)}`}
          aria-label={`View details for ${product.name}`}
          className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ProductImage product={product} listLayout={listLayout} />
        </Link>

        {canEdit ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={`${product.name} options`}
                className="absolute right-1.5 top-1.5 bg-background/95 text-muted-foreground shadow-sm sm:right-2 sm:top-2"
              >
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={() => onChangeGroup(product)}>
                <MoveRight className="size-4" />
                {t("changeGroup")}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEditPar(product)}>
                <Package2 className="size-4" />
                {t("editPar")}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onRequestDelete(product)}
              >
                <Trash2 className="size-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        {parValue != null && parValue !== "" ? (
          <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white shadow-sm">
            {t("par")} {parValue}
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "relative space-y-1.5 p-2 lg:space-y-2 lg:p-2.5",
          listLayout && "min-w-0 flex-1 sm:p-3",
        )}
      >
        <div className="min-w-0 space-y-1">
          <Link
            href={`/catalog/details/?id=${encodeURIComponent(product.id)}`}
            className="block truncate text-[0.72rem] font-bold outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring lg:text-sm"
          >
            {product.name}
          </Link>
          <div className="flex items-start justify-between gap-2 text-[0.64rem] font-semibold text-muted-foreground lg:text-xs">
            <p className="min-w-0 truncate leading-tight">
              {product.subcategory || product.category || product.sku}
            </p>
          </div>
          <div className="grid gap-0.5 text-[0.6rem] font-medium text-muted-foreground lg:text-[0.7rem]">
            {listLayout && product.sku && (
              <span className="truncate">Item code: {product.sku}</span>
            )}
            <span className="truncate">Pack Size: 1 {product.unit}</span>
          </div>
        </div>

        <p className="text-[0.95rem] font-bold lg:text-base">
          {formatPrice(product.price, product.unit)}
        </p>

        {canPlaceOrder ? (
          <div
            className={cn(
              "grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2",
              listLayout && "max-w-xs",
            )}
          >
            <div className="grid h-8 grid-cols-3 overflow-hidden rounded-md border bg-background">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Decrease ${product.name} quantity`}
                className="h-full w-full min-w-0 rounded-none"
                onClick={() => {
                  if (isInCart) {
                    onDecrement(product.id);
                    return;
                  }

                  setDraftQuantity((current) => Math.max(1, current - 1));
                }}
              >
                <span className="grid size-full place-items-center">-</span>
              </Button>

              <Input
                value={quantity}
                readOnly
                aria-label={`${product.name} quantity`}
                className="h-full rounded-none border-0 px-0 text-center text-xs font-normal shadow-none focus-visible:ring-0"
              />

              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Increase ${product.name} quantity`}
                className="h-full w-full min-w-0 rounded-none"
                onClick={() => {
                  if (isInCart) {
                    onIncrement(product.id);
                    return;
                  }

                  setDraftQuantity((current) => current + 1);
                }}
              >
                <span className="grid size-full place-items-center">+</span>
              </Button>
            </div>

            <Button
              variant={isInCart ? "secondary" : "default"}
              className="h-8 min-w-0 rounded-md px-2 text-[0.65rem] font-bold lg:text-xs"
              onClick={() => {
                if (!isInCart) {
                  onAddToCart(product, draftQuantity);
                }
              }}
            >
              <ShoppingCart />
              <span className="truncate">
                {isInCart ? t("added") : t("addToCart")}
              </span>
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function OrderGuideProductsList({
  selectedOrder,
  selectedGroup,
  setQuickOrders,
  onBack,
  canEdit,
  canAddProducts,
  canPlaceOrder,
}) {
  const t = useTranslations("orderGuide");
  const { items, addItem, incrementItem, decrementItem, removeItem } =
    useCart();
  const { dashboardQuickOrderIds, setDashboardQuickOrderIds } =
    useQuickOrders();
  const [productToMove, setProductToMove] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEditPar, setProductToEditPar] = useState(null);
  const [parDraft, setParDraft] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const isMobile = useIsMobile();
  const [preferredLayout, setLayout] = useState(null);
  const layout = preferredLayout ?? (isMobile ? "list" : "card");

  const allProducts = selectedGroup?.products ?? [];
  const normalizedSearch = productSearch.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? allProducts.filter((product) =>
        [product.name, product.sku, product.category, product.subcategory].some(
          (value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(normalizedSearch),
        ),
      )
    : allProducts;
  const [sortField, sortDirection] = sortBy.split("-");
  const products = [...filteredProducts].sort((a, b) => {
    const field = sortField === "code" ? "sku" : "name";
    const comparison = String(a[field] ?? "").localeCompare(
      String(b[field] ?? ""),
      undefined,
      {
        numeric: true,
        sensitivity: "base",
      },
    );
    return sortDirection === "desc" ? -comparison : comparison;
  });

  const cartQuantities = new Map(items.map((item) => [item.id, item.quantity]));

  const allProductsInCart =
    products.length > 0 &&
    products.every((product) => {
      const cartItem = cartItemsByKey.get(getCartKey(product));
      return (cartItem?.quantity ?? 0) > 0;
    });
  const selectedCount = products.filter((product) => {
    const cartItem = cartItemsByKey.get(getCartKey(product));
    return (cartItem?.quantity ?? 0) > 0;
  }).length;
  const isOnDashboard =
    Boolean(selectedOrder) && dashboardQuickOrderIds.includes(selectedOrder.id);

  function toggleDashboardQuickOrder() {
    if (!selectedOrder) return;

    if (isOnDashboard) {
      setDashboardQuickOrderIds((ids) =>
        ids.filter((id) => id !== selectedOrder.id),
      );
      toast.success("Removed from the Quick Order card.");
      return;
    }

    if (dashboardQuickOrderIds.length >= 4) {
      toast.error("You can show only 4 quick orders on the overview.");
      return;
    }

    setDashboardQuickOrderIds((ids) => [...ids, selectedOrder.id]);
    toast.success("Added to the Quick Order card.");
  }

  function handleSelectAllAndAddToCart() {
    if (products.length === 0) return;

    if (allProductsInCart) {
      products.forEach((product) => {
        const cartItem = cartItemsByKey.get(getCartKey(product));

        if ((cartItem?.quantity ?? 0) > 0) {
          removeItem(cartItem.id);
        }
      });
      return;
    }

    products.forEach((product) => {
      const cartItem = cartItemsByKey.get(getCartKey(product));
      const cartQuantity = cartItem?.quantity ?? 0;

      if (cartQuantity === 0) {
        addItem(product, 1);
      }
    });
  }

  function removeFromGroup(productId) {
    if (!selectedOrder || !selectedGroup) return;

    setQuickOrders((orders) =>
      orders.map((order) =>
        order.id === selectedOrder.id
          ? touchOrder({
              ...order,
              groups: order.groups.map((group) =>
                selectedGroup.isAll || group.id === selectedGroup.id
                  ? {
                      ...group,
                      products: group.products.filter(
                        (product) => product.id !== productId,
                      ),
                    }
                  : group,
              ),
            })
          : order,
      ),
    );
  }

  function updateProductInGroup(productId, updates) {
    if (!selectedOrder || !selectedGroup) return;

    setQuickOrders((orders) =>
      orders.map((order) =>
        order.id === selectedOrder.id
          ? touchOrder({
              ...order,
              groups: order.groups.map((group) =>
                selectedGroup.isAll || group.id === selectedGroup.id
                  ? {
                      ...group,
                      products: group.products.map((product) =>
                        product.id === productId
                          ? {
                              ...product,
                              ...updates,
                            }
                          : product,
                      ),
                    }
                  : group,
              ),
            })
          : order,
      ),
    );
  }

  function moveProductToGroup(targetGroupId) {
    if (!selectedOrder || !selectedGroup || !productToMove) return;

    setQuickOrders((orders) =>
      orders.map((order) => {
        if (order.id !== selectedOrder.id) return order;

        return touchOrder({
          ...order,
          groups: order.groups.map((group) => {
            if (
              group.id === selectedGroup.id ||
              (selectedGroup.isAll && group.id !== targetGroupId)
            ) {
              return {
                ...group,
                products: group.products.filter(
                  (product) => product.id !== productToMove.id,
                ),
              };
            }

            if (group.id === targetGroupId) {
              if (
                group.products.some(
                  (product) => product.id === productToMove.id,
                )
              ) {
                return group;
              }

              return {
                ...group,
                products: [
                  ...group.products,
                  {
                    ...productToMove,
                    par: group.par ?? productToMove.par ?? null,
                  },
                ],
              };
            }

            return group;
          }),
        });
      }),
    );

    setProductToMove(null);
  }

  async function confirmDeleteProduct() {
    if (!productToDelete) return;

    try {
      const response = await deleteOrderGroupItemApiv1_DEL(
        productToDelete.orderGroupItemID,
      );

      console.log("Delete Order Group Item Response:", response);
    } catch (error) {
      console.error("Delete Order Group Item Error:", error);
    }

    removeFromGroup(productToDelete.id);
    setProductToDelete(null);
  }

  function openEditParDialog(product) {
    setProductToEditPar(product);
    setParDraft(
      product.par === null || product.par === undefined
        ? ""
        : String(product.par),
    );
  }

  function saveProductPar() {
    if (!productToEditPar) return;

    const nextPar = parDraft.trim() === "" ? null : Number(parDraft);
    if (nextPar !== null && (!Number.isFinite(nextPar) || nextPar < 0)) return;

    updateProductInGroup(productToEditPar.id, {
      par: nextPar,
    });

    setProductToEditPar(null);
    setParDraft("");
  }

  if (!selectedOrder || !selectedGroup) {
    return (
      <section className="grid h-full min-h-[420px] place-items-center rounded-lg border bg-card">
        <p className="text-sm text-muted-foreground">
          Select or create a group to begin.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="flex shrink-0 flex-col gap-2 p-2 sm:flex-row sm:items-start sm:justify-between lg:p-3">
          <div className="flex min-w-0 gap-2 lg:gap-3">
            <Button
              variant="outline"
              size="icon-sm"
              className="mt-0.5 shrink-0 lg:hidden"
              aria-label={t("backToOrderGuides")}
              onClick={onBack}
            >
              <ChevronLeft />
            </Button>

            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2 text-[0.7rem] font-semibold text-muted-foreground lg:text-xs">
                <span className="truncate">{selectedOrder.name}</span>
                <span>/</span>
                <span className="truncate text-foreground">
                  {selectedGroup.name}
                </span>
              </div>

              <div className="mt-1 flex min-w-0 items-center gap-2">
                <h2 className="truncate text-lg font-bold lg:text-xl">
                  {selectedGroup.name}
                </h2>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {normalizedSearch
                    ? `${products.length} of ${allProducts.length} items`
                    : `${allProducts.length} items`}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 [&>a]:flex-1 [&>button]:flex-1 sm:w-auto sm:self-center sm:[&>a]:flex-none sm:[&>button]:flex-none">
            {canAddProducts ? (
              <Button asChild variant="outline" size="sm" className="h-8">
                <Link href="/catalog">
                  <Plus className="size-4" />
                  {t("addProducts")}
                </Link>
              </Button>
            ) : null}

            {canAddProducts ? (
              <Button
                type="button"
                variant={isOnDashboard ? "destructive" : "outline"}
                size="sm"
                className="h-8"
                onClick={toggleDashboardQuickOrder}
              >
                {!isOnDashboard ? <Plus className="size-4" /> : null}
                {isOnDashboard
                  ? "Remove from Quick Order"
                  : "Add to Quick Order"}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-2 pb-2 pt-0 lg:px-3 lg:pb-3">
          <div className="relative min-w-0 basis-full sm:basis-auto sm:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Search products..."
              aria-label="Search order guide products"
              className="h-9 pl-9 text-sm"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9">
                Sort by <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="name-asc">
                  Item name A-Z
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-desc">
                  Item name Z-A
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="code-asc">
                  Item code A-Z
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="code-desc">
                  Item code Z-A
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="group"
            aria-label="Product layout"
            className="flex items-center rounded-lg border bg-muted/40 p-1"
          >
            <Button
              variant={layout === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              className={
                layout === "list" ? "shadow-sm" : "text-muted-foreground"
              }
              aria-label="List layout"
              title="List layout"
              aria-pressed={layout === "list"}
              onClick={() => setLayout("list")}
            >
              <List className="size-4" />
            </Button>
            <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
            <Button
              variant={layout === "card" ? "secondary" : "ghost"}
              size="icon-sm"
              className={
                layout === "card" ? "shadow-sm" : "text-muted-foreground"
              }
              aria-label="Card layout"
              title="Card layout"
              aria-pressed={layout === "card"}
              onClick={() => setLayout("card")}
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>

          {canPlaceOrder && products.length > 0 && (
            <Button
              size="sm"
              variant={allProductsInCart ? "secondary" : "default"}
              onClick={handleSelectAllAndAddToCart}
              className="flex h-9 flex-1 items-center gap-1 sm:flex-none"
            >
              <ShoppingCart className="size-4" />
              {allProductsInCart ? `Selected (${selectedCount})` : "Select All"}
            </Button>
          )}
        </div>

        <div className="min-h-0 flex-1 p-2 lg:p-3">
          {allProducts.length === 0 ? (
            <EmptyProductsCard canAddProducts={canAddProducts} />
          ) : products.length === 0 ? (
            <div className="grid min-h-[240px] place-items-center text-sm text-muted-foreground">
              No products match your search.
            </div>
          ) : (
            <div className="no-scrollbar h-full overflow-y-auto">
              <div
                className={cn(
                  "grid gap-2 sm:gap-3",
                  layout === "list"
                    ? "grid-cols-1"
                    : "grid-cols-1 min-[460px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
                )}
              >
                {products.map((product) => (
                  <SavedProductCard
                    key={product.id}
                    product={product}
                    layout={layout}
                    cartQuantity={cartQuantities.get(product.id) ?? 0}
                    onAddToCart={addItem}
                    onIncrement={incrementItem}
                    onDecrement={decrementItem}
                    onChangeGroup={setProductToMove}
                    onEditPar={openEditParDialog}
                    onRequestDelete={setProductToDelete}
                    canEdit={canEdit}
                    canPlaceOrder={canPlaceOrder}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Dialog
        open={Boolean(productToMove)}
        onOpenChange={(open) => !open && setProductToMove(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Group</DialogTitle>
            <DialogDescription>
              Move this product to another group in {selectedOrder.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            {selectedOrder.groups.map((group) => (
              <Button
                key={group.id}
                variant={
                  group.id === selectedGroup.id ? "secondary" : "outline"
                }
                className="h-11 w-full justify-between"
                disabled={group.id === selectedGroup.id}
                onClick={() => moveProductToGroup(group.id)}
              >
                <span className="truncate">{group.name}</span>
                <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs">
                  {group.products.length}
                </span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteProduct")}</DialogTitle>
            <DialogDescription>
              {t("removeProduct", {
                product: productToDelete?.name,
                group: selectedGroup.name,
              })}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToDelete(null)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProduct}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(productToEditPar)}
        onOpenChange={(open) => {
          if (!open) {
            setProductToEditPar(null);
            setParDraft("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("editPar")}</DialogTitle>
            <DialogDescription>
              {t("updatePar", { product: productToEditPar?.name })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Input
              type="number"
              min="0"
              value={parDraft}
              onChange={(event) => setParDraft(event.target.value)}
              placeholder={t("enterPar")}
              aria-label={t("parValue")}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setProductToEditPar(null);
                setParDraft("");
              }}
            >
              {t("cancel")}
            </Button>
            <Button onClick={saveProductPar}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
