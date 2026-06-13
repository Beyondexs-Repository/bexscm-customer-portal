"use client"

import { useTranslations } from "next-intl"
import { MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function CartSidebar({
  open,
  onOpenChange,
  itemCount,
  total,
  items = [],
  onIncrement,
  onDecrement,
  onRemove,
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
  }[]
  onIncrement?: (id: string) => void
  onDecrement?: (id: string) => void
  onRemove?: (id: string) => void
}) {
  const isEmpty = items.length === 0
  const t = useTranslations("cart")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="gap-0 p-0 data-[side=right]:w-screen data-[side=right]:max-w-none sm:data-[side=right]:w-[min(100vw,24rem)] sm:data-[side=right]:max-w-md"
      >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="text-lg font-semibold">
            {t("title")}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {t("itemsCount", { count: itemCount })}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
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
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-md border bg-card p-3 text-card-foreground"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-primary/70">
                          <ShoppingBagIcon className="size-6" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {item.sku} · ${item.price.toFixed(2)} / {item.unit}
                          </p>
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
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="border-t px-5 py-4">
          <div className="flex items-center justify-between text-base font-semibold">
            <span>{t("total")}</span>
            <span>{total}</span>
          </div>
          <Button className="h-11 w-full" disabled={isEmpty}>
            {t("proceed")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
