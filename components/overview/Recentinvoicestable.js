"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useSelector } from "react-redux"
import { ChevronRight, Loader2, PackageCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { can } from "@/lib/permissions"
import { cn } from "@/lib/utils"

const RECENT_LIMIT = 5

const statusStyles = {
  green:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800",
  orange:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800",
  violet:
    "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:ring-violet-800",
  blue:
    "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:ring-sky-800",
  slate:
    "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
}

function getStatusTone(status = "") {
  const value = String(status).toLowerCase()
  if (value.includes("delivered") || value.includes("completed")) return "orange"
  if (value.includes("sent") || value.includes("pending") || value.includes("open") || value.includes("created")) return "green"
  if (value.includes("processing") || value.includes("shipped")) return "violet"
  if (value.includes("cancelled") || value.includes("canceled") || value.includes("void")) return "slate"
  return "blue"
}

function formatDate(value, locale) {
  if (!value) return "—"

  // Treat API date-only values as local calendar dates to avoid timezone shifts.
  const dateOnly = typeof value === "string" && /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value)

  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function formatCurrency(value, locale) {
  const amount = Number(value)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(amount) ? amount : 0)
}

export default function RecentOrdersTable() {
  const t = useTranslations("recentInvoices")
  const tOrders = useTranslations("myOrders")
  const locale = useLocale()

  const orders = useSelector((state) => state.getSlice.overviewData?.recentOrders)
  const isLoading = useSelector((state) => state.getSlice.overviewLoading)
  const error = useSelector((state) => state.getSlice.overviewError)

  const [role, setRole] = useState(null)
  useEffect(() => {
    setRole(localStorage.getItem("roles"))
  }, [])

  // The Overview API already returns recent orders newest first.
  const recentOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []).slice(0, RECENT_LIMIT),
    [orders],
  )
  const errorMessage =
    typeof error === "string" ? error : error?.message || "Something went wrong"

  const displayOrders = useMemo(
    () => recentOrders.map((order, index) => {
      const orderNumber = String(
        order.orderNumber ?? order.OrderNumber ?? order.orderNo ?? order.SOPNUMBE ?? order.id ?? "—",
      ).trim()
      const status = String(order.status ?? order.Status ?? "—").trim()
      const deliveryDate = order.deliveryDate ?? order.DeliveryDate ?? order.reqDate ?? order.REQDATE
      const statusKey = `status.${status.toLowerCase()}`

      return {
        key: order.id ?? order.orderNumber ?? `${orderNumber}-${index}`,
        orderId: String(order.id ?? order.orderId ?? orderNumber),
        orderNumber,
        placedOn: formatDate(order.orderDate, locale),
        deliveryDate: formatDate(deliveryDate, locale),
        orderType: order.type ?? order.createType ?? order.source ?? order.Source ?? "—",
        total: formatCurrency(order.total ?? order.Total ?? order.orderAmount ?? order.amount, locale),
        status,
        statusKey,
        statusTone: statusStyles[order.statusTone] ? order.statusTone : getStatusTone(status),
      }
    }),
    [locale, recentOrders],
  )

  if (role === null || !can(role, "dashboard.recentInvoices")) return null

  return (
    <section className="h-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PackageCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold sm:text-lg">Recent Orders</h2>
            <p className="text-xs text-muted-foreground">
              View and manage your latest orders
            </p>
          </div>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/my-orders">
            {t("viewAll")}
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {isLoading ? (
          <div className="flex min-h-32 items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            Loading orders...
          </div>
        ) : error ? (
          <p className="py-8 text-center text-xs font-semibold text-destructive">{errorMessage}</p>
        ) : displayOrders.length > 0 ? (
          displayOrders.map((order) => (
            <Link
              key={order.key}
              href={`/my-orders?id=${encodeURIComponent(order.orderId)}`}
              className="block rounded-xl border bg-card p-3 text-left shadow-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`View order ${order.orderNumber}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">Order No.</p>
                  <p className="truncate text-sm font-bold">{order.orderNumber}</p>
                </div>
                <Badge className={cn("shrink-0 whitespace-nowrap px-2 text-[10px] ring-1", statusStyles[order.statusTone])}>
                  {t.has(order.statusKey) ? t(order.statusKey) : order.status}
                </Badge>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                <div>
                  <p className="text-[11px] text-muted-foreground">{tOrders("placedOnLabel")}</p>
                  <p className="font-semibold">{order.placedOn}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{tOrders("deliveryDate")}</p>
                  <p className="font-semibold">{order.deliveryDate}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{tOrders("type")}</p>
                  <p className="font-semibold">{order.orderType}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{t("columns.total")}</p>
                  <p className="font-semibold">{order.total}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">No orders found</p>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Order No.</th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">{tOrders("placedOnLabel")}</th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">{tOrders("deliveryDate")}</th>
              <th scope="col" className="px-4 py-3 font-semibold">{tOrders("type")}</th>
              <th scope="col" className="px-4 py-3 font-semibold">{t("columns.total")}</th>
              <th scope="col" className="px-4 py-3 font-semibold">{t("columns.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  <span className="inline-flex items-center gap-2 text-xs font-medium">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    Loading orders...
                  </span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-xs font-semibold text-destructive">
                  {errorMessage}
                </td>
              </tr>
            ) : displayOrders.length > 0 ? (
              displayOrders.map((order) => (
                  <tr key={order.key} className="transition-colors hover:bg-muted/40">
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      <Link
                        href={`/my-orders?id=${encodeURIComponent(order.orderId)}`}
                        className="font-semibold text-foreground hover:text-primary hover:underline"
                        aria-label={`View order ${order.orderNumber}`}
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      {order.placedOn}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      {order.deliveryDate}
                    </td>
                    <td className="px-4 py-3 text-xs">{order.orderType}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold">
                      {order.total}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn("whitespace-nowrap px-2 text-[10px] ring-1", statusStyles[order.statusTone])}>
                        {t.has(order.statusKey) ? t(order.statusKey) : order.status}
                      </Badge>
                    </td>
                  </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
