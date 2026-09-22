"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { useTranslations } from "next-intl"
import {
  Building2,
  CalendarClock,
  ChevronLeft,
  CircleDollarSign,
  Download,
  MapPin,
  Minus,
  Plus,
  PackageCheck,
  Phone,
  Store,
  Trash2,
  User,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { formatCurrency, statusStyles } from "./MyOrders"
import OrderItemRatings from "./OrderItemRatings"

export default function OrderDetails({ order, onBack, onClose }) {

  const [reOrderModalOpen, setReOrderModalOpen] = useState(false);
  const [reOrderItems, setReOrderItems] = useState([])
  const [ratingOrderId, setRatingOrderId] = useState(null)

  const t = useTranslations("myOrders")
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <section className="flex h-full min-h-0 flex-col rounded-lg border bg-card shadow-sm">
      <div className="flex shrink-0 items-start justify-between gap-3 border-b p-3 sm:p-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <p className="min-w-0 truncate text-xs font-bold text-muted-foreground">
              {t("orderNumber", { number: order.orderNumber })}
            </p>

            <Badge className={cn("h-auto shrink-0 px-2 py-0.5 text-[10px] leading-none ring-1", statusStyles[order.statusTone])}>
              {order.status}
            </Badge>
          </div>

          <h2 className="mt-3 text-lg font-bold leading-tight sm:text-xl">
            {t("deliveryOn", { deliveryDate: order.deliveryDate })}
          </h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 xl:hidden"
          aria-label={t("backToOrders")}
          onClick={onBack}
        >
          <ChevronLeft className="size-4" />
          {t("back")}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden xl:inline-flex"
          aria-label={t("closeDetails")}
          onClick={onClose}
        >
          <X />
        </Button>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="min-w-0 rounded-lg bg-emerald-50 p-2 text-foreground dark:bg-emerald-800/5 dark:ring-1 dark:ring-emerald-900/80 sm:p-3">
            <CalendarClock className="mb-2 size-4 text-emerald-600" />
            <p className="text-[10px] flex flex-col leading-snug sm:text-[11px]">
              <span className="text-muted-foreground dark:text-emerald-100/70">
                {t("placedOnLabel")}{" "}
              </span>
              <span className="break-words text-[11px] font-bold leading-snug sm:text-xs">
                {order.placedOn}
              </span>
            </p>
          </div>

          <div className="min-w-0 rounded-lg bg-emerald-50 p-2 text-foreground dark:bg-emerald-800/5 dark:ring-1 dark:ring-emerald-900/80 sm:p-3">
            <PackageCheck className="mb-2 size-4 text-emerald-600" />
            <p className="text-[10px] text-muted-foreground dark:text-emerald-100/70 sm:text-[11px]">
              {t("orderType")}
            </p>
            <p className="break-words text-[11px] font-bold leading-snug sm:text-xs">
              {order.type}
            </p>
          </div>

          <div className="min-w-0 rounded-lg bg-emerald-50 p-2 text-foreground dark:bg-emerald-800/5 dark:ring-1 dark:ring-emerald-900/80 sm:p-3">
            <CircleDollarSign className="mb-2 size-4 text-emerald-600" />
            <p className="text-[10px] text-muted-foreground dark:text-emerald-100/70 sm:text-[11px]">
              {t("orderTotal")}
            </p>
            <p className="truncate text-sm font-bold leading-tight sm:text-lg">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>

        {/* Customer Details Card */}
        <div className="mt-4 rounded-xl border bg-slate-50/70 p-3.5 sm:p-4 text-slate-800 dark:bg-slate-900/40 dark:text-slate-100 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                <Store className="size-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight text-foreground">
                  {order.customerName || "Central Foodservice, Inc."}
                </h4>
                <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                  ID: {order.customerID || "400001"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-muted-foreground font-semibold shrink-0">
                <Building2 className="size-3.5 text-slate-400" />
                <span>Ship To</span>
              </div>
              <span className="font-bold text-right text-foreground">
                {order.shipToName || order.customerName || "Central Foodservice, Inc."}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-muted-foreground font-semibold shrink-0">
                <MapPin className="size-3.5 text-slate-400" />
                <span>Address</span>
              </div>
              <span className="font-bold text-right text-sky-600 dark:text-sky-400">
                {order.address1 || "308 Government Road, Mattawa, WA, 99349"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-muted-foreground font-semibold shrink-0">
                <User className="size-3.5 text-slate-400" />
                <span>Sales Rep</span>
              </div>
              <span className="font-bold text-right text-foreground">
                {order.salesPerson || "Laura Parker"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-muted-foreground font-semibold shrink-0">
                <Phone className="size-3.5 text-slate-400" />
                <span>Phone</span>
              </div>
              <span className="font-bold text-right text-sky-600 dark:text-sky-400">
                {order.phone1 || "(509) 932-4219"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold">{t("orderItems")}</h3>
          <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setRatingOrderId(order.id)}>Rate items</Button>
        </div>
        <OrderItemRatings key={order.id} open={ratingOrderId === order.id} onOpenChange={(open) => setRatingOrderId(open ? order.id : null)} items={order.items} />

        <div className="mt-3 divide-y rounded-lg border">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 p-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{item.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t("brand")} {item.brand}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {t("packSize")} {item.packSize}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  SKU: {item.sku}
                </p>
              </div>

              <div className="max-w-20 shrink-0 text-right sm:max-w-none">
                <p className="text-xs font-bold leading-snug">{t("units", { count: item.quantity })}</p>
                <p className="mt-1 text-xs leading-snug">{formatCurrency(item.price)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <span className="font-semibold">{t("totalUnits")}</span>
            <span className="font-bold">{totalItems}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="font-semibold">{t("orderTotal")}</span>
            <span className="font-bold">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {order.status !== "Order Sent" && (
        <div className="z-10 shrink-0 border-t bg-card p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-3">
            {/* ReOrder - Left */}
            <Button
              variant="outline"
              className="h-11 w-full text-primary"
              onClick={() => {
                setReOrderItems(
                  order.items.map((item) => ({
                    ...item,
                    quantity: Number(item.quantity) || 1,
                  }))
                )
                setReOrderModalOpen(true)
              }}
            >
              Reorder
            </Button>

            <Button
              variant="outline"
              className="h-11 w-full text-primary"
            >
              <Download className="size-4" />
              {t("downloadInvoice")}
            </Button>
          </div>
        </div>
      )}

      {/* For modal */}
      {reOrderModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border bg-card shadow-xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b p-4">
              <div>
                <h2 className="text-base font-bold">
                  Reorder
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {t("orderNumber", { number: order.orderNumber })}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setReOrderModalOpen(false)}
                aria-label="Close"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[65vh] overflow-y-auto p-4">


              <div className="mt-0 divide-y rounded-lg border">
                {reOrderItems.map((item) => {
                  const quantity = Number(item.quantity) || 1
                  const price = Number(item.price) || 0
                  const itemTotal = quantity * price

                  return (
                    <div
                      key={item.id}
                      className="relative flex gap-3 p-3"
                    >
                      {/* Delete Button - Top Right */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-2 top-2"
                        onClick={() => {
                          setReOrderItems((currentItems) =>
                            currentItems.filter(
                              (currentItem) =>
                                currentItem.id !== item.id
                            )
                          )
                        }}
                        aria-label="Delete product"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>

                      {/* Product Image */}
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          {item.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {t("brand")} {item.brand}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {t("packSize")} {item.packSize}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          SKU: {item.sku}
                        </p>

                        {/* Quantity Selector */}
                        <div className="mt-2 inline-flex items-center rounded-md border bg-background">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="size-7"
                            onClick={() => {
                              setReOrderItems((currentItems) =>
                                currentItems.map((currentItem) =>
                                  currentItem.id === item.id
                                    ? {
                                      ...currentItem,
                                      quantity: Math.max(
                                        1,
                                        Number(currentItem.quantity) - 1
                                      ),
                                    }
                                    : currentItem
                                )
                              )
                            }}
                          >
                            <Minus className="size-3.5" />
                          </Button>

                          <span className="min-w-7 text-center text-xs font-semibold">
                            {quantity}
                          </span>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="size-7"
                            onClick={() => {
                              setReOrderItems((currentItems) =>
                                currentItems.map((currentItem) =>
                                  currentItem.id === item.id
                                    ? {
                                      ...currentItem,
                                      quantity:
                                        Number(currentItem.quantity) + 1,
                                    }
                                    : currentItem
                                )
                              )
                            }}
                          >
                            <Plus className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Units / Price */}
                      <div className="w-20 shrink-0 pt-8 absolute bottom-2 right-2 text-right">
                        <p className="text-sm font-bold">
                          {t("units", { count: quantity })}
                        </p>

                        <p className="mt-1 text-sm">
                          {formatCurrency(itemTotal)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              
            </div>

                <div className="flex flex-col gap-2 border-t p-4 pb-0">
                {/* Order Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">
                    {t("totalUnits")}
                  </span>

                  <span className="font-bold">
                    {reOrderItems.reduce(
                      (sum, item) =>
                        sum + (Number(item.quantity) || 0),
                      0
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="font-semibold">
                    {t("orderTotal")}
                  </span>

                  <span className="font-bold">
                    {formatCurrency(
                      reOrderItems.reduce(
                        (sum, item) =>
                          sum +
                          (Number(item.quantity) || 0) *
                          (Number(item.price) || 0),
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t p-4">
              <Button
                variant="outline"
                onClick={() => setReOrderModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  // ReOrder action will be added here
                }}
              >
                Add to Cart
              </Button>
            </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  )
}
