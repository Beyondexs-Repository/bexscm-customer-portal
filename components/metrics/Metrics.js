"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ClipboardList, CreditCard, ReceiptText, ShoppingBag, TriangleAlert, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MetricPanel from "./MetricPanel"
import { CategoryPie, HorizontalBars, OrderBars, PaymentDonut, StatusChart, TrendChart } from "./MetricCharts"
import { InvoiceTable, ProductTable } from "./MetricTables"
import { account, aging, categories, invoices, money, orderStatuses, periods, products } from "./metrics-data"

export default function Metrics() {
  const [period, setPeriod] = useState("month")
  const [productMetric, setProductMetric] = useState("spend")
  const data = periods[period]
  const purchases = data.purchases.reduce((sum, value) => sum + value, 0)
  const previousPurchases = data.previous.reduce((sum, value) => sum + value, 0)
  const orders = data.orders.reduce((sum, value) => sum + value, 0)
  const eligibleOrders = data.eligibleOrders.reduce((sum, value) => sum + value, 0)
  const orderAmount = data.orderValues.reduce((sum, value, index) => sum + value * data.eligibleOrders[index], 0)
  const outstanding = invoices.reduce((sum, invoice) => sum + invoice.balance, 0)
  const overdue = invoices.filter((invoice) => invoice.overdueDays > 0).reduce((sum, invoice) => sum + invoice.balance, 0)
  const purchaseChange = ((purchases - previousPurchases) / previousPurchases * 100).toFixed(1)
  const periodProducts = products.map((product) => ({
    ...product,
    orders: Math.round(product.orders * data.productMultiplier),
    quantity: Math.round(product.quantity * data.productMultiplier),
    spend: product.spend * data.productMultiplier,
  }))
  const topProducts = periodProducts.toSorted((a, b) => b[productMetric] - a[productMetric]).slice(0, 5)
  const stats = [
    { label: "Invoiced purchases", value: money.format(purchases), icon: CreditCard, color: "text-primary bg-primary/10" },
    { label: "Orders placed", value: orders, icon: ClipboardList, color: "text-violet-600 bg-violet-500/10 dark:text-violet-400" },
    { label: "Average order value", value: money.format(eligibleOrders ? orderAmount / eligibleOrders : 0), icon: ShoppingBag, color: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" },
    { label: "Outstanding balance", value: money.format(outstanding), icon: ReceiptText, color: "text-amber-600 bg-amber-500/10 dark:text-amber-400" },
    { label: "Overdue balance", value: money.format(overdue), icon: TriangleAlert, color: "text-orange-600 bg-orange-500/10 dark:text-orange-400" },
  ]

  return (
    <main className="mx-auto grid w-full min-w-0 max-w-[1600px] gap-4 p-2 sm:gap-5 sm:p-4">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="text-base font-semibold">Purchasing summary</h1>
          <p className="mt-1 text-xs text-muted-foreground">Your purchasing activity and account balances at a glance.</p>
        </div>
        <select id="metrics-period" aria-label="Date range" value={period} onChange={(event) => setPeriod(event.target.value)} className="block h-9 w-36 rounded-lg border border-primary/30 bg-card pl-3 text-xs font-medium text-foreground focus-visible:outline-2 focus-visible:outline-ring sm:w-40">
          {Object.entries(periods).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
        </select>
      </div>

      <section aria-label="Purchasing summary" className="flex flex-wrap gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="min-w-0 flex-1 basis-[calc(50%-0.75rem)] gap-0 py-0 md:basis-[calc(33.333%-0.75rem)] xl:basis-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2"><p className="text-xs leading-5 text-muted-foreground">{label}</p><span className={`rounded-lg p-2 ${color}`}><Icon aria-hidden="true" className="size-4" /></span></div>
              <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <MetricPanel title="Purchases over time" description="Invoiced purchases compared with the preceding period.">
          <div className="mb-1 flex flex-wrap items-center gap-3"><p className="text-2xl font-semibold tabular-nums">{money.format(purchases)}</p><span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"><TrendingUp aria-hidden="true" className="size-3.5" />{purchaseChange}%</span></div>
          <TrendChart labels={data.labels} values={data.purchases} previous={data.previous} label="Invoiced purchases and previous period comparison" />
        </MetricPanel>
        <MetricPanel title="Spend by category" description="Your share of invoiced purchases by product category.">
          <CategoryPie categories={categories} total={purchases} />
        </MetricPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MetricPanel title="Order activity" description="Orders placed in each interval, including cancelled orders.">
          <OrderBars labels={data.labels} orders={data.orders} />
        </MetricPanel>
        <MetricPanel title="Average order value" description="Average value of non-cancelled orders in each interval.">
          <TrendChart labels={data.labels} values={data.orderValues} label="Average order value over time" />
        </MetricPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MetricPanel title="Top purchased products" description="Your five leading products in the selected period."
          action={<select aria-label="Rank top products by" value={productMetric} onChange={(event) => setProductMetric(event.target.value)} className="h-8 rounded-md border bg-background pl-2 text-xs focus-visible:outline-2 focus-visible:outline-ring"><option value="spend">By spend</option><option value="orders">By order frequency</option></select>}>
          <HorizontalBars currency={productMetric === "spend"} items={topProducts.map((product) => ({ name: product.name, value: product[productMetric] }))} />
        </MetricPanel>
        <MetricPanel title="Order status" description="Current status of orders placed in the selected period."
          action={<Button asChild size="sm"><Link href="/my-orders">My Orders<ArrowRight aria-hidden="true" className="size-3.5" /></Link></Button>}>
          <p className="mb-4 text-2xl font-semibold">{orders}<span className="ml-2 text-xs font-normal text-muted-foreground">total orders</span></p>
          <StatusChart statuses={orderStatuses.map((status, index) => ({ ...status, value: data.statuses[index] }))} />
        </MetricPanel>
      </div>

      <ProductTable products={periodProducts} />

      <div className="flex flex-wrap items-end justify-between gap-2 pt-2">
        <div><h2 className="text-base font-semibold">Payments & balances</h2><p className="mt-1 text-xs text-muted-foreground">Current account position across all invoice dates.</p></div>
        <p className="text-xs text-muted-foreground">As of {account.asOf}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <MetricPanel title="Invoice payment status" description={`${money.format(account.invoiced)} invoiced across your account.`}>
          <PaymentDonut total={account.invoiced} paid={account.paid} />
          <p className="mt-4 border-t pt-4 text-xs text-muted-foreground">Next payment due: October 30, 2026 <span className="font-semibold text-foreground">· {money.format(1140)}</span></p>
        </MetricPanel>
        <MetricPanel title="Outstanding invoice aging" description="Unpaid balances grouped by days past the due date.">
          <HorizontalBars currency items={aging.map((item) => ({ ...item, value: item.amount }))} />
        </MetricPanel>
      </div>
      <MetricPanel title="Invoices requiring attention" description="Overdue invoices first, followed by upcoming payments." table
        action={<Button asChild size="sm"><Link href="/invoices">View invoices<ArrowRight aria-hidden="true" className="size-3.5" /></Link></Button>}>
        <InvoiceTable invoices={invoices} />
      </MetricPanel>
    </main>
  )
}
