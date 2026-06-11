"use client"

import { useTranslations } from "next-intl"
import {
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  Filter,
  PackageCheck,
  Truck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import { formatCurrency, statusFilters, statusStyles, typeFilters } from "./MyOrders"

function StatCard({ icon: Icon, value, label, tone }) {
  return (
    <div className="min-w-0 rounded-lg border bg-card p-2.5 shadow-sm sm:p-3">
      <div className="flex min-w-0 items-center gap-2">
        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", tone)}>
          <Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="break-words text-base font-bold leading-none tracking-normal sm:text-lg">
            {value}
          </p>
          <p className="mt-1 text-[10px] font-semibold leading-tight text-muted-foreground sm:text-[11px]">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

function OrderRow({ order, selected, onSelect }) {
  const t = useTranslations("myOrders")

  return (
    <button
      type="button"
      onClick={() => onSelect(order.id)}
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border bg-card p-3 text-left shadow-sm transition-colors hover:bg-muted/50 sm:p-4 md:grid-cols-[minmax(0,2fr)_minmax(7rem,1.2fr)_minmax(5rem,1fr)_minmax(5.5rem,1fr)_auto] md:items-center md:gap-4 lg:gap-6",
        selected && "border-primary",
      )}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-xs font-bold">
            {t("orderNumber", { number: order.orderNumber })}
          </p>

          <Badge className={cn("h-auto shrink-0 px-2 py-0.5 text-[10px] leading-none ring-1", statusStyles[order.statusTone])}>
            {order.status}
          </Badge>
        </div>

        <p className="mt-1 line-clamp-2 text-[11px] leading-snug">
          <span className="text-muted-foreground">{t("placedOnLabel")} </span>
          <span className="font-semibold text-foreground">{order.placedOn}</span>
          <span className="text-muted-foreground"> {t("at")} {order.placedAt}</span>
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3 md:hidden">
          <div>
            <p className="text-[11px] text-muted-foreground">{t("delivery")}</p>
            <p className="text-xs font-bold leading-snug">{order.deliveryDate}</p>
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground">{t("total")}</p>
            <p className="text-xs font-bold leading-snug">{formatCurrency(order.total)}</p>
          </div>
        </div>
      </div>

      <div className="hidden min-w-0 md:block">
        <p className="text-[11px] text-muted-foreground">{t("deliveryDate")}</p>
        <p className="text-xs font-bold leading-snug">{order.deliveryDate}</p>
      </div>

      <div className="hidden min-w-0 md:block">
        <p className="text-[11px] text-muted-foreground">{t("type")}</p>
        <p className="break-words text-xs font-bold leading-snug">{order.type}</p>
      </div>

      <div className="hidden pr-2 text-right md:block">
        <p className="text-[11px] text-muted-foreground">{t("total")}</p>
        <p className="whitespace-nowrap text-xs font-bold">{formatCurrency(order.total)}</p>
      </div>

      <ChevronRight className="mt-1 size-4 text-muted-foreground md:mt-0" />
    </button>
  )
}

export default function OrderList({
  orders,
  filteredOrders,
  selectedOrder,
  statusFilter,
  typeFilter,
  onStatusFilterChange,
  onTypeFilterChange,
  onSelectOrder,
}) {
  const t = useTranslations("myOrders")
  const deliveredCount = orders.filter((order) => order.status === "Delivered").length
  const upcomingCount = orders.filter((order) => order.status === "Order Sent").length
  const totalThisMonth = orders.reduce((sum, order) => sum + order.total, 0)
  const statusFilterLabels = {
    all: t("allOrders"),
    upcoming: t("upcoming"),
    past: t("past"),
  }

  return (
    <div className="min-h-0 space-y-4 pb-2">
      <section className="grid grid-cols-2 gap-3 min-[1420px]:grid-cols-4">
        <StatCard icon={Truck} value={orders.length} label={t("totalOrders")} tone="bg-emerald-50 text-emerald-600" />
        <StatCard icon={PackageCheck} value={deliveredCount} label={t("ordersDelivered")} tone="bg-violet-50 text-violet-600" />
        <StatCard icon={CalendarClock} value={upcomingCount} label={t("upcomingOrders")} tone="bg-orange-50 text-orange-600" />
        <StatCard icon={CircleDollarSign} value={formatCurrency(totalThisMonth)} label={t("totalSpend")} tone="bg-blue-50 text-blue-600" />
      </section>

      <section className="flex min-h-0 flex-col rounded-lg border bg-background p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-tight sm:text-xl">{t("recentOrders")}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{t("filterHint")}</p>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="grid grid-cols-3 rounded-lg bg-muted p-1">
              {statusFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={statusFilter === filter ? "default" : "ghost"}
                  size="sm"
                  className="h-9 min-w-0 px-2 text-[11px] sm:px-3 sm:text-xs"
                  onClick={() => onStatusFilterChange(filter)}
                >
                  <span className="truncate">{statusFilterLabels[filter]}</span>
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 min-w-0 justify-between gap-2 px-3">
                    <span className="flex min-w-0 items-center gap-2">
                      <Filter className="size-4 shrink-0" />
                      <span className="truncate">{typeFilter === "All Types" ? t("orderType") : typeFilter}</span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{t("type")}</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked={typeFilter === "All Types"} onCheckedChange={() => onTypeFilterChange("All Types")}>
                    {t("allTypes")}
                  </DropdownMenuCheckboxItem>
                  {typeFilters.map((type) => (
                    <DropdownMenuCheckboxItem key={type} checked={typeFilter === type} onCheckedChange={() => onTypeFilterChange(type)}>
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pt-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                selected={selectedOrder?.id === order.id}
                onSelect={onSelectOrder}
              />
            ))
          ) : (
            <div className="grid min-h-40 place-items-center rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground">{t("noOrdersFound")}</p>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-3 pb-1 text-xs text-muted-foreground">
          <span className="leading-snug">
            {t("showing", { start: filteredOrders.length > 0 ? 1 : 0, end: filteredOrders.length, total: orders.length })}
          </span>
        </div>
      </section>
    </div>
  )
}
