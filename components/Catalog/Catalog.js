"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Package2,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";

import {
  useCart,
  useCatalog,
  useQuickOrders,
} from "@/app/context/app-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const productImages = [
  "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=720&q=80",
];

const pageSizeOptions = [10, 20, 40, 60];
const sortOptions = ["Name A-Z", "Price Low to High", "Price High to Low"];

function formatPrice(price, unit) {
  return `$${Number(price).toFixed(2)} / ${unit}`;
}

function SelectMenu({ label, value, options, onChange, className }) {
  return (
    <label
      className={cn(
        "grid min-w-0 gap-1.5 text-xs font-semibold text-foreground sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-2",
        className,
      )}
    >
      <span className="whitespace-nowrap">{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-9 w-full justify-between rounded-md px-2 text-xs font-semibold lg:h-10 lg:px-3"
          >
            <span className="truncate">{value}</span>
            <ChevronDown className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {options.map((option) => (
            <DropdownMenuItem key={option} onSelect={() => onChange(option)}>
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </label>
  );
}

function ProductImage({ product, index }) {
  const image = productImages[index % productImages.length];

  return (
    <div className="relative aspect-[1.25] overflow-hidden bg-muted sm:aspect-[1.35] xl:aspect-[1.45]">
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

function ProductCard({
  product,
  index,
  cartQuantity,
  isInQuickOrder,
  onAdd,
  onIncrement,
  onDecrement,
  onOpenQuickOrder,
}) {
  const [draftQuantity, setDraftQuantity] = useState(1);
  const isInCart = cartQuantity > 0;
  const quantity = isInCart ? cartQuantity : draftQuantity;

  return (
    <article className="min-w-0 overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm">
      <div className="relative">
        <ProductImage product={product} index={index} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={`Quick Order ${product.name}`}
                className="absolute right-1.5 top-1.5 rounded-full bg-background/95 text-muted-foreground shadow-sm hover:text-primary sm:right-2 sm:top-2"
                onClick={() => onOpenQuickOrder(product)}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    isInQuickOrder && "fill-primary text-primary",
                  )}
                />
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              <p>Add to Quick Order</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2 p-2 lg:space-y-3 lg:p-3">
        <div className="min-w-0 space-y-1">
          <h3 className="truncate text-xs font-bold lg:text-sm">
            {product.name}
          </h3>
          <p className="truncate text-[0.68rem] font-semibold text-muted-foreground lg:text-xs">
            {product.subcategory}
          </p>
          <div className="grid gap-0.5 text-[0.62rem] font-medium text-muted-foreground lg:text-[0.7rem]">
            <span className="truncate">Pack Size: 1 {product.unit}</span>
          </div>
        </div>

        <p className="text-sm font-bold lg:text-base">
          {formatPrice(product.price, product.unit)}
        </p>

        <div className="grid gap-2 min-[460px]:grid-cols-[4.25rem_1fr] lg:grid-cols-[4.75rem_1fr]">
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
              -
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
              +
            </Button>
          </div>

          <Button
            variant={isInCart ? "secondary" : "default"}
            className="h-8 min-w-0 rounded-md px-2 text-[0.68rem] font-bold lg:text-xs"
            onClick={() => {
              if (!isInCart) {
                onAdd(product, draftQuantity);
              }
            }}
          >
            <ShoppingCart />
            <span className="truncate">
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </span>
          </Button>
        </div>
      </div>
    </article>
  );
}

function isProductInDefaultGroup(order, productId) {
  return Boolean(
    order.groups[0]?.products.some((product) => product.id === productId),
  );
}

function QuickOrderPickerDialog({
  product,
  quickOrders,
  open,
  onOpenChange,
  onAdd,
  onRemove,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Quick Order</DialogTitle>
          <DialogDescription>
            Select the quick orders where this product should appear.
          </DialogDescription>
        </DialogHeader>

        {!product ? null : quickOrders.length === 0 ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Create a quick order first, then return to the catalog to add
              products.
            </p>
            <Button asChild>
              <Link href="/quick-order">Create Quick Order</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2 py-2">
            <p className="truncate text-sm font-semibold">{product.name}</p>

            <div className="space-y-2">
              {quickOrders.map((order) => {
                const checked = isProductInDefaultGroup(order, product.id);

                return (
                  <label
                    key={order.id}
                    className="flex cursor-pointer items-start gap-3 rounded-md border bg-background p-3 text-sm transition-colors hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        if (event.target.checked) {
                          onAdd(order.id, product);
                          return;
                        }

                        onRemove(order.id, product.id);
                      }}
                      className="mt-0.5 size-4 accent-primary"
                    />
                    <span className="grid min-w-0 gap-1">
                      <span className="truncate font-semibold">{order.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        Default Group
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getVisiblePages(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  return [...pages].sort((a, b) => a - b);
}

export function Catalog() {
  const { items, addItem, incrementItem, decrementItem } = useCart();
  const { catalog } = useCatalog();
  const {
    quickOrders,
    addProductToQuickOrder,
    removeProductFromQuickOrder,
  } = useQuickOrders();
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);
  const categoryNames = ["All", ...catalog.map((category) => category.name)];
  const [categoryName, setCategoryName] = useState("All");
  const activeCategory =
    categoryName === "All"
      ? null
      : catalog.find((category) => category.name === categoryName);

  const subcategoryNames =
    categoryName === "All"
      ? ["All"]
      : ["All", ...(activeCategory?.subcategories.map((s) => s.name) ?? [])];

  const [subcategoryName, setSubcategoryName] = useState("All");
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const products = useMemo(() => {
    let filtered = [];

    if (categoryName === "All") {
      filtered = catalog.flatMap((category) =>
        category.subcategories.flatMap((subcategory) =>
          subcategory.products.map((product) => ({
            ...product,
            category: category.name,
            subcategory: subcategory.name,
          })),
        ),
      );
    } else if (subcategoryName === "All") {
      filtered =
        activeCategory?.subcategories.flatMap((subcategory) =>
          subcategory.products.map((product) => ({
            ...product,
            category: activeCategory.name,
            subcategory: subcategory.name,
          })),
        ) ?? [];
    } else {
      const selectedSubcategory = activeCategory?.subcategories.find(
        (subcategory) => subcategory.name === subcategoryName,
      );

      filtered = selectedSubcategory?.products ?? [];
    }

    if (sortBy === "Price Low to High") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price High to Low") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [catalog, categoryName, subcategoryName, sortBy, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = products.length === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, products.length);
  const visibleProducts = products.slice(startIndex, endIndex);
  const visiblePages = getVisiblePages(safePage, totalPages);
  const cartQuantities = useMemo(
    () => new Map(items.map((item) => [item.id, item.quantity])),
    [items],
  );
  const quickOrderProductIds = useMemo(
    () =>
      new Set(
        quickOrders.flatMap((order) =>
          order.groups[0]?.products.map((product) => product.id) ?? [],
        ),
      ),
    [quickOrders],
  );

  function handleCategoryChange(nextCategoryName) {
    setCategoryName(nextCategoryName);
    setSubcategoryName("All");
    setCurrentPage(1);
  }

  function handleSubcategoryChange(nextSubcategoryName) {
    setSubcategoryName(nextSubcategoryName);
    setCurrentPage(1);
  }

  function handleSortChange(nextSortBy) {
    setSortBy(nextSortBy);
    setCurrentPage(1);
  }

  function handlePageSizeChange(nextPageSize) {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  }

  return (
    <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden p-2 sm:p-3 lg:p-4">
      <section className="min-w-0 shrink-0 space-y-3 rounded-lg border bg-background p-2 shadow-sm lg:p-4">
        <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid min-w-0 grid-cols-2 gap-2 lg:w-[min(100%,40rem)]">
            <SelectMenu
              label="Category"
              value={categoryName}
              options={categoryNames}
              onChange={handleCategoryChange}
              className="lg:max-w-72"
            />
            <SelectMenu
              label="Subcategory"
              value={subcategoryName}
              options={subcategoryNames}
              onChange={handleSubcategoryChange}
              className="lg:max-w-80"
            />
          </div>

          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_7rem] items-end gap-2 sm:grid-cols-[minmax(0,16rem)_8rem] sm:justify-end lg:flex-1 lg:grid-cols-[18rem_8rem] lg:gap-3">
            <SelectMenu
              label="Sort by"
              value={sortBy}
              options={sortOptions}
              onChange={handleSortChange}
              className="min-w-0 sm:w-64 lg:w-72"
            />
            <Button
              variant="outline"
              className="relative h-9 min-w-0 justify-start rounded-md text-xs font-semibold sm:w-32 lg:h-10"
            >
              <SlidersHorizontal />
              Filters
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground">
                2
              </span>
            </Button>
          </div>
        </div>
      </section>

      <div className="no-scrollbar mt-3 min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
        <div className="mb-2 flex min-w-0 items-center justify-between gap-3 text-xs text-muted-foreground sm:text-sm">
          <p className="truncate">
            Showing {products.length === 0 ? 0 : startIndex + 1} to {endIndex}{" "}
            of {products.length} products
          </p>
        </div>

        <section className="grid min-w-0 auto-rows-min grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6">
          {visibleProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={startIndex + index}
              cartQuantity={cartQuantities.get(product.id) ?? 0}
              isInQuickOrder={quickOrderProductIds.has(product.id)}
              onAdd={addItem}
              onIncrement={incrementItem}
              onDecrement={decrementItem}
              onOpenQuickOrder={setQuickOrderProduct}
            />
          ))}
        </section>

        <div className="mt-6 flex flex-row items-center justify-between gap-2 pb-1 text-xs text-muted-foreground  sm:text-sm">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous page"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft />
            </Button>
            {visiblePages.map((page, index) => {
              const previousPage = visiblePages[index - 1];
              const showGap = previousPage && page - previousPage > 1;

              return (
                <span key={page} className="contents">
                  {showGap ? (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Skipped pages"
                      disabled
                    >
                      ...
                    </Button>
                  ) : null}
                  <Button
                    variant={page === safePage ? "default" : "outline"}
                    size="icon-sm"
                    aria-label={`Page ${page}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                </span>
              );
            })}
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next page"
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
            >
              <ChevronRight />
            </Button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span>Show</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 min-w-14 justify-between rounded-md lg:h-9 lg:min-w-16"
                >
                  {pageSize}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {pageSizeOptions.map((amount) => (
                  <DropdownMenuItem
                    key={amount}
                    onSelect={() => handlePageSizeChange(amount)}
                  >
                    {amount}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span>per page</span>
          </div>
        </div>
      </div>

      <QuickOrderPickerDialog
        product={quickOrderProduct}
        quickOrders={quickOrders}
        open={Boolean(quickOrderProduct)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setQuickOrderProduct(null);
        }}
        onAdd={addProductToQuickOrder}
        onRemove={removeProductFromQuickOrder}
      />
    </main>
  );
}
