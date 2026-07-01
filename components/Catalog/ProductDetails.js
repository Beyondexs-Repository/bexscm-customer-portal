"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ChevronLeft,
  ShoppingCart,
  Star,
} from "lucide-react";

import catalog from "@/data/data.json";
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

export function ProductDetails({ productId }) {
  const t = useTranslations("catalog")
  const pathname = usePathname()
  const catalogPath = pathname.startsWith("/backoffice")
    ? "/backoffice/catalog"
    : "/catalog"
  const product = useMemo(
    () =>
      catalog
        .flatMap((category, categoryIndex) =>
          category.subcategories.flatMap((subcategory, subcategoryIndex) =>
            subcategory.products.map((item, productIndex) => ({
              ...item,
              category: item.category || category.name,
              subcategory: item.subcategory || subcategory.name,
              fallbackImageIndex:
                categoryIndex + subcategoryIndex + productIndex,
            })),
          ),
        )
        .find((item) => item.id === productId || item.slug === productId),
    [productId],
  );
  const [draftQuantity, setDraftQuantity] = useState(1);

  const galleryImages = useMemo(
    () => getProductGalleryImages(product),
    [product],
  );

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
                onClick={() => setDraftQuantity((current) => Math.max(1, current - 1))}
              >
                <span className="grid size-full place-items-center">-</span>
              </Button>

              <div className="flex flex-1 items-center justify-center text-sm font-bold">
                {draftQuantity}
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                className="h-full w-8 shrink-0 rounded-none p-0 font-bold"
                onClick={() => setDraftQuantity((current) => current + 1)}
              >
                <span className="grid size-full place-items-center">+</span>
              </Button>
            </div>

            <Button
              className="h-9 flex-1 rounded-full text-sm font-bold"
              variant="default"
            >
              <ShoppingCart />
              {t("addToCart")}
            </Button>
          </div>

          <div className="mt-3">
            <Button
              variant="outline"
              className="h-10 w-full rounded-full text-sm font-bold"
            >
              <Star className="size-4" />
              {t("addToOrderGuide")}
            </Button>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-7xl border-t px-4 py-8 lg:px-6">
        <h2 className="text-xl font-bold">{t("productDescription")}</h2>

        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">
          Fresh, reliable product packed for Crate Inc. ordering. This
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
