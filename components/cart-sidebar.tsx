"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"

import { useTranslations } from "next-intl"
import { Tabs } from "radix-ui"
import { ChevronDownIcon, Loader2, LockIcon, UsersIcon, MinusIcon, MoreVertical, PlusIcon, ShoppingBagIcon, ShoppingCartIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


export type NewCartPayload = {
  name: string
  visibility: "Public" | "Private"
  fulfillmentDate: string
}

const MAX_NAME_LENGTH = 36

export function CartSidebar({
  open,
  onOpenChange,
  itemCount,
  total,
  items = [],
  isLoading = false,
  isCheckingOut = false,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
  deliveryDate,
  onDeliveryDateChange,
  poNumber,
  onPoNumberChange,
  promoCode,
  onPromoCodeChange,
  notes,
  onNotesChange,
  cartGroups = [],
  cartGroupsLoading = false,
  selectedCartGroupID,
  onSelectCartGroup,
  onCreate,
  isCreating = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (data: NewCartPayload) => Promise<boolean | void>
  isCreating?: boolean
  itemCount: number
  total: string
  items?: {
    id: string
    name: string
    qtybsuom: number
    quantity: number
    itemNumber: string
    unit: string
    image?: string
    category?: string
    subcategory?: string

  }[]
  isLoading?: boolean
  isCheckingOut?: boolean
  onIncrement?: (id: string) => void
  onDecrement?: (id: string) => void
  onRemove?: (id: string) => void
  onCheckout?: () => void
  deliveryDate?: string
  onDeliveryDateChange?: (value: string) => void
  poNumber?: string
  onPoNumberChange?: (value: string) => void
  promoCode?: string
  onPromoCodeChange?: (value: string) => void
  notes?: string
  onNotesChange?: (value: string) => void

  cartGroups?: {
    cartGroupID: number | string
    name: string
    isDefault?: boolean
    visibility?: string
    itemCount?: number
    unitsCount?: number
    estimatedTotal?: number
  }[]
  cartGroupsLoading?: boolean
  selectedCartGroupID?: number | string | null
  onSelectCartGroup?: (id: number | string) => void
}) {
  const isEmpty = items.length === 0
  const t = useTranslations("cart")

  const [showDescription, setShowDescription] = useState(true)
  const [newCartDialogOpen, setNewCartDialogOpen] = useState(false)

  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [visibility, setVisibility] = useState<"Public" | "Private">("Public")

  const [minDate, setMinDate] = useState("")
  const selectedCart = cartGroups.find((group) => String(group.cartGroupID) === String(selectedCartGroupID))
  const canCreate = name.trim().length > 0 && !!date && !isCreating && !!onCreate

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canCreate || !date) return

    const ok = await onCreate?.({
      name: name.trim(),
      visibility,
      fulfillmentDate: date,
    })

    if (ok !== false) setNewCartDialogOpen(false)
  }


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="gap-0 p-0 data-[side=right]:w-screen data-[side=right]:max-w-none sm:data-[side=right]:w-[min(100vw,26rem)] sm:data-[side=right]:max-w-md"
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


        <div className="shrink-0 px-3 pt-2 pb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 w-full justify-start gap-3 px-3 py-1" disabled={cartGroupsLoading}>
                {cartGroupsLoading ? <Loader2 className="size-5 animate-spin" /> : <ShoppingCartIcon className="size-5 text-primary" />}
                <span className="min-w-0 flex-1 truncate text-left text-xs">
                  <span className="font-normal text-muted-foreground">Selected Cart: </span>
                  {selectedCart?.name ?? "Select cart"}
                </span>
                {selectedCart && <Badge variant="secondary" aria-label={`${itemCount} items`}>{itemCount}</Badge>}
                <ChevronDownIcon className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuRadioGroup
                value={selectedCartGroupID == null ? "" : String(selectedCartGroupID)}
                onValueChange={(value) => {
                  const group = cartGroups.find((group) => String(group.cartGroupID) === value)
                  if (group) onSelectCartGroup?.(group.cartGroupID)
                }}
              >
                {cartGroups.map((group) => {
                  const active = String(group.cartGroupID) === String(selectedCartGroupID)
                  return (
                    <DropdownMenuRadioItem
                      key={group.cartGroupID}
                      value={String(group.cartGroupID)}
                      disabled={!onSelectCartGroup || isCheckingOut}
                      className={`gap-2 py-3 pl-2 pr-8 ${active ? "bg-primary/10 text-primary" : ""}`}
                    >
                      <ShoppingCartIcon className="size-4 text-blue-500" />
                      <span className="truncate">{group.name}</span>
                      <Badge variant="secondary" aria-label={`${active ? itemCount : group.itemCount ?? 0} items`}>
                        {active ? itemCount : group.itemCount ?? 0}
                      </Badge>
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
              <DropdownMenuItem
                disabled={!onCreate || isCreating || isCheckingOut}
                className="mt-2 h-9 cursor-pointer justify-center gap-2 bg-primary px-3 font-medium text-primary-foreground hover:bg-primary/80 focus:bg-primary/80 focus:text-primary-foreground not-data-[variant=destructive]:focus:**:text-primary-foreground"
                onSelect={() => {
                  setName("")
                  setDate("")
                  setVisibility("Public")
                  setMinDate(new Date().toLocaleDateString("en-CA"))
                  setNewCartDialogOpen(true)
                }}
              >
                <PlusIcon className="size-4" />
                New Cart
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            <Dialog
              open={newCartDialogOpen}
              onOpenChange={setNewCartDialogOpen}
            >
              <DialogContent className="gap-0 rounded-2xl p-6 sm:max-w-xl">
                <DialogHeader className="gap-1 text-left">
                  <DialogTitle className="text-xl font-semibold">New cart</DialogTitle>
                  <DialogDescription className="text-sm">
                    Name it, set the delivery date and visibility before creating.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
                  {/* Cart name */}
                  <div className="grid gap-1.5">
                    <Label htmlFor="new-cart-name" className="text-xs font-medium text-muted-foreground">
                      Cart name
                    </Label>
                    <Input
                      id="new-cart-name"
                      autoFocus
                      value={name}
                      maxLength={MAX_NAME_LENGTH}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g. Line Prep"
                      className="h-12 rounded-lg px-4 text-base"
                    />
                    <p className="mt-1 text-right text-xs text-muted-foreground">
                      {name.length} / {MAX_NAME_LENGTH}
                    </p>
                  </div>


                  {/* Fulfillment date */}
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="fulfillment-date"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Fulfillment date
                    </Label>

                    <Input
                      id="fulfillment-date"
                      type="date"
                      value={date}
                      min={minDate}
                      onChange={(event) => setDate(event.target.value)}
                      className="h-12 w-full rounded-lg px-4 text-base"
                      required
                    />
                  </div>

                  {/* Visibility */}
                  <div className="grid gap-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Visibility</Label>
                    <div role="radiogroup" aria-label="Visibility" className="grid grid-cols-2 gap-3">
                      {(
                        [
                          { value: "Public", title: "Public", hint: "Everyone on the account", Icon: UsersIcon },
                          { value: "Private", title: "Private", hint: "Only you can see it", Icon: LockIcon },
                        ] as const
                      ).map(({ value, title, hint, Icon }) => {
                        const active = visibility === value
                        return (
                          <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setVisibility(value)}
                            className={`rounded-lg border px-3.5 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${active
                              ? "border-primary bg-primary/10"
                              : "border-input bg-background hover:bg-muted/50"
                              }`}
                          >
                            <span className="flex items-center gap-2 text-sm font-semibold">
                              <Icon className="size-4" />
                              {title}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <DialogFooter className="-mx-6 -mb-6 mt-2 flex-row justify-end rounded-b-2xl p-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNewCartDialogOpen(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!canCreate}>
                      {isCreating ? <Loader2 className="size-4 animate-spin" /> : null}
                      Create cart
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </div>


        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-0 pb-3">
          {isLoading ? (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col h-full items-center justify-center gap-2 text-center text-muted-foreground"
            >
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-xs font-medium">Loading cart...</p>
            </div>
          ) :
            isEmpty ? (
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
                      className="rounded-xl border bg-card p-3 text-card-foreground shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
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
                              <h3 className="text-sm font-semibold leading-5">
                                {item.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">Item Num: {item.itemNumber}</p>
                              {showDescription && (
                                <p className="text-xs text-muted-foreground">
                                  ${item.qtybsuom.toFixed(2)}{item.unit ? ` / ${item.unit}` : ""}
                                </p>
                              )}
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
                            <div className="grid h-8 grid-cols-3 overflow-hidden rounded-lg border bg-background">
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
                              ${(item.qtybsuom * item.quantity).toFixed(2)}
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
              <Input
                type="date"
                aria-label="Delivery Date"
                className="w-full rounded-sm"
                value={deliveryDate}
                onChange={(e) => onDeliveryDateChange?.(e.target.value)}
              />
            </Tabs.Content>
            <Tabs.Content value="po-number" forceMount className="mt-3 min-h-20 space-y-2 data-[state=inactive]:hidden">
              <p className="text-xs text-muted-foreground">Enter your purchase order number.</p>
              <Input
                aria-label="PO Number"
                placeholder="Enter PO number"
                className="rounded-sm"
                value={poNumber}
                onChange={(e) => onPoNumberChange?.(e.target.value)}
              />
            </Tabs.Content>
            <Tabs.Content value="promo-code" forceMount className="mt-3 min-h-20 space-y-2 data-[state=inactive]:hidden">
              <p className="text-xs text-muted-foreground">Enter your promo code.</p>
              <Input
                aria-label="Promo Code"
                placeholder="Enter promo code"
                className="rounded-sm"
                value={promoCode}
                onChange={(e) => onPromoCodeChange?.(e.target.value)}
              />
            </Tabs.Content>
            <Tabs.Content value="order-notes" forceMount className="mt-3 min-h-20 data-[state=inactive]:hidden">
              <textarea
                rows={3}
                aria-label="Order Notes"
                placeholder="Enter order notes"
                className="block h-20 w-full resize-none rounded-sm border border-input bg-transparent px-2.5 py-2 text-sm leading-5 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                value={notes}
                onChange={(e) => onNotesChange?.(e.target.value)}
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





