"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

import { myOrders } from "@/data/my-orders"
import { cn } from "@/lib/utils"

import OrderList from "./OrderList"
import OrderDetails from "./OrderDetails"

export const statusFilters = ["all", "upcoming", "past"]
export const typeFilters = ["App/Web", "Others"]

export const statusStyles = {
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

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export function getOrderBucket(order) {
  if (order.status === "Order Sent") return "upcoming"
  return "past"
}

export default function MyOrders() {
  const t = useTranslations("myOrders")
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("All Types")

  const filteredOrders = useMemo(
    () =>
      myOrders.filter((order) => {
        const matchesStatus =
          statusFilter === "all" || getOrderBucket(order) === statusFilter

        const matchesType = typeFilter === "All Types" || order.type === typeFilter

        return matchesStatus && matchesType
      }),
    [statusFilter, typeFilter],
  )

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) || null

  return (
    <main className="grid min-h-full gap-4 bg-background p-3 sm:p-4 xl:h-full xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_minmax(360px,430px)] xl:pb-6">
      <div className={cn("min-h-0", selectedOrder ? "hidden xl:block" : "block")}>
        <OrderList
          orders={myOrders}
          filteredOrders={filteredOrders}
          selectedOrder={selectedOrder}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
          onSelectOrder={setSelectedOrderId}
        />
      </div>

      <div className={cn("h-full min-h-0", selectedOrder ? "block" : "hidden xl:block")}>
        {selectedOrder ? (
          <OrderDetails
            order={selectedOrder}
            onBack={() => setSelectedOrderId(null)}
            onClose={() => setSelectedOrderId(null)}
          />
        ) : (
          <section className="hidden h-full min-h-[18rem] place-items-center rounded-lg border bg-card xl:grid">
            <p className="px-4 text-center text-sm text-muted-foreground">
              {t("selectOrder")}
            </p>
          </section>
        )}
      </div>
    </main>
  )
}
