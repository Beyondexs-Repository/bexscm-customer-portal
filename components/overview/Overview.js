"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ChevronRight, PackageCheck, Truck } from "lucide-react"

import { myOrders } from "@/data/my-orders"
import Messages from "../messages/Messages"
import WelcomeCard from "./WelcomeCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusStyles = {
  green:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800",
  orange:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800",
  violet:
    "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:ring-violet-800",
  blue: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:ring-sky-800",
  slate:
    "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function ReorderRow({ order }) {
  return (
    <Link
      href="/my-orders"
      className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border bg-card p-3 text-left shadow-sm transition-colors hover:bg-muted/50"
    >
      <div className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
        <Truck className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-xs font-bold">Order #{order.orderNumber}</p>
          <Badge
            className={cn(
              "h-5 px-2 text-[10px] ring-1",
              statusStyles[order.statusTone],
            )}
          >
            {order.status}
          </Badge>
        </div>
        <p className="mt-1 truncate text-[11px] text-muted-foreground">
          {order.items.length} items - {order.type} - {formatCurrency(order.total)}
        </p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  )
}

function Reorders() {
  const recentOrders = myOrders.slice(0, 5)
  const t = useTranslations("overview")

  return (
    <section className="rounded-lg border bg-background p-2 shadow-sm sm:p-3">
      <div className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PackageCheck className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-tight">{t("recentOrders")}</h2>
            <p className="text-xs leading-snug text-muted-foreground">{t("recentOrdersDescription")}</p>
          </div>
        </div>

        <Button asChild variant="outline" size="sm" className="w-full justify-center sm:w-auto">
          <Link href="/my-orders">
            {t("viewOrders")}
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-3 grid gap-3">
        {recentOrders.map((order) => (
          <ReorderRow key={order.id} order={order} />
        ))}
      </div>
    </section>
  )
}

export default function Overview() {
  return (
    <>
      <WelcomeCard />
      <div>
        <Reorders />
      </div>
    </>
  )
}
