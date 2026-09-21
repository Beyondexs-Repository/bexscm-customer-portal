"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Tabs } from "radix-ui"
import { Loader2, MinusIcon, MoreVertical, PlusIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images"
import { resolveItemImageUrl } from "@/lib/api/itemsApi"

export function CartSidebar({
  open,
  onOpenChange,
  itemCount,
  total,
  items = [],
  isCheckingOut = false,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemCount: number
  total: string
  items?: {
    id: string
    name: string
    price: number
    quantity: number
    sku: string
    unit: string
    image?: string
    category?: string
    subcategory?: string
  }[]
  isCheckingOut?: boolean
  onIncrement?: (id: string) => void
  onDecrement?: (id: string) => void
  onRemove?: (id: string) => void
  onCheckout?: () => void
}) {
  const isEmpty = items.length === 0
  const t = useTranslations("cart")
  const [showDescription, setShowDescription] = useState(true)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="gap-0 p-0 data-[side=right]:w-screen data-[side=right]:max-w-none sm:data-[side=right]:w-[min(100vw,24rem)] sm:data-[side=right]:max-w-md"
      >
        <SheetHeader className="border-b px-3 py-4">
          <SheetTitle className="pr-16 text-lg font-semibold">
            {t("title")}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {t("itemsCount", { count: itemCount })}
            </span>
          </SheetTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="absolute right-11 top-3" aria-label="Cart options">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 whitespace-nowrap">
              <DropdownMenuCheckboxItem checked={showDescription} onCheckedChange={setShowDescription}>
                Show description
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={isEmpty || isCheckingOut || !onRemove}
                onSelect={() => items.forEach((item) => onRemove?.(item.id))}
              >
                <Trash2Icon />
                Clear all items
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          {isEmpty ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                  <ShoppingBagIcon className="size-7 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground">
                  {t("emptyTitle")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("emptyDescription")}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const resolvedImg = resolveItemImageUrl(item.image) || item.image
                const image = resolvedImg || getCategoryPlaceholderImage(item.category)

                return (
                  <article
                    key={item.id}
                    className="rounded-md border bg-card p-3 text-card-foreground"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={item.name}
                          className="size-full object-cover"
                        />
                      </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">
                            {item.name}
                          </h3>
                          {showDescription && <p className="text-xs text-muted-foreground">
                            {item.sku} · ${item.price.toFixed(2)} / {item.unit}
                          </p>}
                        </div>

                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={t("remove", { name: item.name })}
                            onClick={() => onRemove?.(item.id)}
                          >
                            <Trash2Icon />
                          </Button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="grid h-8 grid-cols-3 overflow-hidden rounded-md border bg-background">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={t("decrease", { name: item.name })}
                              className="h-full rounded-none"
                              onClick={() => onDecrement?.(item.id)}
                            >
                              <MinusIcon />
                            </Button>
                            <div className="grid min-w-8 place-items-center px-2 text-xs font-semibold">
                              {item.quantity}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={t("increase", { name: item.name })}
                              className="h-full rounded-none"
                              onClick={() => onIncrement?.(item.id)}
                            >
                              <PlusIcon />
                            </Button>
                          </div>
                          <p className="text-sm font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <SheetFooter className="border-t px-3 py-4">
          <Tabs.Root defaultValue="delivery-date" className="mb-2 w-full">
            <Tabs.List
              aria-label="Order details"
              className="flex w-full items-center"
            >
              {[
                ["delivery-date", "Delivery Date"],
                ["po-number", "PO Number"],
                ["promo-code", "Promo Code"],
                ["order-notes", "Order Notes"],
              ].map(([value, label]) => (
                <Tabs.Trigger
                  key={value}
                  value={value}
                  className="relative flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-[10px] text-muted-foreground outline-none after:absolute after:right-0 after:top-1/2 after:h-3 after:w-px after:-translate-y-1/2 after:bg-border last:after:hidden hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:border-primary data-[state=active]:font-semibold data-[state=active]:text-foreground sm:text-[11px]"
                >
                  {label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <Tabs.Content value="delivery-date" forceMount className="mt-3 min-h-20 space-y-2 data-[state=inactive]:hidden">
              <p className="text-xs text-muted-foreground">Enter your preferred delivery date.</p>
              <Input type="date" aria-label="Delivery Date" className="w-full rounded-sm" />
            </Tabs.Content>
            <Tabs.Content value="po-number" forceMount className="mt-3 min-h-20 space-y-2 data-[state=inactive]:hidden">
              <p className="text-xs text-muted-foreground">Enter your purchase order number.</p>
              <Input aria-label="PO Number" placeholder="Enter PO number" className="rounded-sm" />
            </Tabs.Content>
            <Tabs.Content value="promo-code" forceMount className="mt-3 min-h-20 space-y-2 data-[state=inactive]:hidden">
              <p className="text-xs text-muted-foreground">Enter your promo code.</p>
              <Input aria-label="Promo Code" placeholder="Enter promo code" className="rounded-sm" />
            </Tabs.Content>
            <Tabs.Content value="order-notes" forceMount className="mt-3 min-h-20 data-[state=inactive]:hidden">
              <textarea
                rows={3}
                aria-label="Order Notes"
                placeholder="Enter order notes"
                className="block h-20 w-full resize-none rounded-sm border border-input bg-transparent px-2.5 py-2 text-sm leading-5 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </Tabs.Content>
          </Tabs.Root>
          <div className="flex items-center justify-between text-base font-semibold">
            <span>{t("total")}</span>
            <span>{total}</span>
          </div>
          <Button
            className="h-11 w-full gap-2"
            disabled={isEmpty || isCheckingOut}
            onClick={onCheckout}
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing...
              </>
            ) : (
              t("proceed")
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
