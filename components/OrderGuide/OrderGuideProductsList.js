"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  ChevronLeft,
  MoveRight,
  MoreVertical,
  Package2,
  Plus,
  ShoppingBasket,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { useCart } from "@/app/context/app-context";
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

const productImages = [
  "https://images.unsplash.com/photo-1579653853027-5b305f13a7ca?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=720&q=80",
];

function formatPrice(price, unit) {
  return `$${Number(price).toFixed(2)} / ${unit}`;
}

function touchOrder(order) {
  return {
    ...order,
    updatedAt: new Date().toISOString(),
  };
}

function ProductImage({ product, index }) {
  const image = productImages[index % productImages.length];

  return (
    <div className="relative aspect-[1.15] overflow-hidden bg-muted sm:aspect-[1.2] xl:aspect-[1.28]">
      <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,var(--muted),var(--background))] text-primary/70">
        <Package2 className="size-8 sm:size-10" />
      </div>
      <div
        role="img"
        aria-label={product.name}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
}

function EmptyProductsCard() {
  const t = useTranslations("orderGuide")
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

        <Button asChild className="mt-5 h-9">
          <Link href="/catalog">
            <Plus className="size-4" />
            {t("addProducts")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

function SavedProductCard({
  product,
  index,
  cartQuantity,
  onAddToCart,
  onIncrement,
  onDecrement,
  onChangeGroup,
  onEditPar,
  onRequestDelete,
}) {
  const t = useTranslations("orderGuide")
  const [draftQuantity, setDraftQuantity] = useState(1);
  const isInCart = cartQuantity > 0;
  const quantity = isInCart ? cartQuantity : draftQuantity;
  const parValue = product.par;

  return (
    <article className="min-w-0 overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm">
      <div className="relative">
        <Link
          href={`/catalog/${product.id}`}
          aria-label={`View details for ${product.name}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ProductImage product={product} index={index} />
        </Link>

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
      </div>

      <div className="relative space-y-1.5 p-2 lg:space-y-2 lg:p-2.5 relative">
        <div className="min-w-0 space-y-1">
          <Link
            href={`/catalog/${product.id}`}
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
            <span className="truncate">Pack Size: 1 {product.unit}</span>
          </div>
        </div>

        <p className="text-[0.95rem] font-bold lg:text-base">
          {formatPrice(product.price, product.unit)}
        </p>

        <div className="grid gap-2 min-[460px]:grid-cols-[4rem_1fr] lg:grid-cols-[4.5rem_1fr]">
          <div className="grid h-8 grid-cols-3 overflow-hidden rounded-md border bg-background">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Decrease ${product.name} quantity`}
              className="h-full rounded-none"
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
              className="h-full rounded-none"
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
        {parValue != null && parValue !== "" && (
              <p className="shrink-0 text-right leading-tight absolute right-2 top-2 flex flex-col items-center text-sm text-muted-foreground">
                {t("par")} <span className="font-medium text-xs">{parValue}</span>
              </p>
            )}
      </div>
    </article>
  );
}

export function OrderGuideProductsList({
  selectedOrder,
  selectedGroup,
  setQuickOrders,
  onBack,
}) {
  const t = useTranslations("orderGuide")
  const { items, addItem, incrementItem, decrementItem, removeItem } =
    useCart();
  const [productToMove, setProductToMove] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEditPar, setProductToEditPar] = useState(null);
  const [parDraft, setParDraft] = useState("");

  const products = selectedGroup?.products ?? [];

  const cartQuantities = useMemo(
    () => new Map(items.map((item) => [item.id, item.quantity])),
    [items],
  );

  const allProductsInCart =
    products.length > 0 &&
    products.every((product) => (cartQuantities.get(product.id) ?? 0) > 0);

  const selectedCount = products.filter(
    (product) => (cartQuantities.get(product.id) ?? 0) > 0,
  ).length;

  function handleSelectAllAndAddToCart() {
    if (products.length === 0) return;

    if (allProductsInCart) {
      products.forEach((product) => {
        if ((cartQuantities.get(product.id) ?? 0) > 0) {
          removeItem(product.id);
        }
      });
      return;
    }

    products.forEach((product) => {
      const cartQuantity = cartQuantities.get(product.id) ?? 0;

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
                group.id === selectedGroup.id
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
                group.id === selectedGroup.id
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
            if (group.id === selectedGroup.id) {
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
                products: [...group.products, productToMove],
              };
            }

            return group;
          }),
        });
      }),
    );

    setProductToMove(null);
  }

  function confirmDeleteProduct() {
    if (!productToDelete) return;

    removeFromGroup(productToDelete.id);
    setProductToDelete(null);
  }

  function openEditParDialog(product) {
    setProductToEditPar(product);
    setParDraft(
      product.par === null || product.par === undefined ? "" : String(product.par),
    );
  }

  function saveProductPar() {
    if (!productToEditPar) return;

    const nextPar = parDraft.trim();

    updateProductInGroup(productToEditPar.id, {
      par: nextPar === "" ? null : nextPar,
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
      <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="flex shrink-0 flex-col gap-2 border-b p-2 sm:flex-row sm:items-start sm:justify-between lg:p-3">
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

              <div className="mt-2 flex min-w-0 items-center gap-2 lg:mt-3">
                <h2 className="truncate text-lg font-bold lg:text-xl">
                  {selectedGroup.name}
                </h2>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {products.length} items
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto">
            <Button asChild variant="outline" size="sm" className="h-8">
              <Link href="/catalog">
                <Plus className="size-4" />
                {t("addProducts")}
              </Link>
            </Button>

            {products.length > 0 && (
              <Button
                size="sm"
                variant={allProductsInCart ? "secondary" : "default"}
                onClick={handleSelectAllAndAddToCart}
                className="h-8 flex items-center gap-1"
              >
                <ShoppingCart className="size-4" />
                {allProductsInCart ? `Selected (${selectedCount})` : "Select All"}
              </Button>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 p-2 lg:p-3">
          {products.length === 0 ? (
            <EmptyProductsCard />
          ) : (
            <div className="no-scrollbar h-full overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-3 2xl:grid-cols-4">
                {products.map((product, index) => (
                  <SavedProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    cartQuantity={cartQuantities.get(product.id) ?? 0}
                    onAddToCart={addItem}
                    onIncrement={incrementItem}
                    onDecrement={decrementItem}
                    onChangeGroup={setProductToMove}
                    onEditPar={openEditParDialog}
                    onRequestDelete={setProductToDelete}
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
              {t("removeProduct", { product: productToDelete?.name, group: selectedGroup.name })}
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
              value={parDraft}
              onChange={(event) => setParDraft(event.target.value)}
              placeholder={t("enterPar")}
              aria-label={t("parValue")}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setProductToEditPar(null);
              setParDraft("");
            }}>
              {t("cancel")}
            </Button>
            <Button onClick={saveProductPar}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
