"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  ChevronRight,
  FolderOpen,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart, useQuickOrders } from "@/app/context/app-context"

function getGuideProducts(guide) {
  return guide.groups.flatMap((group) => group.products)
}

export default function QuickOrderGuide() {
  const { quickOrders, dashboardQuickOrderIds } = useQuickOrders()
  const { addItem } = useCart()
  const [selectedGuideIds, setSelectedGuideIds] = useState([])

  const visibleGuides = dashboardQuickOrderIds
    .map((id) => quickOrders.find((guide) => guide.id === id))
    .filter(Boolean)
    .slice(0, 4)

  const visibleGuideIds = visibleGuides.map((guide) => guide.id)

  const selectedIds = selectedGuideIds.filter((id) =>
    visibleGuideIds.includes(id),
  )

  const allSelected =
    visibleGuides.length > 0 && selectedIds.length === visibleGuides.length

  const productsById = new Map()

  quickOrders
    .filter((guide) => selectedIds.includes(guide.id))
    .flatMap(getGuideProducts)
    .forEach((product) => {
      productsById.set(product.id, product)
    })

  const selectedProducts = Array.from(productsById.values())

  function toggleGuide(guideId) {
    setSelectedGuideIds((current) =>
      current.includes(guideId)
        ? current.filter((id) => id !== guideId)
        : [...current, guideId],
    )
  }

  function toggleAllGuides() {
    setSelectedGuideIds(allSelected ? [] : visibleGuideIds)
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
            <BookOpen className="size-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-bold sm:text-lg">
              Quick Order Guides
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              Select guides to add their products
            </p>
          </div>
        </div>

        <Button asChild variant="outline" size="icon-sm">
          <Link href="/order-guide" aria-label="Open order guides">
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="flex h-full flex-1 flex-col p-3">
        {visibleGuides.length > 0 ? (
          <div className="flex-1">
            <div className="grid gap-2">
              {visibleGuides.map((guide) => {
                const products = getGuideProducts(guide)
                const isSelected = selectedIds.includes(guide.id)

                return (
                  <article
  key={guide.id}
  role="button"
  tabIndex={0}
  onClick={() => toggleGuide(guide.id)}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      toggleGuide(guide.id)
    }
  }}
  className="group flex cursor-pointer items-center gap-2 rounded-lg border bg-background p-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
>
                    <input
    type="checkbox"
    checked={isSelected}
    onChange={() => toggleGuide(guide.id)}
    onClick={(event) => event.stopPropagation()}
    className="size-4 shrink-0 cursor-pointer rounded border-border accent-primary"
    aria-label={`Select ${guide.name}`}
  />

                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FolderOpen className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {guide.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {guide.groups.length}{" "}
                        {guide.groups.length === 1 ? "group" : "groups"} ·{" "}
                        {products.length}{" "}
                        {products.length === 1 ? "product" : "products"}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold">No Order Guides Yet</p>
            <p className="mt-1 max-w-48 text-xs leading-relaxed text-muted-foreground">
              Create a reusable guide for products you order regularly.
            </p>
          </div>
        )}

        <div className="mt-auto grid grid-cols-2 gap-2 border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 w-full"
            disabled={visibleGuides.length === 0}
            onClick={toggleAllGuides}
          >
            {allSelected ? "Clear all" : "Select all"}
          </Button>

          <Button
            type="button"
            className="h-10 w-full"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={() => selectedProducts.forEach((product) => addItem(product, 1))}
          >
            <ShoppingCart className="size-4" />
            Add to cart
            {selectedProducts.length > 0
              ? ` (${selectedProducts.length})`
              : ""}
          </Button>
        </div>
      </div>
    </section>
  )
}
