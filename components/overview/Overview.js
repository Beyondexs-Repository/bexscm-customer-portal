import Link from "next/link"
import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  MessageSquareText,
  PackageCheck,
  ShoppingBag,
} from "lucide-react"

import QuickOrderGuide from "./QuickOrderGuide"
import WelcomeCard from "./WelcomeCard"
import { getRecentInvoices } from "./recent-invoices"
import { Badge } from "@/components/ui/badge"
import RecommendedItems from "./RecommendedItems"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

const quickActions = [
  {
    title: "Order Guide",
    description: "Step-by-step ordering",
    href: "/order-guide",
    icon: BookOpen,
    iconClassName:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  {
    title: "Browse Catalog",
    description: "Explore all products",
    href: "/catalog",
    icon: ShoppingBag,
    iconClassName:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
  },
  {
    title: "Recent Orders",
    description: "View your past orders",
    href: "/my-orders",
    icon: ClipboardList,
    iconClassName:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
  },
  {
    title: "Messages",
    description: "Contact your team",
    href: "/messages",
    icon: MessageSquareText,
    iconClassName:
      "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300",
  },
]

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function QuickActions() {
  return (
    <section aria-label="Quick actions">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex min-w-0 items-center gap-2 rounded-xl border bg-card p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:gap-3 sm:p-3"
            >
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full sm:size-10",
                  action.iconClassName,
                )}
              >
                <Icon className="size-4 sm:size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold sm:text-sm">
                  {action.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function RecentOrdersTable() {
  const recentOrders = getRecentInvoices(5)

  return (
    <section className="h-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PackageCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold sm:text-lg">Recent Invoices</h2>
            {/* <h2 className="text-base font-bold sm:text-lg">Recent Orders</h2> */}
            <p className="text-xs text-muted-foreground">
              View and manage your latest orders
            </p>
          </div>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/invoices">
            View all invoices
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Invoice</th>
              <th className="px-4 py-3 font-semibold">Invoice date</th>
              <th className="px-4 py-3 font-semibold">Due date</th>
              <th className="px-4 py-3 font-semibold">Items</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Paid amount</th>
              <th className="px-4 py-3 font-semibold">Balance</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="relative cursor-pointer transition-colors hover:bg-muted/40"
              >
                <td className="px-4 py-2">
                  <Link
                    href={`/invoices/details/?id=${encodeURIComponent(order.invoiceNumber)}`}
                    aria-label={`View invoice ${order.invoiceNumber}`}
                    className="absolute inset-0 z-10"
                  />
                  <span className="font-semibold text-foreground">
                    #{order.invoiceNumber}
                  </span>
                  {/* <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Customer {order.customerId}
                  </p> */}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-xs">
                  {order.invoiceDateLabel}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-xs">
                  {order.dueDateLabel}
                </td>
                <td className="px-4 py-2 text-xs">
                  {order.itemCount} products
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {order.units} units
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-semibold">
                  {formatCurrency(order.total)}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-semibold">
                  {formatCurrency(order.paidAmount)}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-semibold">
                  {formatCurrency(order.balance)}
                </td>
                <td className="px-4 py-2">
                  <Badge
                    className={cn(
                      "whitespace-nowrap px-2 text-[10px] ring-1",
                      statusStyles[order.statusTone],
                    )}
                  >
                    {order.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function Overview() {
  return (
    <main className="grid gap-3 sm:gap-4">
      <WelcomeCard />
      <QuickActions />
      <RecommendedItems />
      <div className="grid items-stretch gap-3 sm:gap-4 lg:grid-cols-3">
        <div className="order-1 h-full min-w-0 lg:order-2 lg:col-span-1">
          <QuickOrderGuide />
        </div>
        <div className="order-2 h-full min-w-0 lg:order-1 lg:col-span-2">
          <RecentOrdersTable />
        </div>
      </div>
    </main>
  )
}
