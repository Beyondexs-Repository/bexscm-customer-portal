"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Package2, ShoppingCart, Star } from "lucide-react";
import { useQuickOrders } from "@/app/context/app-context";
import { resolveItemImageUrl } from "@/lib/api/itemsApi";
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { OrderGuidePickerDialog, isProductInGroup } from "./OrderGuidePickerDialog";

export function ProductImage({ product, compact = false }) {
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
    <div className={compact ? "relative size-14 shrink-0 overflow-hidden rounded-md bg-muted" : "relative aspect-[1.25] overflow-hidden bg-muted sm:aspect-[1.35] xl:aspect-[1.45]"}>
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

export function CatalogCard({ product, selected, onSelect, quantity, isInCart, isAdding, onQuantityChange, onAddToCart }) {
  const t = useTranslations("catalog");
  const { quickOrders, addProductToQuickOrder, removeProductFromQuickOrder } = useQuickOrders();
  const [orderGuideOpen, setOrderGuideOpen] = useState(false);
  const isInOrderGuide = quickOrders.some((order) =>
    order.groups.some((group) => isProductInGroup(group, product.id)),
  );

  return (
    <article className="min-w-0 overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm">
      <div className="relative">
        <input
          type="checkbox"
          aria-label={`Select ${product.name}`}
          checked={selected}
          onChange={onSelect}
          className="absolute left-2 top-2 z-10 size-4 cursor-pointer accent-primary"
        />
        <div className="block">
          <ProductImage product={product} />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={`Order Guide ${product.name}`}
                className={cn(
                  "absolute right-1.5 top-1.5 rounded-full border bg-card text-muted-foreground shadow-md hover:text-primary dark:border-border dark:bg-card hover:dark:bg-card/60 sm:right-2 sm:top-2",
                  isInOrderGuide && "border-sky-500 bg-sky-500 text-white hover:bg-sky-500 hover:text-white dark:border-sky-400 dark:bg-sky-500 dark:text-white dark:hover:bg-sky-500 dark:hover:text-white",
                )}
                onClick={() => setOrderGuideOpen(true)}
              >
                <Star className={cn("h-4 w-4", isInOrderGuide && "fill-current")} />
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              <p>{t("addToOrderGuide")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2 p-2 lg:space-y-3 lg:p-3">
        <div className="min-w-0 space-y-1">
          <p className="block truncate text-xs text-muted-foreground uppercase font-bold lg:text-sm">
            {product.brand}
          </p>
          <p className="block truncate text-xs font-bold lg:text-sm">
            {product.name}
          </p>
          <p className="truncate text-[0.68rem] font-semibold text-muted-foreground lg:text-xs">
            {product.category}
          </p>
          <div className="grid gap-0.5 text-[0.62rem] font-medium text-muted-foreground lg:text-[0.7rem]">
            <span className="truncate">{t("packSize", { unit: product.unit })}</span>
          </div>
        </div>

        <p className="text-sm font-bold lg:text-base">
          {`${Number(product.price).toFixed(2)} / ${product.unit}`}
        </p>

        <div className="grid gap-1.5 grid-cols-[3.8rem_1fr] lg:grid-cols-[4.25rem_1fr]">
          <div className="grid h-8 grid-cols-3 overflow-hidden rounded-md border bg-background">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Decrease ${product.name} quantity`}
              disabled={isAdding || (!isInCart && quantity === 1)}
              className="h-full w-full min-w-0 rounded-none bg-background p-0 text-foreground hover:bg-muted"
              onClick={() => onQuantityChange(product.id, -1)}
            >
              <span className="grid size-full place-items-center">-</span>
            </Button>
            <Input
              value={quantity}
              readOnly
              aria-label={`${product.name} quantity`}
              className="h-full min-w-0 rounded-none border-0 bg-muted/50 px-0 text-center text-xs font-normal text-foreground shadow-none dark:bg-muted/50 focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Increase ${product.name} quantity`}
              disabled={isAdding}
              className="h-full w-full min-w-0 rounded-none bg-background p-0 text-foreground hover:bg-muted"
              onClick={() => onQuantityChange(product.id, 1)}
            >
              <span className="grid size-full place-items-center">+</span>
            </Button>
          </div>

          <Button
            variant={isInCart ? "secondary" : "default"}
            disabled={isAdding || isInCart}
            className="h-8 min-w-0 rounded-md px-2 text-[0.68rem] font-bold lg:text-xs"
            onClick={() => onAddToCart(product)}
          >
            {isAdding ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ShoppingCart />
            )}
            <span className="truncate">
              {isInCart
                ? t("addedToCart")
                : isAdding
                  ? "Adding..."
                  : t("addToCart")}
            </span>
          </Button>
        </div>
      </div>

      <OrderGuidePickerDialog
        product={product}
        quickOrders={quickOrders}
        open={orderGuideOpen}
        onOpenChange={setOrderGuideOpen}
        onAdd={addProductToQuickOrder}
        onRemove={removeProductFromQuickOrder}
      />
    </article>
  );
}

