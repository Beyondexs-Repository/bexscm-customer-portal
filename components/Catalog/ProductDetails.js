"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetItems } from "../../redux/slices/getSlice";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ChevronLeft,
  ShoppingCart,
  Star,
} from "lucide-react";

import { resolveItemImageUrl } from "@/lib/api/itemsApi";
import { useCart, useQuickOrders } from "@/app/context/app-context";
import { OrderGuidePickerDialog } from "@/components/Catalog/OrderGuidePickerDialog";
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images";
import { getProductGalleryImages } from "@/lib/catalog-products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatPrice(price, unit) {
  return `$${Number(price).toFixed(2)} / ${unit}`;
}

function ProductGallery({ product, images }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="grid gap-4 md:grid-cols-[72px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
        {images.map((image, index) => {
          const selected = image === selectedImage;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border",
                selected
                  ? "border-primary ring-2 ring-primary/20"
                  : "hover:border-primary",
              )}
              onClick={() => setSelectedImage(image)}
            >
              <span
                className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${image})` }}
              />
            </button>
          );
        })}
      </div>

      <div className="order-1 grid min-h-[320px] place-items-center rounded-lg md:order-2 lg:min-h-[520px]">
        <div
          role="img"
          aria-label={product.name}
          className="h-full min-h-[300px] w-full bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${selectedImage})` }}
        />
      </div>
    </div>
  );
}

export function ProductDetails({ productId, backHref }) {
  const t = useTranslations("catalog");


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
  const catalogPath = backHref ?? "/catalog"
  
const dispatch = useDispatch();
const itemsData = useSelector((state) => state.getSlice.itemsData);
const itemsStatus = useSelector((state) => state.getSlice.itemsStatus);

// The page can be opened directly by URL, so the store may be empty
useEffect(() => {
  if (itemsStatus === "idle") dispatch(GetItems());
}, [itemsStatus, dispatch]);

  const rawItems = itemsData;

//   useEffect(() => {
//     let isMounted = true;
//  async function loadLiveItems() {
//   try {
//     const apiItems = await GetItems();
//     const list = Array.isArray(apiItems) ? apiItems : apiItems?.data ?? [];
//     const flat = list.map((entry) => ({
//       ...(entry.item ?? entry),
//       inOrderGuide: entry.inOrderGuide ?? false,
//     }));

//     if (isMounted && flat.length > 0) {
//       setRawItems(flat);
//     }
//   } catch (err) {
//     console.warn("Failed to fetch live items in ProductDetails:", err);
//   }
// }
//     loadLiveItems();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

  const product = useMemo(
    () =>
      rawItems
        .map((item, index) => {
          const categoryName = (item.MainGroup || item.mainGroup)?.trim() || "Other";
          const subcategoryName = (item["Sub-Group"] || item.subGroup || item.SubGroup)?.trim() || "Other";
          const id = (item.ITEMNMBR || item.itemnmbr)?.trim() || "";
          const brand = (item.ppc_Brand || item.brand || item.itmshnam)?.trim() || "";
          const name = (item.ItemName || item.itemName || item.ITEMDESC || item.itemdesc)?.trim() || "";
          const unit = (item.UOMSCHDL || item.uomschdl)?.trim() || "unit";
          const price = Number(item.QTYBSUOM ?? item.qtybsuom ?? item.avgWeight) || 0;
          const rawImage = item.image ?? item.Image ?? item.IMAGE;
          const resolvedImg = resolveItemImageUrl(rawImage);
          const image = resolvedImg || getCategoryPlaceholderImage(categoryName);

          return {
            category: categoryName,
            id,
            brand,
            name,
            sku: id,
            unit,
            price,
            subcategory: subcategoryName,
            fallbackImageIndex: index,
            image,
          };
        })
        .find((item) => item.id === productId),
    [rawItems, productId],
  );
  const [draftQuantity, setDraftQuantity] = useState(1);
  const [orderGuideOpen, setOrderGuideOpen] = useState(false);

  const galleryImages = useMemo(
    () => getProductGalleryImages(product),
    [product],
  );
  const cartItem = cartItems.find((item) => item.id === product?.id);
  const isInCart = Boolean(cartItem);
  const quantity = cartItem?.quantity ?? draftQuantity;
  const isInOrderGuide = quickOrders.some((order) =>
    order.groups.some((group) =>
      group.products.some((item) => item.id === product?.id),
    ),
  );

  if (!product && (itemsStatus === "idle" || itemsStatus === "loading")) {
  return (
    <main className="grid h-full min-h-0 place-items-center p-4">
      <p className="text-sm text-muted-foreground">Loading product…</p>
    </main>
  );
}

if (itemsStatus === "failed") {
  return (
    <main className="grid h-full place-items-center p-4">
      <section role="alert" className="grid gap-3 text-center">
        <p>Unable to load this product from the API.</p>
        <Button variant="outline" onClick={() => dispatch(GetItems())}>Try again</Button>
      </section>
    </main>
  );
}

if (!product) {
  return (
    <main className="grid h-full min-h-0 place-items-center p-4">
      <section className="grid max-w-md gap-4 rounded-lg border bg-card p-6 text-center shadow-sm">
        <h1 className="text-xl font-bold">{t("productNotFound")}</h1>
        <p className="text-sm text-muted-foreground">
          The product you are looking for is unavailable or has been removed.
        </p>
        <Button asChild>
          <Link href={catalogPath}>
            <ChevronLeft className="size-4" />
            {t("backToCatalog")}
          </Link>
        </Button>
      </section>
    </main>
  );
}
  // if (!product && (itemsStatus === "idle" || itemsStatus === "loading")) {
  //   return (
  //     <main className="grid h-full min-h-0 place-items-center p-4">
  //       <section className="grid max-w-md gap-4 rounded-lg border bg-card p-6 text-center shadow-sm">
  //         <h1 className="text-xl font-bold">{t("productNotFound")}</h1>
  //         <p className="text-sm text-muted-foreground">
  //           The product you are looking for is unavailable or has been removed.
  //         </p>
  //         <Button asChild>
  //           <Link href={catalogPath}>
  //             <ChevronLeft className="size-4" />
  //             {t("backToCatalog")}
  //           </Link>
  //         </Button>
  //       </section>
  //     </main>
  //   );
  // }

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <Button asChild variant="ghost" size="sm" className="px-0">
          <Link href={catalogPath}>
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-6">
        <ProductGallery product={product} images={galleryImages} />

        <section className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            <Badge variant="outline">{product.subcategory}</Badge>
          </div>

          <h1 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
            {product.name}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            SKU: {product.sku}
          </p>

          <div className="mt-4 border-b pb-4">
            <p className="text-3xl font-bold">
              {formatPrice(product.price, product.unit)}
            </p>
            <p className="mt-2 text-sm font-semibold text-green-600">
              {t("inStock")}
            </p>
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <div className="grid grid-cols-[120px_1fr] gap-3">
              <span className="font-semibold">{t("unit")}</span>
              <span>{product.unit}</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-3">
              <span className="font-semibold">{t("packSize")}</span>
              <span>1 {product.unit}</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-3">
              <span className="font-semibold">{t("category")}</span>
              <span>{product.category}</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <div className="flex h-9 w-[100px] shrink-0 overflow-hidden rounded-md border bg-background">
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-full w-8 shrink-0 rounded-none p-0 font-bold"
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

              <div className="flex flex-1 items-center justify-center text-sm font-bold">
                {quantity}
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                className="h-full w-8 shrink-0 rounded-none p-0 font-bold"
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
              className="h-9 flex-1 rounded-full text-sm font-bold"
              variant={isInCart ? "secondary" : "default"}
              onClick={() => {
                if (!isInCart) {
                  addItem({ ...product, image: galleryImages[0] }, draftQuantity);
                }
              }}
            >
              <ShoppingCart />
              {isInCart ? t("addedToCart") : t("addToCart")}
            </Button>
          </div>

          <div className="mt-3">
            <Button
              variant={isInOrderGuide ? "default" : "outline"}
              className={cn(
                "h-10 w-full rounded-full text-sm font-bold",
                isInOrderGuide && "border-sky-500 bg-sky-500 text-white hover:bg-sky-500 hover:text-white dark:border-sky-400 dark:bg-sky-500 dark:text-white dark:hover:bg-sky-500 dark:hover:text-white",
              )}
              onClick={() => setOrderGuideOpen(true)}
            >
              <Star className={cn("size-4", isInOrderGuide && "fill-current")} />
              {t("addToOrderGuide")}
            </Button>
          </div>
        </section>
      </div>

      <OrderGuidePickerDialog
        product={product}
        quickOrders={quickOrders}
        open={orderGuideOpen}
        onOpenChange={setOrderGuideOpen}
        onAdd={addProductToQuickOrder}
        onRemove={removeProductFromQuickOrder}
      />

      <section className="mx-auto max-w-7xl border-t px-4 py-8 lg:px-6">
        <h2 className="text-xl font-bold">{t("productDescription")}</h2>

        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">
          Fresh, reliable product packed for Bex SCM ordering. This
          product is suitable for restaurants, retailers, catering services, and
          business buyers who need consistent quality and dependable supply.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>• {t("desc1")}</li>
          <li>• {t("desc2")}</li>
          <li>• {t("desc3")}</li>
          <li>• {t("desc4")}</li>
        </ul>
      </section>

    </main>
  );
}
