"use client";

import { useTranslations } from "next-intl";
import { Loader2, ShoppingCart } from "lucide-react";
import { ProductImage } from "./CatalogCard";

const buttonClass =
  "inline-flex h-8 shrink-0 whitespace-nowrap items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";


export function CatalogListView({ products, selectedIds, onSelect, getCartState, onQuantityChange, onAddToCart }) {
  const t = useTranslations("catalog");
  return (
    <section aria-label="Catalog list" className="min-w-0">
      <div className="lg:overflow-x-auto lg:rounded-lg lg:border">
        <table className="block w-full text-left text-sm lg:table lg:min-w-[880px]">
          <thead className="hidden border-b bg-muted/50 text-xs text-muted-foreground lg:table-header-group">
            <tr>
              <th scope="col" className="w-10 px-3 py-3">
                <span className="sr-only">Select product</span>
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Products
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Category
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Pack Size
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Price
              </th>
              <th scope="col" className="w-56 px-3 py-3 font-medium">
                Quantity &amp; Order
              </th>
            </tr>
          </thead>
          <tbody className="grid gap-2 lg:table-row-group lg:divide-y">
            {products.map((product) => {
              const selected = selectedIds.includes(product.id);
              const { quantity, isInCart, isAdding } = getCartState(product.id);
              return (
                <tr
                  key={product.id}
                  className={`relative grid min-w-0 grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2 rounded-lg border p-2.5 sm:gap-x-3 lg:table-row lg:rounded-none lg:border-0 lg:p-0 ${selected ? "border-primary/50 bg-primary/5" : "bg-card hover:bg-muted/30"}`}
                >
                  <td className="self-start pt-1 lg:px-3 lg:py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${product.name}`}
                      checked={selected}
                      className="size-4 cursor-pointer accent-primary"
                      onChange={() => onSelect(product.id)}
                    />
                  </td>
                  <td className="min-w-0 lg:px-3 lg:py-3">
                    <div className="flex items-start gap-3 lg:items-center">
                      <ProductImage product={product} compact />
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-start justify-between gap-2">
                          <p className="min-w-0 flex-1 break-words text-xs font-semibold lg:truncate lg:text-sm">{product.name}</p>
                          <p className="shrink-0 whitespace-nowrap text-sm font-bold lg:hidden">${product.price.toFixed(2)}</p>
                        </div>
                        <span className="mt-1 inline-block rounded bg-secondary px-1.5 text-[10px] text-secondary-foreground lg:hidden">{product.category}</span>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Item code: {product.id}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground lg:hidden">{t("packSize", { unit: product.unit })}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-3 text-muted-foreground lg:table-cell">
                    {product.category}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-3 text-muted-foreground lg:table-cell">
                    {t("packSize", { unit: product.unit })}
                  </td>
                  <td className="hidden px-3 py-3 font-semibold lg:table-cell">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="col-start-2 min-w-0 pt-2 pl-[68px] lg:px-3 lg:py-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-center gap-2 lg:flex">
                      <div className="grid h-8 min-w-0 grid-cols-3 overflow-hidden rounded-md border bg-background text-foreground lg:w-20 lg:shrink-0">
                        <button
                          type="button"
                          className="grid h-full min-w-0 place-items-center bg-background p-0 text-foreground hover:bg-muted disabled:opacity-40"
                          aria-label={`Decrease ${product.name} quantity`}
                          disabled={isAdding || (!isInCart && quantity === 1)}
                          onClick={() => onQuantityChange(product.id, -1)}
                        >
                          −
                        </button>
                        <output
                          aria-label={`${product.name} quantity`}
                          className="grid h-full min-w-0 place-items-center bg-muted/50 text-center text-xs text-foreground"
                        >
                          {quantity}
                        </output>
                        <button
                          type="button"
                          className="grid h-full min-w-0 place-items-center bg-background p-0 text-foreground hover:bg-muted"
                          aria-label={`Increase ${product.name} quantity`}
                          disabled={isAdding}
                          onClick={() => onQuantityChange(product.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={
                          isInCart
                            ? `${product.name} added to cart`
                            : `Add ${product.name} to cart`
                        }
                        disabled={isAdding || isInCart}
                        className={`${buttonClass} min-w-0 max-lg:gap-1 max-lg:px-1 max-lg:text-[10px] lg:min-w-28 ${isInCart ? "bg-secondary text-secondary-foreground" : "border-primary bg-primary text-primary-foreground hover:bg-primary/90"}`}
                        onClick={() => onAddToCart(product)}
                      >
                        {isAdding ? <Loader2 className="size-3.5 animate-spin" /> : <ShoppingCart className="size-3.5" />}
                        {isInCart ? t("addedToCart") : isAdding ? "Adding..." : t("addToCart")}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
