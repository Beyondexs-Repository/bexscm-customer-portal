"use client"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { GetItems } from "@/redux/slices/getSlice"
import { getCatalogProducts } from "@/lib/catalog-products"
import { resolveItemImageUrl } from "@/lib/api/itemsApi"
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images"
import Image from "next/image"
import { ChevronRight, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function RecommendedItems() {
  const dispatch = useDispatch()
  const { itemsData, itemsStatus } = useSelector(state => state.getSlice)
  const isLoading = itemsStatus === "idle" || itemsStatus === "loading"
  const products = getCatalogProducts(itemsData).slice(0, 6)
  useEffect(() => { if (itemsStatus === "idle") dispatch(GetItems()) }, [dispatch, itemsStatus])
  return (
    <section aria-labelledby="recommended-items-title" aria-busy={isLoading} className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
            <Star className="size-5 fill-current" />
          </div>
          <div>
            <h2 id="recommended-items-title" className="text-base font-bold sm:text-lg">Recommended Items</h2>
            <p className="text-xs text-muted-foreground">From your live catalog</p>
          </div>
        </div>
        <Button disabled variant="outline" size="sm" className="ml-auto shrink-0 disabled:opacity-100">
          View all products<ChevronRight className="size-4" />
        </Button>
      </div>

      {isLoading && <p role="status" className="sr-only">Loading recommended products...</p>}
      {itemsStatus === "failed" && <p role="alert" className="text-sm text-muted-foreground">Unable to load products from the API.</p>}
      <div
        role="region"
        aria-label="Recommended products"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 focus-visible:outline-2 focus-visible:outline-primary md:grid md:grid-cols-3 md:overflow-visible md:pb-0 xl:grid-cols-6"
      >
        {isLoading ? Array.from({ length: 6 }, (_, index) => (
          <div key={index} aria-hidden="true" className="flex w-[80%] max-w-64 min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-lg border bg-background md:w-auto md:max-w-none">
            <Skeleton className="h-32 w-full rounded-none motion-reduce:animate-none" />
            <div className="flex flex-1 flex-col gap-1 p-3">
              <div className="flex h-5 items-center"><Skeleton className="h-4 w-3/4 motion-reduce:animate-none" /></div>
              <div className="flex h-4 items-center"><Skeleton className="h-3 w-1/2 motion-reduce:animate-none" /></div>
              <div className="mb-2 mt-auto pt-2"><Skeleton className="h-5 w-20 motion-reduce:animate-none" /></div>
              <div className="grid grid-cols-[3.8rem_minmax(0,1fr)] gap-1.5">
                <Skeleton className="h-8 motion-reduce:animate-none" />
                <Skeleton className="h-8 motion-reduce:animate-none" />
              </div>
            </div>
          </div>
        )) : products.map((product) => (
          <article key={product.name} className="flex w-[80%] max-w-64 min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-lg border bg-background md:w-auto md:max-w-none">
            <Image src={resolveItemImageUrl(product.image) || getCategoryPlaceholderImage(product.category)} alt={product.name} width={256} height={128} className="h-32 w-full object-cover" />
            <div className="flex flex-1 flex-col gap-1 p-3">
              <h3 className="text-sm font-semibold">{product.name}</h3>
              <p className="text-xs text-muted-foreground">{product.category}</p>
              <p className="mb-2 mt-auto pt-2 text-sm font-bold">
                ${Number(product.price).toFixed(2)} <span className="text-xs font-normal text-muted-foreground">/ {product.unit}</span>
              </p>
              <div className="grid grid-cols-[3.8rem_minmax(0,1fr)] gap-1.5">
                <div className="grid h-8 grid-cols-3 overflow-hidden rounded-md border bg-background">
                  <Button disabled variant="ghost" size="icon-sm" aria-label={`Decrease ${product.name} quantity`} className="h-full w-full rounded-none p-0 disabled:opacity-100">-</Button>
                  <span className="grid place-items-center text-xs" aria-label={`${product.name} quantity`}>1</span>
                  <Button disabled variant="ghost" size="icon-sm" aria-label={`Increase ${product.name} quantity`} className="h-full w-full rounded-none p-0 disabled:opacity-100">+</Button>
                </div>
                <Button disabled size="sm" className="h-8 min-w-0 gap-1 rounded-md px-2 text-[0.68rem] font-bold disabled:opacity-100">
                  <ShoppingCart className="size-3.5 shrink-0" />
                  <span className="truncate">Add to cart</span>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
