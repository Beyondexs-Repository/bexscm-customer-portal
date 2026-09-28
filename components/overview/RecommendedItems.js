import Image from "next/image"
import { ChevronRight, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const products = [
  { name: "Ribeye Steak", category: "Premium beef", price: "14.99", image: "/overview/premium-meats-offer.png" },
  { name: "Chicken Breast", category: "Fresh poultry", price: "8.99", image: "/overview/produce-meat-bundle.png" },
  { name: "Fresh Vegetables", category: "Seasonal produce", price: "5.49", image: "/overview/fresh-produce-banner.png" },
  { name: "Fruit Selection", category: "Fresh fruit", price: "7.99", image: "/overview/fresh-fruit-banner.png" },
  { name: "Pantry Essentials", category: "Everyday staples", price: "12.49", image: "/overview/pantry-essentials-banner.png" },
  { name: "Lamb Chops", category: "Premium meat", price: "17.99", image: "/overview/premium-meats-offer.png" },
]

export default function RecommendedItems({ isLoading = false }) {
  return (
    <section aria-labelledby="recommended-items-title" aria-busy={isLoading} className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
            <Star className="size-5 fill-current" />
          </div>
          <div>
            <h2 id="recommended-items-title" className="text-base font-bold sm:text-lg">Recommended Items</h2>
            <p className="text-xs text-muted-foreground">Based on your ordering history</p>
          </div>
        </div>
        <Button disabled variant="outline" size="sm" className="ml-auto shrink-0 disabled:opacity-100">
          View all products<ChevronRight className="size-4" />
        </Button>
      </div>

      {isLoading && <p role="status" className="sr-only">Loading recommended products...</p>}
      <div
        role="region"
        aria-label="Recommended products wireframe"
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
            <Image src={product.image} alt={product.name} width={256} height={128} className="h-32 w-full object-cover" />
            <div className="flex flex-1 flex-col gap-1 p-3">
              <h3 className="text-sm font-semibold">{product.name}</h3>
              <p className="text-xs text-muted-foreground">{product.category}</p>
              <p className="mb-2 mt-auto pt-2 text-sm font-bold">
                ${product.price} <span className="text-xs font-normal text-muted-foreground">/ lb</span>
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
