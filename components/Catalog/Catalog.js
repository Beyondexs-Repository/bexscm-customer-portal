"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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
  Mic,
  Loader2,
} from "lucide-react";

import { useCart, useCatalog, useQuickOrders } from "@/app/context/app-context";
import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderGuidePickerDialog } from "@/components/Catalog/OrderGuidePickerDialog";

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
  const t = useTranslations("catalog")
  const [draftQuantity, setDraftQuantity] = useState(1);
  const isInCart = cartQuantity > 0;
  const quantity = isInCart ? cartQuantity : draftQuantity;

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={`Order Guide ${product.name}`}
                className="absolute right-1.5 top-1.5 rounded-full border bg-card text-muted-foreground shadow-md hover:text-primary dark:border-border dark:bg-card hover:dark:bg-card/60 sm:right-2 sm:top-2"
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
              <p>{t("addToOrderGuide")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2 p-2 lg:space-y-3 lg:p-3">
        <div className="min-w-0 space-y-1">
          <Link
            href={`/catalog/${product.id}`}
            className="block truncate text-xs font-bold outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring lg:text-sm"
          >
            {product.name}
          </Link>
          <p className="truncate text-[0.68rem] font-semibold text-muted-foreground lg:text-xs">
            {product.subcategory}
          </p>
          <div className="grid gap-0.5 text-[0.62rem] font-medium text-muted-foreground lg:text-[0.7rem]">
            <span className="truncate">{t("packSize", { unit: product.unit })}</span>
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
            className="h-8 min-w-0 rounded-md px-2 text-[0.68rem] font-bold lg:text-xs"
            onClick={() => {
              if (!isInCart) {
                onAdd(product, draftQuantity);
              }
            }}
          >
            <ShoppingCart />
            <span className="truncate">
              {isInCart ? t("addedToCart") : t("addToCart")}
            </span>
          </Button>
        </div>
      </div>
    </article>
  );
}

// function CatalogFilterControls({
//   searchQuery,
//   categoryName,
//   categoryNames,
//   subcategoryName,
//   subcategoryNames,
//   sortBy,
//   activeFilterCount,
//   onSearchChange,
//   onCategoryChange,
//   onSubcategoryChange,
//   onSortChange,
//   onClearAll,
//   layout = "desktop",
// }) {
//   const isMobile = layout === "mobile";
//   const t = useTranslations("catalog")

//   return (
//     <div className="min-w-0 space-y-4">
//       <div
//         className={cn(
//           "grid min-w-0 gap-2",
//           isMobile ? "grid-cols-1" : "sm:grid-cols-[minmax(0,1fr)_8.5rem_auto]",
//         )}
//       >
//         <div className="relative min-w-0">
//           <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             type="search"
//             value={searchQuery}
//             onChange={onSearchChange}
//             placeholder={t("searchProducts")}
//             className="h-10 rounded-md pl-9 text-sm"
//           />
//         </div>

//         <Button
//           variant="outline"
//           className="relative h-10 min-w-0 mt-1 sm:mt-0 justify-start rounded-md text-xs font-semibold"
//         >
//           <SlidersHorizontal className="shrink-0" />
//           <span className="truncate">{t("filters")}</span>
//           {activeFilterCount > 0 && (
//             <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground">
//               {activeFilterCount}
//             </span>
//           )}
//         </Button>

//         {!isMobile && (
//           <Button
//             variant="ghost"
//             className="h-10 justify-start px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
//             onClick={onClearAll}
//             disabled={activeFilterCount === 0}
//           >
//             <RotateCcw className="size-4" />
//             {t("clearAll")}
//           </Button>
//         )}
//       </div>

//       <div
//         className={cn(
//           "grid min-w-0 gap-2",
//           isMobile ? "grid-cols-2" : "md:grid-cols-3 md:gap-3",
//         )}
//       >
//         <SelectMenu
//           label={t("category")}
//           value={categoryName}
//           options={categoryNames}
//           onChange={onCategoryChange}
//           searchable
//         />
//         <SelectMenu
//           label={t("subcategory")}
//           value={subcategoryName}
//           options={subcategoryNames}
//           onChange={onSubcategoryChange}
//           searchable
//         />
//         <SelectMenu
//           label={t("sortBy")}
//           value={sortBy}
//           options={sortOptions}
//           onChange={onSortChange}
//         />

//         {isMobile && (
//           <Button
//             variant="outline"
//             className="mt-auto h-9 min-w-0 justify-start rounded-md text-xs font-semibold"
//           >
//             <SlidersHorizontal className="shrink-0" />
//             <span className="truncate">{t("filters")}</span>
//           </Button>
//         )}
//       </div>

//       {isMobile && (
//         <Button
//           variant="ghost"
//           className="h-9 w-full justify-center text-xs font-semibold text-muted-foreground hover:text-foreground"
//           onClick={onClearAll}
//           disabled={activeFilterCount === 0}
//         >
//           <RotateCcw className="size-4" />
//           {t("clearAll")}
//         </Button>
//       )}
//     </div>
//   );
// }



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

export function Catalog() {
  const t = useTranslations("catalog")
  const { items, addItem, incrementItem, decrementItem } = useCart();
  const { catalog } = useCatalog();
  const { quickOrders, addProductToQuickOrder, removeProductFromQuickOrder } =
    useQuickOrders();
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);
  const categoryNames = ["All", ...catalog.map((category) => category.name)];
  const [voiceProducts, setVoiceProducts] = useState([]);
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
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("idle");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const catalogScrollRef = useRef(null);
  const voiceSearchRequestIdRef = useRef(0);

function CatalogFilterControls({
    searchQuery,
    categoryName,
    categoryNames,
    subcategoryName,
    subcategoryNames,
    sortBy,
    activeFilterCount,
    onSearchChange,
    onCategoryChange,
    onSubcategoryChange,
    onSortChange,
    onClearAll,
    layout = "desktop",
  }) {
    const isMobile = layout === "mobile";
    const t = useTranslations("catalog");
    //=========================VOICE SEARCH=========================
    const startListening = () => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech Recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      setVoiceStatus("listening");
      recognition.start();

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        const requestId = voiceSearchRequestIdRef.current + 1;

        voiceSearchRequestIdRef.current = requestId;
        setSearchQuery(transcript);
        setAppliedSearchQuery(transcript);
        setCurrentPage(1);
        setVoiceStatus("searching");

        try {
          const response = await fetch("/api/voice-search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: transcript,
            }),
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error("Voice search failed.");
          }

          if (voiceSearchRequestIdRef.current === requestId) {
            setVoiceProducts(data.success ? (data.products ?? []) : []);
          }
        } catch (error) {
          console.error(error);

          if (voiceSearchRequestIdRef.current === requestId) {
            setVoiceProducts([]);
          }
        } finally {
          if (voiceSearchRequestIdRef.current === requestId) {
            setVoiceStatus("idle");
          }
        }
      };

      recognition.onerror = (event) => {
        console.error(event);
        setVoiceStatus("idle");
      };

      recognition.onend = () => {
        setVoiceStatus((current) =>
          current === "listening" ? "idle" : current,
        );
      };
    };
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
 
            <button
              type="button"
              onClick={startListening}
              disabled={voiceStatus !== "idle"}
              aria-label={
                voiceStatus === "listening"
                  ? "Listening"
                  : voiceStatus === "searching"
                    ? "Searching products"
                    : "Search products by voice"
              }
              className="absolute right-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-green-500 p-2 text-white"
            >
              {voiceStatus === "idle" ? (
                <Mic size={18} />
              ) : (
                <Loader2 className="size-[18px] animate-spin" />
              )}
            </button>
          </div>
 
          <Button
            variant="outline"
            className="relative h-10 min-w-0 mt-1 sm:mt-0 justify-start rounded-md text-xs font-semibold"
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
            onChange={(value) => {
              setCategoryName(value);
              setVoiceProducts([]);
            }}
            searchable
          />
          <SelectMenu
            label={t("subcategory")}
            value={subcategoryName}
            options={subcategoryNames}
            onChange={(value) => {
              setSubcategoryName(value);
              setVoiceProducts([]);
            }}
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


  // const products = useMemo(() => {
  //   let filtered = [];

  //   if (categoryName === "All") {
  //     filtered = catalog.flatMap((category) =>
  //       category.subcategories.flatMap((subcategory) =>
  //         subcategory.products.map((product) => ({
  //           ...product,
  //           category: category.name,
  //           subcategory: subcategory.name,
  //         })),
  //       ),
  //     );
  //   } else if (subcategoryName === "All") {
  //     filtered =
  //       activeCategory?.subcategories.flatMap((subcategory) =>
  //         subcategory.products.map((product) => ({
  //           ...product,
  //           category: activeCategory.name,
  //           subcategory: subcategory.name,
  //         })),
  //       ) ?? [];
  //   } else {
  //     const selectedSubcategory = activeCategory?.subcategories.find(
  //       (subcategory) => subcategory.name === subcategoryName,
  //     );

  //     filtered = selectedSubcategory?.products ?? [];
  //   }

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


  //   const normalizedSearch = appliedSearchQuery.trim().toLowerCase();

  //   if (normalizedSearch) {
  //     filtered = filtered.filter((product) =>
  //       [
  //         product.name,
  //         product.category,
  //         product.subcategory,
  //         product.unit,
  //         product.id,
  //       ]
  //         .filter(Boolean)
  //         .some((value) =>
  //           String(value).toLowerCase().includes(normalizedSearch),
  //         ),
  //     );
  //   }

  //   if (sortBy === "Price Low to High") {
  //     filtered.sort((a, b) => a.price - b.price);
  //   } else if (sortBy === "Price High to Low") {
  //     filtered.sort((a, b) => b.price - a.price);
  //   } else {
  //     filtered.sort((a, b) => a.name.localeCompare(b.name));
  //   }

  //   return filtered;
  // }, [
  //   catalog,
  //   categoryName,
  //   subcategoryName,
  //   sortBy,
  //   appliedSearchQuery,
  //   activeCategory,
  // ]);

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
        quickOrders.flatMap(
          (order) =>
            order.groups.flatMap((group) =>
              group.products.map((product) => product.id),
            ) ?? [],
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

  function handleSearchChange(event) {
    voiceSearchRequestIdRef.current += 1;
    setVoiceProducts([]);
    setVoiceStatus("idle");
    setSearchQuery(event.target.value);
  }

  function handleClearAll() {
    voiceSearchRequestIdRef.current += 1;
    setVoiceProducts([]);
    setVoiceStatus("idle");
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
          <div className="flex min-w-52 items-center justify-center gap-3 rounded-lg border bg-background px-6 py-5 text-foreground shadow-xl">
            <Loader2 className="size-5 animate-spin text-primary" />
            <p className="text-sm font-semibold">
              {voiceStatus === "listening"
                ? "Listening..."
                : "Searching products..."}
            </p>
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

      <OrderGuidePickerDialog
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
