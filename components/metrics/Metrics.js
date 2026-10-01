

"use client"

import { useState } from "react"
import { getPeriodMetrics, periods } from "./metrics-data"
import { CategoryPie, OrderBars, PaymentDonut, ProductBars, SpendingGraph } from "./MetricCharts"
import Link from "next/link"
import { ArrowRight, ChevronDown, ClipboardList, CreditCard, ReceiptText, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

function PeriodSelect({ id, value, onChange }) {
  return (
    <div className="relative shrink-0">
      <label htmlFor={id} className="sr-only">Select period</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-36 cursor-pointer appearance-none rounded-lg border bg-card py-2 pl-3 pr-9 text-sm font-medium shadow-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30">
        {Object.entries(periods).map(([key, period]) => <option key={key} value={key}>{period.label}</option>)}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-3 size-4 text-muted-foreground" />
    </div>
  )
}

function PanelHeading({ title, description, children }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b p-4 sm:p-5">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}

export default function Metrics() {
  const [spendingPeriod, setSpendingPeriod] = useState("month")
  const [categoryPeriod, setCategoryPeriod] = useState("month")
  const [orderPeriod, setOrderPeriod] = useState("month")
  const [productPeriod, setProductPeriod] = useState("month")
  const [invoicePeriod, setInvoicePeriod] = useState("month")
  const spending = getPeriodMetrics(spendingPeriod)
  const categoryMetrics = getPeriodMetrics(categoryPeriod)
  const orderMetrics = getPeriodMetrics(orderPeriod)
  const productMetrics = getPeriodMetrics(productPeriod)
  const invoiceMetrics = getPeriodMetrics(invoicePeriod)
  const { label, unpaid, balance, spend, orderCount } = spending
  const stats = [
    { label: "Total spend", value: money.format(spend), detail: "Purchases in the selected period", icon: CreditCard },
    { label: "Orders placed", value: orderCount, detail: "Orders in the selected period", icon: ClipboardList },
    { label: "Average order value", value: money.format(spend / orderCount), detail: `Across ${orderCount} orders`, icon: ShoppingBag },
    { label: "Outstanding balance", value: money.format(balance), detail: `${unpaid} unpaid invoices · none overdue`, icon: ReceiptText },
  ]
  return (
    <main className="mx-auto grid w-full max-w-[1600px] gap-4 p-4 sm:gap-5 sm:p-6">
      <p className="sr-only" role="status">{label}: {money.format(spend)} spent across {orderCount} orders.</p>
      <section aria-label="Purchasing summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon aria-hidden="true" className="size-4" /></span>
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-5">
        <section className="min-w-0 rounded-xl border bg-card shadow-sm xl:col-span-3" aria-label="Spending trend">
          <PanelHeading title="Spending over time" description={`Your purchases in USD · ${spending.dates}`}>
            <PeriodSelect id="spending-period" value={spendingPeriod} onChange={setSpendingPeriod} />
          </PanelHeading>
          <div className="p-4 sm:p-5">
            <p className="text-2xl font-semibold tabular-nums">{money.format(spend)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Total purchases over this period</p>
            <SpendingGraph labels={spending.labels} amounts={spending.amounts} />
          </div>
        </section>
        <section className="min-w-0 rounded-xl border bg-card shadow-sm xl:col-span-2" aria-label="Category spending">
          <PanelHeading title="Spend by category" description={`Your purchasing mix · ${categoryMetrics.dates}`}>
            <PeriodSelect id="category-period" value={categoryPeriod} onChange={setCategoryPeriod} />
          </PanelHeading>
          <div className="p-4 sm:p-5">
            <CategoryPie categories={categoryMetrics.categories} />
            <ul className="space-y-5">
              {categoryMetrics.categories.map(({ name, amount, color }) => (
                <li key={name} className="flex items-center gap-2 text-xs">
                  <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                  <span className="flex-1">{name}</span>
                  <span className="font-semibold tabular-nums">{money.format(amount)}</span>
                  <span className="w-9 text-right tabular-nums text-muted-foreground">{Math.round(amount / categoryMetrics.spend * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="rounded-xl border bg-card shadow-sm">
        <PanelHeading title="Order activity" description={`Number of orders placed · ${orderMetrics.dates}`}>
          <PeriodSelect id="order-period" value={orderPeriod} onChange={setOrderPeriod} />
        </PanelHeading>
        <div className="p-4 sm:p-5"><OrderBars labels={orderMetrics.labels} orders={orderMetrics.orders} /></div>
      </section>
      <div className="grid items-stretch gap-4 xl:grid-cols-5">
        <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm xl:col-span-3">
          <PanelHeading title="Frequently ordered products" description={`Your top 5 products by order frequency · ${productMetrics.dates}`}>
            <PeriodSelect id="product-period" value={productPeriod} onChange={setProductPeriod} />
          </PanelHeading>
          <div className="flex-1 p-4 sm:p-5"><ProductBars products={productMetrics.products} /></div>
          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <Button asChild variant="outline" className="w-full"><Link href="/order-guide">Order guide<ArrowRight aria-hidden="true" className="size-4" /></Link></Button>
          </div>
        </section>
        <section className="flex h-full flex-col rounded-xl border bg-card shadow-sm xl:col-span-2">
          <PanelHeading title="Invoice summary" description={`Payment status · ${invoiceMetrics.dates}`}>
            <PeriodSelect id="invoice-period" value={invoicePeriod} onChange={setInvoicePeriod} />
          </PanelHeading>
          <div className="flex flex-1 flex-col space-y-5 p-4 sm:p-5">
            <PaymentDonut spend={invoiceMetrics.spend} balance={invoiceMetrics.balance} />
            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-xs text-muted-foreground">Remaining to pay</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{money.format(invoiceMetrics.balance)}</p>
              <p className="mt-2 text-xs text-muted-foreground">Next payment due: October 7, 2026</p>
            </div>
            <dl className="space-y-3 text-xs">
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Total invoiced · {invoiceMetrics.orderCount} invoices</dt><dd className="font-semibold tabular-nums">{money.format(invoiceMetrics.spend)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Paid · {invoiceMetrics.orderCount - invoiceMetrics.unpaid} invoices</dt><dd className="font-semibold tabular-nums">{money.format(invoiceMetrics.spend - invoiceMetrics.balance)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Overdue</dt><dd className="font-semibold tabular-nums">{money.format(0)}</dd></div>
            </dl>
            <Button asChild variant="outline" className="mt-auto w-full"><Link href="/invoices">View invoices<ArrowRight aria-hidden="true" className="size-4" /></Link></Button>
          </div>
        </section>
      </div>
    </main>
  )
}
