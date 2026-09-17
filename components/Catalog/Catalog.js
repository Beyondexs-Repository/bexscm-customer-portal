"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock3,
  Star,
  Package2,
  RotateCcw,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Loader2,
  Mic,
} from "lucide-react";
import { toast } from "sonner";

import staticItems from "@/data/livedata/Items.json";
import { fetchItemsApi, resolveItemImageUrl } from "@/lib/api/itemsApi";
import { useCart, useQuickOrders } from "@/app/context/app-context";
import { Button } from "@/components/ui/button";
import { OrderGuidePickerDialog } from "@/components/Catalog/OrderGuidePickerDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import VoiceSearch from "@/components/ai/VoiceSearch";
import { askVoiceAi } from "@/components/ai/voiceOpenAiClient";



const pageSizeOptions = [10, 20, 40, 60];
const sortOptions = ["Name A-Z", "Price Low to High", "Price High to Low"];
const DEFAULT_SORT = sortOptions[0];
const CUTOFF_TIME = "8:00 AM 6/6";

const formatDeliveryDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

function formatPrice(price, unit) {
  return `$${Number(price).toFixed(2)} / ${unit}`;
}

function pluralizeFilterLabel(label) {
  return label.toLowerCase().endsWith("y")
    ? `${label.toLowerCase().slice(0, -1)}ies`
    : `${label.toLowerCase()}s`;
}

function SelectMenu({
  label,
  value,
  options,
  onChange,
  className,
  searchable = false,
}) {
  const [open, setOpen] = useState(false);
  const [optionSearch, setOptionSearch] = useState("");
  const searchPlaceholder = `Search ${label.toLowerCase()}...`;
  const emptyStateLabel = pluralizeFilterLabel(label);
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.toLowerCase().includes(optionSearch.trim().toLowerCase()),
      )
    : options;

  return (
    <div
      className={cn(
        "grid min-w-0 gap-1.5 text-xs font-semibold text-foreground sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-2",
        className,
      )}
    >
      <span className="whitespace-nowrap">{label}</span>
      <DropdownMenu
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setOptionSearch("");
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-9 w-full min-w-0 justify-between rounded-md px-2 text-xs font-semibold lg:h-10 lg:px-3"
          >
            <span className="truncate">{value}</span>
            <ChevronDown className="shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {searchable && (
            <div className="border-b p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={optionSearch}
                  onChange={(event) => setOptionSearch(event.target.value)}
                  onKeyDown={(event) => event.stopPropagation()}
                  placeholder={searchPlaceholder}
                  className="h-8 rounded-md pl-8 text-xs"
                />
              </div>
            </div>
          )}
          {filteredOptions.map((option) => (
            <DropdownMenuItem key={option} onSelect={() => onChange(option)}>
              {option}
            </DropdownMenuItem>
          ))}
          {filteredOptions.length === 0 && (
            <div className="px-2 py-2 text-xs font-medium text-muted-foreground">
              No {emptyStateLabel} found
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
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
    <div className="relative aspect-[1.25] overflow-hidden bg-muted sm:aspect-[1.35] xl:aspect-[1.45]">
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

function ProductCard({
  product,
}) {
  const t = useTranslations("catalog")
  const {
    items: cartItems,
    addItem,
    incrementItem,
    decrementItem,
  } = useCart()
  const {
    quickOrders,
    addProductToQuickOrder,
    removeProductFromQuickOrder,
  } = useQuickOrders()
  const [draftQuantity, setDraftQuantity] = useState(1);
  const [orderGuideOpen, setOrderGuideOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [cardVoiceStatus, setCardVoiceStatus] = useState("idle");

  const cartItem = cartItems.find((item) => item.id === product.id);
  const isInCart = Boolean(cartItem);
  const quantity = cartItem?.quantity ?? draftQuantity;
  const isInOrderGuide = quickOrders.some((order) =>
    order.groups.some((group) =>
      group.products.some((item) => item.id === product.id),
    ),
  );

  function handleProductVoiceAdd() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    setCardVoiceStatus("listening");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setCardVoiceStatus("processing");

        let qty = draftQuantity;
        const numberWords = {
          one: 1, two: 2, three: 3, four: 4, five: 5,
          six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
        };

        const lower = transcript.toLowerCase();
        const match = lower.match(/\d+/);
        if (match) {
          qty = Math.max(1, parseInt(match[0], 10));
        } else {
          for (const [word, num] of Object.entries(numberWords)) {
            if (lower.includes(word)) {
              qty = num;
              break;
            }
          }
        }

        try {
          const liveItems = await fetchItemsApi();
          const liveItem = Array.isArray(liveItems)
            ? liveItems.find(
                (item) => (item.itemnmbr || item.ITEMNMBR)?.trim() === product.id,
              )
            : null;

          const finalProduct = liveItem
            ? {
                ...product,
                price: Number(liveItem.qtybsuom ?? liveItem.QTYBSUOM ?? liveItem.avgWeight) || product.price,
                unit: (liveItem.uomschdl || liveItem.UOMSCHDL)?.trim() || product.unit,
              }
            : product;

          addItem(finalProduct, qty);
          toast.success(`Added ${qty} × ${product.name} to cart via voice!`);
        } catch {
          addItem(product, qty);
          toast.success(`Added ${qty} × ${product.name} to cart via voice!`);
        }
      }
      setCardVoiceStatus("idle");
    };

    recognition.onerror = () => {
      setCardVoiceStatus("idle");
    };

    recognition.onend = () => {
      setCardVoiceStatus("idle");
    };

    try {
      recognition.start();
    } catch {
      setCardVoiceStatus("idle");
    }
  }

  async function handleAddToCart() {
    if (isInCart || isAdding) return;

    setIsAdding(true);
    try {
      const liveItems = await fetchItemsApi();
      const liveItem = Array.isArray(liveItems)
        ? liveItems.find(
            (item) =>
              (item.itemnmbr || item.ITEMNMBR)?.trim() === product.id,
          )
        : null;

      const finalProduct = liveItem
        ? {
            ...product,
            price: Number(liveItem.qtybsuom ?? liveItem.QTYBSUOM ?? liveItem.avgWeight) || product.price,
            unit: (liveItem.uomschdl || liveItem.UOMSCHDL)?.trim() || product.unit,
          }
        : product;

      addItem(finalProduct, draftQuantity);
    } catch (error) {
      console.warn("Failed to fetch latest item details, adding product:", error);
      addItem(product, draftQuantity);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <article className="min-w-0 overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm">
      <div className="relative">
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
          {formatPrice(product.price, product.unit)}
        </p>

        <div className="grid gap-1.5 grid-cols-[3.8rem_1fr] lg:grid-cols-[4.25rem_1fr]">
          <div className="grid h-8 grid-cols-3 overflow-hidden rounded-md border bg-background">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Decrease ${product.name} quantity`}
              className="h-full rounded-none"
              onClick={() => {
                if (isInCart) {
                  decrementItem(product.id);
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
                  incrementItem(product.id);
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
            disabled={isAdding}
            className="h-8 min-w-0 rounded-md px-2 text-[0.68rem] font-bold lg:text-xs"
            onClick={handleAddToCart}
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

function MobileDeliveryInfo() {
  const t = useTranslations("catalog")
  const today = startOfDay(new Date());
  const calendarRef = useRef(null);
  const calendarTriggerRef = useRef(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(() => new Date(2026, 5, 12));
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(2026, 5, 1),
  );

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const dayOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: dayOffset + daysInMonth }, (_, index) => {
      if (index < dayOffset) {
        return null;
      }

      return new Date(year, month, index - dayOffset + 1);
    });
  }, [calendarMonth]);

  const calendarTitle = calendarMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!calendarOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      const target = event.target;

      if (
        calendarRef.current?.contains(target) ||
        calendarTriggerRef.current?.contains(target)
      ) {
        return;
      }

      setCalendarOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [calendarOpen]);

  return (
    <div className="relative grid grid-cols-2 divide-x rounded-md py-1 md:hidden">
      <button
        ref={calendarTriggerRef}
        type="button"
        className="px-3 py-0  text-center transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setCalendarOpen((open) => !open)}
        aria-expanded={calendarOpen}
      >
        <div className="flex items-center justify-center gap-2 text-primary">
          <CalendarDays className="size-4" />
          <span className="text-[11px] font-medium text-muted-foreground">
            {t("deliveryDate")}
          </span>
        </div>
        <p className="mt-1 text-sm font-bold">
          {formatDeliveryDate(deliveryDate)}
        </p>
      </button>

      <div className="px-3 py-0">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Clock3 className="size-4" />
          <span className="text-[11px] font-medium text-muted-foreground">
            {t("cutoffTime")}
          </span>
        </div>
        <p className="mt-1 text-sm text-center font-bold">{CUTOFF_TIME}</p>
      </div>

      {calendarOpen && (
        <div
          ref={calendarRef}
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
              onClick={() =>
                setCalendarMonth(
                  new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() - 1,
                    1,
                  ),
                )
              }
            >
              {t("prev")}
            </button>
            <p className="text-sm font-semibold">{calendarTitle}</p>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
              onClick={() =>
                setCalendarMonth(
                  new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() + 1,
                    1,
                  ),
                )
              }
            >
              {t("next")}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const disabled = date ? startOfDay(date) < today : true;
              const selected = date ? isSameDay(date, deliveryDate) : false;

              return date ? (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={disabled}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors",
                    selected && "bg-primary text-primary-foreground",
                    !selected && !disabled && "hover:bg-muted",
                    disabled && "cursor-not-allowed text-muted-foreground/35",
                  )}
                  onClick={() => {
                    setDeliveryDate(date);
                    setCalendarOpen(false);
                  }}
                >
                  {date.getDate()}
                </button>
              ) : (
                <span key={`empty-${index}`} />
              );
            })}
          </div>
        </div>
      )}
    </div>
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

function getProductSearchText(product) {
  return [
    product.id,
    product.sku,
    product.name,
    product.brand,
    product.category,
    product.subcategory,
    product.unit,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function findProduct(products, searchText) {
  if (!searchText) return null;

  const rawSearch = searchText.trim().toLowerCase();
  // Strip action prefixes and suffixes (e.g. "add chicken to cart" -> "chicken")
  const search = rawSearch
    .replace(/^(add|search|find|buy|put|get|please)\s+/g, "")
    .replace(/\s+(to\s+cart|in\s+cart|please)$/g, "")
    .trim();

  if (!search) return null;

  return (
    products.find((product) => String(product.id).toLowerCase() === search) ||
    products.find((product) => product.name.toLowerCase() === search) ||
    products.find((product) => getProductSearchText(product).includes(search)) ||
    products.find((product) => search.split(/\s+/).some((term) => term.length > 2 && getProductSearchText(product).includes(term))) ||
    products.find((product) => getProductSearchText(product).includes(rawSearch)) ||
    null
  );
}

function getVisibleProductsForAi(products) {
  return products.map((product, index) => ({
    number: index + 1,
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    unit: product.unit,
  }));
}

function CatalogFilterControls({
  searchQuery,
  categoryName,
  categoryNames,
  subcategoryName,
  subcategoryNames,
  sortBy,
  activeFilterCount,
  voiceStatus,
  onVoiceStatusChange,
  onVoiceTranscript,
  onSearchChange,
  onCategoryChange,
  onSubcategoryChange,
  onSortChange,
  onClearAll,
  layout = "desktop",
}) {
  const isMobile = layout === "mobile";
  const t = useTranslations("catalog");

  return (
    <div className="min-w-0 space-y-4">
      <div
        className={cn(
          "grid min-w-0 gap-2",
          isMobile
            ? "grid-cols-1"
            : "sm:grid-cols-[minmax(0,1fr)_8.5rem_auto]",
        )}
      >
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={t("searchProducts")}
            className="h-10 rounded-md pl-9 text-sm"
          />
          <VoiceSearch
            voiceStatus={voiceStatus}
            onVoiceStatusChange={onVoiceStatusChange}
            onTranscript={onVoiceTranscript}
          />
        </div>

        <Button
          variant="outline"
          className="relative mt-1 h-10 min-w-0 justify-start rounded-md text-xs font-semibold sm:mt-0"
        >
          <SlidersHorizontal className="shrink-0" />
          <span className="truncate">{t("filters")}</span>
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {!isMobile && (
          <Button
            variant="ghost"
            className="h-10 justify-start px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
            onClick={onClearAll}
            disabled={activeFilterCount === 0}
          >
            <RotateCcw className="size-4" />
            {t("clearAll")}
          </Button>
        )}
      </div>

      <div
        className={cn(
          "grid min-w-0 gap-2",
          isMobile ? "grid-cols-2" : "md:grid-cols-3 md:gap-3",
        )}
      >
        <SelectMenu
          label={t("category")}
          value={categoryName}
          options={categoryNames}
          onChange={onCategoryChange}
          searchable
        />
        <SelectMenu
          label={t("subcategory")}
          value={subcategoryName}
          options={subcategoryNames}
          onChange={onSubcategoryChange}
          searchable
        />
        <SelectMenu
          label={t("sortBy")}
          value={sortBy}
          options={sortOptions}
          onChange={onSortChange}
        />

        {isMobile && (
          <Button
            variant="outline"
            className="mt-auto h-9 min-w-0 justify-start rounded-md text-xs font-semibold"
          >
            <SlidersHorizontal className="shrink-0" />
            <span className="truncate">{t("filters")}</span>
          </Button>
        )}
      </div>

      {isMobile && (
        <Button
          variant="ghost"
          className="h-9 w-full justify-center text-xs font-semibold text-muted-foreground hover:text-foreground"
          onClick={onClearAll}
          disabled={activeFilterCount === 0}
        >
          <RotateCcw className="size-4" />
          {t("clearAll")}
        </Button>
      )}
    </div>
  );
}

export function Catalog() {
  const t = useTranslations("catalog")
  const {
    items: cartItems,
    addItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();

  const [rawItems, setRawItems] = useState(staticItems);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveItems() {
      try {
        const apiItems = await fetchItemsApi();
        if (isMounted && Array.isArray(apiItems) && apiItems.length > 0) {
          setRawItems(apiItems);
        }
      } catch (err) {
        console.warn("Failed to fetch live items in Catalog, using fallback:", err);
      }
    }
    loadLiveItems();
    return () => {
      isMounted = false;
    };
  }, []);

  const catalog = useMemo(() => {
    const categories = new Map();

    rawItems.forEach((item) => {
      const categoryName = (item.MainGroup || item.mainGroup)?.trim() || "Other";
      const subcategoryName = (item["Sub-Group"] || item.subGroup || item.SubGroup)?.trim() || "Other";
      const category = categories.get(categoryName) ?? {
        name: categoryName,
        subcategories: new Map(),
      };
      const products = category.subcategories.get(subcategoryName) ?? [];

      const id = (item.ITEMNMBR || item.itemnmbr)?.trim() || "";
      const brand = (item.ppc_Brand || item.brand || item.itmshnam)?.trim() || "";
      const name = (item.ItemName || item.itemName || item.ITEMDESC || item.itemdesc)?.trim() || "";
      const unit = (item.UOMSCHDL || item.uomschdl)?.trim() || "unit";
      const price = Number(item.QTYBSUOM ?? item.qtybsuom ?? item.avgWeight) || 0;
      const rawImage = item.image ?? item.Image ?? item.IMAGE;
      const resolvedImg = resolveItemImageUrl(rawImage);
      const image = resolvedImg || getCategoryPlaceholderImage(categoryName);

      products.push({
        id,
        brand,
        name,
        sku: id,
        unit,
        price,
        category: categoryName,
        subcategory: subcategoryName,
        image,
      });
      category.subcategories.set(subcategoryName, products);
      categories.set(categoryName, category);
    });

    return Array.from(categories.values()).map((category) => ({
      name: category.name,
      subcategories: Array.from(category.subcategories, ([name, products]) => ({
        name,
        products,
      })),
    }));
  }, [rawItems]);
  const categoryNames = ["All", ...catalog.map((category) => category.name)];
  const allProducts = useMemo(
    () =>
      catalog.flatMap((category) =>
        category.subcategories.flatMap((subcategory) =>
          subcategory.products.map((product) => ({
            ...product,
            category: category.name,
            subcategory: subcategory.name,
          })),
        ),
      ),
    [catalog],
  );
  const [voiceProducts, setVoiceProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("All");
  const activeCategory =
    categoryName === "All"
      ? null
      : catalog.find((category) => category.name === categoryName);

  const subcategoryNames =
    categoryName === "All"
      ? ["All"]
      : ["All", ...(activeCategory?.subcategories.map((subcategory) => subcategory.name) ?? [])];

  const [subcategoryName, setSubcategoryName] = useState("All");
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("idle");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const catalogScrollRef = useRef(null);

  function scrollCatalogToTop() {
    catalogScrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const searchDelay = window.setTimeout(() => {
      setAppliedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 1000);

    return () => window.clearTimeout(searchDelay);
  }, [searchQuery]);


  const products = useMemo(() => {
    let filtered = [];
    if (voiceProducts.length > 0) {
      filtered = [...voiceProducts];
    } else if (categoryName === "All") {
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
 
    const normalizedSearch = appliedSearchQuery.trim().toLowerCase();
 
    if(normalizedSearch && voiceProducts.length === 0) {
      filtered = filtered.filter((product) =>
        [
          product.name,
          product.category,
          product.subcategory,
          product.unit,
          product.id,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearch),
          ),
      );
    }
 
    if (sortBy === "Price Low to High") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price High to Low") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
 
    return filtered;
  }, [
    catalog,
    categoryName,
    subcategoryName,
    sortBy,
    appliedSearchQuery,
    activeCategory,
    voiceProducts,
  ]);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = products.length === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, products.length);
  const visibleProducts = products.slice(startIndex, endIndex);
  const visiblePages = getVisiblePages(safePage, totalPages);

  function handleCategoryChange(nextCategoryName) {
    setCategoryName(nextCategoryName);
    setSubcategoryName("All");
    setVoiceProducts([]);
    setCurrentPage(1);
  }

  function handleSubcategoryChange(nextSubcategoryName) {
    setSubcategoryName(nextSubcategoryName);
    setVoiceProducts([]);
    setCurrentPage(1);
  }

  function handleSortChange(nextSortBy) {
    setSortBy(nextSortBy);
    setCurrentPage(1);
  }

  function handleSearchChange(event) {
    setVoiceProducts([]);
    setVoiceStatus("idle");
    setSearchQuery(event.target.value);
  }

  function handleVoiceStatusChange(nextStatus) {
    if (nextStatus === "listening") {
      setVoiceTranscript("");
    }

    setVoiceStatus(nextStatus);
  }

  function applyVoiceSearch(text) {
    setSearchQuery(text);
    setAppliedSearchQuery(text);
    setVoiceProducts([]);
    setCurrentPage(1);
  }

  function findVoiceProduct(aiResult, transcript) {
    if (aiResult.productId) {
      const targetId = String(aiResult.productId).trim().toLowerCase();
      const match = allProducts.find(
        (product) => String(product.id).trim().toLowerCase() === targetId
      );
      if (match) return match;
    }

    return findProduct(allProducts, aiResult.searchText || transcript);
  }

  function addProductsByNumber(productNumbers, quantity) {
    productNumbers.forEach((number) => {
      const product = visibleProducts[number - 1];

      if (product) {
        addItem(product, quantity);
      }
    });
  }

  function decreaseProductCount(productId, quantity) {
    const cartItem = cartItems.find((item) => item.id === productId);
    const removeCount = Math.min(quantity, cartItem?.quantity || 0);

    for (let index = 0; index < removeCount; index += 1) {
      decrementItem(productId);
    }
  }

  async function handleVoiceAction(aiResult, transcript) {
    const quantity = Math.max(1, Number(aiResult.quantity) || 1);
    const productNumbers = aiResult.productNumbers || [];
    const product = findVoiceProduct(aiResult, transcript) || findProduct(allProducts, aiResult.searchText || transcript);

    if (aiResult.action === "add") {
      if (product) {
        try {
          const liveItems = await fetchItemsApi();
          const liveItem = Array.isArray(liveItems)
            ? liveItems.find(
                (item) =>
                  (item.itemnmbr || item.ITEMNMBR)?.trim() === product.id,
              )
            : null;

          const finalProduct = liveItem
            ? {
                ...product,
                price: Number(liveItem.qtybsuom ?? liveItem.QTYBSUOM ?? liveItem.avgWeight) || product.price,
                unit: (liveItem.uomschdl || liveItem.UOMSCHDL)?.trim() || product.unit,
              }
            : product;

          addItem(finalProduct, quantity);
          toast.success(`Added ${quantity} × ${finalProduct.name} to cart!`);
        } catch {
          addItem(product, quantity);
          toast.success(`Added ${quantity} × ${product.name} to cart!`);
        }
        return;
      }

      if (productNumbers.length > 0) {
        addProductsByNumber(productNumbers, quantity);
        return;
      }
    }

    if (aiResult.action === "increase" && product) {
      addItem(product, quantity);
      return;
    }

    if (aiResult.action === "decrease" && product) {
      decreaseProductCount(product.id, quantity);
      return;
    }

    if (aiResult.action === "remove" && product) {
      removeItem(product.id);
      return;
    }

    if (aiResult.action === "clear") {
      clearCart();
      return;
    }

    applyVoiceSearch(aiResult.searchText || transcript);
  }

  async function handleVoiceTranscript(transcript) {
    setVoiceTranscript(transcript);

    try {
      const aiResult = await askVoiceAi({
        transcript,
        products: getVisibleProductsForAi(visibleProducts),
      });

      await handleVoiceAction(aiResult, transcript);
    } catch (error) {
      console.error(error);
      alert(error.message || "Voice search failed.");
    }
  }

  function handleClearAll() {
    setVoiceProducts([]);
    setVoiceStatus("idle");
    setVoiceTranscript("");
    setSearchQuery("");
    setAppliedSearchQuery("");
    setCategoryName("All");
    setSubcategoryName("All");
    setSortBy(DEFAULT_SORT);
    setCurrentPage(1);
  }

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (categoryName !== "All" ? 1 : 0) +
    (subcategoryName !== "All" ? 1 : 0) +
    (sortBy !== DEFAULT_SORT ? 1 : 0);

  function handlePageSizeChange(nextPageSize) {
    setPageSize(nextPageSize);
    setCurrentPage(1);
    scrollCatalogToTop();
  }

  return (
    <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden p-2 sm:p-3 lg:p-4">
      {voiceStatus !== "idle" ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
        >
          <div className="grid min-w-64 max-w-sm gap-3 rounded-lg border bg-background px-6 py-5 text-center text-foreground shadow-xl">
            <Loader2 className="mx-auto size-5 animate-spin text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                {voiceStatus === "listening" ? "Listening..." : "Just a sec..."}
              </p>
              {voiceTranscript ? (
                <p className="text-xs font-medium text-muted-foreground">
                  You said: {voiceTranscript}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-3 md:hidden">
        <MobileDeliveryInfo />
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="mb-3 h-10 w-full justify-center rounded-md text-sm font-semibold md:hidden"
          >
            <SlidersHorizontal className="size-4" />
            {t("showFilters")}
            {activeFilterCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="top"
          className="max-h-[85svh] overflow-y-auto p-4 md:hidden"
        >
          <SheetHeader>
            <SheetTitle>{t("catalogFilters")}</SheetTitle>
          </SheetHeader>

          <div className=" space-y-4">
            <CatalogFilterControls
              layout="mobile"
              searchQuery={searchQuery}
              categoryName={categoryName}
              categoryNames={categoryNames}
              subcategoryName={subcategoryName}
              subcategoryNames={subcategoryNames}
              sortBy={sortBy}
              activeFilterCount={activeFilterCount}
              voiceStatus={voiceStatus}
              onVoiceStatusChange={handleVoiceStatusChange}
              onVoiceTranscript={handleVoiceTranscript}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onSubcategoryChange={handleSubcategoryChange}
              onSortChange={handleSortChange}
              onClearAll={handleClearAll}
            />
          </div>
        </SheetContent>
      </Sheet>

      <section className="hidden min-w-0 shrink-0 rounded-lg border bg-background p-3 shadow-sm md:block lg:p-4">
        <CatalogFilterControls
          searchQuery={searchQuery}
          categoryName={categoryName}
          categoryNames={categoryNames}
          subcategoryName={subcategoryName}
          subcategoryNames={subcategoryNames}
          sortBy={sortBy}
          activeFilterCount={activeFilterCount}
          voiceStatus={voiceStatus}
          onVoiceStatusChange={handleVoiceStatusChange}
          onVoiceTranscript={handleVoiceTranscript}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onSortChange={handleSortChange}
          onClearAll={handleClearAll}
        />
      </section>

      <div
        ref={catalogScrollRef}
        className="no-scrollbar mt-3 min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden pr-1"
      >
        <div className="mb-2 flex min-w-0 items-center justify-between gap-3 text-xs text-muted-foreground sm:text-sm">
          <p className="truncate">
            {t("showingProducts", { start: products.length === 0 ? 0 : startIndex + 1, end: endIndex, total: products.length })}
          </p>
        </div>

        <section className="grid min-w-0 auto-rows-min grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </section>

        <div className="mt-6 flex flex-row items-center justify-between gap-2 pb-1 text-xs text-muted-foreground  sm:text-sm">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t("previousPage")}
              disabled={safePage === 1}
              onClick={() => {
                setCurrentPage((page) => Math.max(1, page - 1));
                scrollCatalogToTop();
              }}
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
                      aria-label={t("skippedPages")}
                      disabled
                    >
                      ...
                    </Button>
                  ) : null}
                  <Button
                    variant={page === safePage ? "default" : "outline"}
                    size="icon-sm"
                    aria-label={`Page ${page}`}
                    onClick={() => {
                      setCurrentPage(page);
                      scrollCatalogToTop();
                    }}
                  >
                    {page}
                  </Button>
                </span>
              );
            })}
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t("nextPage")}
              disabled={safePage === totalPages}
              onClick={() => {
                setCurrentPage((page) => Math.min(totalPages, page + 1));
                scrollCatalogToTop();
              }}
            >
              <ChevronRight />
            </Button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span>{t("show")}</span>
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
            <span>{t("perPage")}</span>
          </div>
        </div>
      </div>

    </main>
  );
}
