"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  CalendarClock,
  ChevronLeft,
  CircleDollarSign,
  Download,
  PackageCheck,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PAGE_ACTIONS,
  canAccessPageAction,
  getBrowserRole,
} from "@/lib/security/role-access"
import { cn } from "@/lib/utils"
import { DownloadInvoice } from "@/lib/PdfGenerators/DownloadInvoice"

import { formatCurrency, statusStyles } from "./MyOrders"

export default function OrderDetails({ order, onBack, onClose }) {
  const t = useTranslations("myOrders")
  const [loginRole] = useState(getBrowserRole)
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const canDownloadInvoice = canAccessPageAction(
    loginRole,
    "/my-orders",
    PAGE_ACTIONS.DOWNLOAD_INVOICE
  )

  return (
    <section className="flex h-full min-h-0 flex-col rounded-lg border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b p-3 sm:p-4">
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

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-3 pb-24 sm:p-4 xl:pb-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="min-w-0 rounded-lg bg-emerald-50 p-2 text-foreground dark:bg-emerald-800/5 dark:ring-1 dark:ring-emerald-900/80 sm:p-3">
            <CalendarClock className="mb-2 size-4 text-emerald-600" />
            <p className="text-[10px] leading-snug sm:text-[11px]">
              <span className="text-muted-foreground dark:text-emerald-100/70">
                {t("placedOnLabel")}{" "}
              </span>
              <p className="break-words text-[11px] font-bold leading-snug sm:text-xs">
              {order.placedOn}
              </p>
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

        <h3 className="mt-5 text-sm font-bold">{t("orderItems")}</h3>

        <div className="mt-3 divide-y rounded-lg border">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 p-3">
              <div
                role="img"
                aria-label={item.name}
                className="size-14 shrink-0 rounded-md bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />

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

      {canDownloadInvoice && order.status !== "Order Sent" && (
        <div className="border-t p-3 sm:p-4">
          <Button variant="outline" className="h-11 w-full text-primary" onClick={() => DownloadInvoice(order)}>
            <Download className="size-4" />
            {t("downloadInvoice")}
          </Button>
        </div>
      )}
    </section>
  )
}
