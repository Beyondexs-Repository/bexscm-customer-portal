// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { ArrowRight, ClipboardList, CreditCard, ReceiptText, ShoppingBag, TriangleAlert, TrendingUp } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import MetricPanel from "./MetricPanel"
// import { CategoryPie, HorizontalBars, OrderBars, PaymentDonut, StatusChart, TrendChart } from "./MetricCharts"
// import { InvoiceTable, ProductTable } from "./MetricTables"
// import { account, aging, categories, invoices, money, orderStatuses, periods, products } from "./metrics-data"

// export default function Metrics() {
//   const [period, setPeriod] = useState("month")
//   const [productMetric, setProductMetric] = useState("spend")
//   const data = periods[period]
//   const purchases = data.purchases.reduce((sum, value) => sum + value, 0)
//   const previousPurchases = data.previous.reduce((sum, value) => sum + value, 0)
//   const orders = data.orders.reduce((sum, value) => sum + value, 0)
//   const eligibleOrders = data.eligibleOrders.reduce((sum, value) => sum + value, 0)
//   const orderAmount = data.orderValues.reduce((sum, value, index) => sum + value * data.eligibleOrders[index], 0)
//   const outstanding = invoices.reduce((sum, invoice) => sum + invoice.balance, 0)
//   const overdue = invoices.filter((invoice) => invoice.overdueDays > 0).reduce((sum, invoice) => sum + invoice.balance, 0)
//   const purchaseChange = ((purchases - previousPurchases) / previousPurchases * 100).toFixed(1)
//   const periodProducts = products.map((product) => ({
//     ...product,
//     orders: Math.round(product.orders * data.productMultiplier),
//     quantity: Math.round(product.quantity * data.productMultiplier),
//     spend: product.spend * data.productMultiplier,
//   }))
//   const topProducts = periodProducts.toSorted((a, b) => b[productMetric] - a[productMetric]).slice(0, 5)
//   const stats = [
//     { label: "Invoiced purchases", value: money.format(purchases), icon: CreditCard, color: "text-primary bg-primary/10" },
//     { label: "Orders placed", value: orders, icon: ClipboardList, color: "text-violet-600 bg-violet-500/10 dark:text-violet-400" },
//     { label: "Average order value", value: money.format(eligibleOrders ? orderAmount / eligibleOrders : 0), icon: ShoppingBag, color: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" },
//     { label: "Outstanding balance", value: money.format(outstanding), icon: ReceiptText, color: "text-amber-600 bg-amber-500/10 dark:text-amber-400" },
//     { label: "Overdue balance", value: money.format(overdue), icon: TriangleAlert, color: "text-orange-600 bg-orange-500/10 dark:text-orange-400" },
//   ]

//   return (
//     <main className="mx-auto grid w-full min-w-0 max-w-[1600px] gap-4 p-2 sm:gap-5 sm:p-4">
//       <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
//         <div className="min-w-0">
//           <h1 className="text-base font-semibold">Purchasing summary</h1>
//           <p className="mt-1 text-xs text-muted-foreground">Your purchasing activity and account balances at a glance.</p>
//         </div>
//         <select id="metrics-period" aria-label="Date range" value={period} onChange={(event) => setPeriod(event.target.value)} className="block h-9 w-36 rounded-lg border border-primary/30 bg-card pl-3 text-xs font-medium text-foreground focus-visible:outline-2 focus-visible:outline-ring sm:w-40">
//           {Object.entries(periods).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
//         </select>
//       </div>

//       <section aria-label="Purchasing summary" className="flex flex-wrap gap-3">
//         {stats.map(({ label, value, icon: Icon, color }) => (
//           <Card key={label} className="min-w-0 flex-1 basis-[calc(50%-0.75rem)] gap-0 py-0 md:basis-[calc(33.333%-0.75rem)] xl:basis-0">
//             <CardContent className="p-3 sm:p-4">
//               <div className="flex items-start justify-between gap-2"><p className="text-xs leading-5 text-muted-foreground">{label}</p><span className={`rounded-lg p-2 ${color}`}><Icon aria-hidden="true" className="size-4" /></span></div>
//               <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </section>

//       <div className="grid gap-4 lg:grid-cols-2">
//         <MetricPanel title="Purchases over time" description="Invoiced purchases compared with the preceding period.">
//           <div className="mb-1 flex flex-wrap items-center gap-3"><p className="text-2xl font-semibold tabular-nums">{money.format(purchases)}</p><span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"><TrendingUp aria-hidden="true" className="size-3.5" />{purchaseChange}%</span></div>
//           <TrendChart labels={data.labels} values={data.purchases} previous={data.previous} label="Invoiced purchases and previous period comparison" />
//         </MetricPanel>
//         <MetricPanel title="Spend by category" description="Your share of invoiced purchases by product category.">
//           <CategoryPie categories={categories} total={purchases} />
//         </MetricPanel>
//       </div>

//       <div className="grid gap-4 lg:grid-cols-2">
//         <MetricPanel title="Order activity" description="Orders placed in each interval, including cancelled orders.">
//           <OrderBars labels={data.labels} orders={data.orders} />
//         </MetricPanel>
//         <MetricPanel title="Average order value" description="Average value of non-cancelled orders in each interval.">
//           <TrendChart labels={data.labels} values={data.orderValues} label="Average order value over time" />
//         </MetricPanel>
//       </div>

//       <div className="grid gap-4 lg:grid-cols-2">
//         <MetricPanel title="Top purchased products" description="Your five leading products in the selected period."
//           action={<select aria-label="Rank top products by" value={productMetric} onChange={(event) => setProductMetric(event.target.value)} className="h-8 rounded-md border bg-background pl-2 text-xs focus-visible:outline-2 focus-visible:outline-ring"><option value="spend">By spend</option><option value="orders">By order frequency</option></select>}>
//           <HorizontalBars currency={productMetric === "spend"} items={topProducts.map((product) => ({ name: product.name, value: product[productMetric] }))} />
//         </MetricPanel>
//         <MetricPanel title="Order status" description="Current status of orders placed in the selected period."
//           action={<Button asChild size="sm"><Link href="/my-orders">My Orders<ArrowRight aria-hidden="true" className="size-3.5" /></Link></Button>}>
//           <p className="mb-4 text-2xl font-semibold">{orders}<span className="ml-2 text-xs font-normal text-muted-foreground">total orders</span></p>
//           <StatusChart statuses={orderStatuses.map((status, index) => ({ ...status, value: data.statuses[index] }))} />
//         </MetricPanel>
//       </div>

//       <ProductTable products={periodProducts} />

//       <div className="flex flex-wrap items-end justify-between gap-2 pt-2">
//         <div><h2 className="text-base font-semibold">Payments & balances</h2><p className="mt-1 text-xs text-muted-foreground">Current account position across all invoice dates.</p></div>
//         <p className="text-xs text-muted-foreground">As of {account.asOf}</p>
//       </div>
//       <div className="grid gap-4 lg:grid-cols-2">
//         <MetricPanel title="Invoice payment status" description={`${money.format(account.invoiced)} invoiced across your account.`}>
//           <PaymentDonut total={account.invoiced} paid={account.paid} />
//           <p className="mt-4 border-t pt-4 text-xs text-muted-foreground">Next payment due: October 30, 2026 <span className="font-semibold text-foreground">· {money.format(1140)}</span></p>
//         </MetricPanel>
//         <MetricPanel title="Outstanding invoice aging" description="Unpaid balances grouped by days past the due date.">
//           <HorizontalBars currency items={aging.map((item) => ({ ...item, value: item.amount }))} />
//         </MetricPanel>
//       </div>
//       <MetricPanel title="Invoices requiring attention" description="Overdue invoices first, followed by upcoming payments." table
//         action={<Button asChild size="sm"><Link href="/invoices">View invoices<ArrowRight aria-hidden="true" className="size-3.5" /></Link></Button>}>
//         <InvoiceTable invoices={invoices} />
//       </MetricPanel>
//     </main>
//   )
// }


//chnaged by Radhika 19-nov-2026 -- without loading full corrected file
// "use client"

// import { useEffect, useMemo, useState } from "react"
// import Link from "next/link"
// import { useDispatch, useSelector } from "react-redux"
// import { ArrowRight, ClipboardList, CreditCard, ReceiptText, ShoppingBag, TriangleAlert, TrendingDown, TrendingUp } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import MetricPanel from "./MetricPanel"
// import { CategoryPie, HorizontalBars, OrderBars, PaymentDonut, StatusChart, TrendChart } from "./MetricCharts"
// import { InvoiceTable, ProductTable } from "./MetricTables"
// import { 
//   // categories, 
//   money, 
//   orderStatuses, 
//   periods
//  } from "./metrics-data"
// // Adjust this path to wherever your getSlice lives
// import { GetProductslist, GetPaymentslist, GetSummarylist } from "../../redux/slices/getSlice"

// // Dropdown key -> value the API expects in ?period=
// const periodApiMap = {
//   week: "7d",        // Last 7 days
//   month: "30d",      // Last 30 days
//   quarter: "3m",     // Last 3 months
//   sixMonths: "6m",   // Last 6 months (assumed from the 3m / 1y pattern, please verify)
//   year: "1y",        // Last year
// }

// // Bar colors for each aging bucket, keyed by the API's `key`
// const agingColors = {
//   notDue: "var(--primary)",
//   "1-30": "#f59e0b",
//   "31-60": "#f97316",
//   "61-90": "#ef4444",
//   "90plus": "#e11d48",
// }

// // Slice colors, assigned in order (the API doesn't send colors)
// const categoryColors = ["var(--primary)", "#10b981", "#8b5cf6", "#f59e0b", "#38bdf8", "#ec4899", "#14b8a6", "#f97316"]

// // Same order as `orderStatuses` in metrics-data.js (Delivered, Processing, Pending, Cancelled)
// const orderStatusKeys = ["delivered", "processing", "pending", "cancelled"]


// // "2026-11-04" -> "Nov 4, 2026" (or "November 4, 2026" with style "long").
// // Built from the date parts so the timezone can't shift the day.
// function formatDate(value, style = "short") {
//   if (!value) return "—"
//   const [year, month, day] = String(value).slice(0, 10).split("-").map(Number)
//   return new Intl.DateTimeFormat("en-US", { month: style, day: "numeric", year: "numeric" })
//     .format(new Date(year, month - 1, day))
// }

// // API product item -> the shape the charts and table already use
// function mapProduct(item) {
//   return {
//     sku: item.itemNumber,
//     name: item.name,
//     category: item.category,
//     orders: Number(item.orders) || 0,
//     quantity: Number(item.quantity) || 0,
//     unit: item.unit,
//     spend: Number(item.spend) || 0,
//     lastOrdered: formatDate(item.lastOrdered),
//   }
// }

// // API attention item -> the shape InvoiceTable uses
// function mapInvoice(item) {
//   return {
//     number: item.invoiceNumber,
//     due: formatDate(item.dueDate),
//     balance: Number(item.balance) || 0,
//     overdueDays: item.isOverdue ? Number(item.daysOverdue) || 0 : 0,
//   }
// }

// // Redux errors can be a string or an object; always return a string
// function errorText(error) {
//   if (!error) return ""
//   if (typeof error === "string") return error
//   return error.message || error.error || error.Msg || "Something went wrong."
// }

// export default function Metrics() {
//   const dispatch = useDispatch()
//   const [period, setPeriod] = useState("month")
//   const [productMetric, setProductMetric] = useState("spend")

//     // Summary (top products + order status)
//   const summaryData = useSelector((state) => state.getSlice.summaryData)
//   const summaryLoading = useSelector((state) => state.getSlice.summaryLoading)
//   const summaryError = useSelector((state) => state.getSlice.summaryError)

//   const kpis = summaryData?.kpis ?? {};

//   // Products (store key: state.getSlice)
//   const productsData = useSelector((state) => state.getSlice.productsData)
//   const productsLoading = useSelector((state) => state.getSlice.productsLoading)
//   const productsError = useSelector((state) => state.getSlice.productsError)

//   // Payments
//   const paymentsData = useSelector((state) => state.getSlice.paymentsData)
//   const paymentsLoading = useSelector((state) => state.getSlice.paymentsLoading)
//   const paymentsError = useSelector((state) => state.getSlice.paymentsError)

//   // Products depend on the selected period, so refetch when it changes
//   useEffect(() => {
//     const apiPeriod = periodApiMap[period]
//     dispatch(GetSummarylist({ period: apiPeriod }))
//     dispatch(GetProductslist({ period: apiPeriod }))
//   }, [dispatch, period])

//   // Payments cover all invoice dates, so fetch once
//   useEffect(() => {
//     dispatch(GetPaymentslist({ attentionTake: 5 }))
//   }, [dispatch])


// // ───────────── Summary: Top purchased products ─────────────
//   // The API returns two ready-made lists: bySpend and byFrequency
//   const topProducts = useMemo(() => {
//     const list =
//       summaryData?.topProducts?.[productMetric === "spend" ? "bySpend" : "byFrequency"] ?? []

//     return list.slice(0, 5).map((product) => ({
//       name: product.name,
//       value: Number(productMetric === "spend" ? product.spend : product.orders) || 0,
//     }))
//   }, [summaryData, productMetric])

//   // ───────────── Summary: Order status ─────────────
//   const orderStatusTotal = summaryData?.orderStatus?.total ?? 0
//   const statusItems = orderStatuses.map((status, index) => ({
//     ...status,
//     value: Number(summaryData?.orderStatus?.[orderStatusKeys[index]]?.count) || 0,
//   }))
//   const summaryError_ = errorText(summaryError)


//   // ───────────── Summary: Spend by category ─────────────
// const categoryItems = useMemo(
//   () =>
//     (summaryData?.spendByCategory ?? []).map((item, index) => ({
//       name: item.category,
//       share: Number(item.percent) || 0,
//       spend: Number(item.spend) || 0,
//       color: categoryColors[index % categoryColors.length],
//     })),
//   [summaryData]
// )
// const categoryTotal = summaryData?.purchases?.total ?? categoryItems.reduce((sum, item) => sum + item.spend, 0)
//   // ───────────── Products ─────────────
//   const periodProducts = useMemo(
//     () => (productsData?.items ?? []).map(mapProduct),
//     [productsData]
//   )
//   const productsTotal = productsData?.total ?? periodProducts.length
//   // const topProducts = useMemo(
//   //   () => periodProducts.toSorted((a, b) => b[productMetric] - a[productMetric]).slice(0, 5),
//   //   [periodProducts, productMetric]
//   // )
//   const productsError_ = errorText(productsError)

//   // ───────────── Payments ─────────────
//   const paymentStatus = paymentsData?.paymentStatus
//   const nextPayment = paymentStatus?.nextPayment

//   // HorizontalBars reads `name`, `value` and `color`, so map the API's
//   // `label` and `amount` onto those (this is what fixes the missing labels)
//   const agingItems = useMemo(
//     () =>
//       (paymentsData?.aging ?? []).map((item) => ({
//         name: item.label,
//         value: Number(item.amount) || 0,
//         color: agingColors[item.key],
//       })),
//     [paymentsData]
//   )
//   const attentionInvoices = useMemo(
//     () => (paymentsData?.attention?.items ?? []).map(mapInvoice),
//     [paymentsData]
//   )
//   const attentionTotal = paymentsData?.attention?.total ?? attentionInvoices.length
//   const paymentsError_ = errorText(paymentsError)

//   // ───────────── Summary: Purchases / Orders / AOV (all from `intervals`) ─────────────
//   const intervals = summaryData?.intervals ?? []

//   const chart = useMemo(() => {
//     const list = summaryData?.intervals ?? []
//     return {
//       labels: list.map((item) => item.label),
//       // Hover text: the full from–to dates of each interval
//       ranges: list.map((item) => `${formatDate(item.from)} – ${formatDate(item.to)}`),
//       purchases: list.map((item) => Number(item.purchases) || 0),
//       previousPurchases: list.map((item) => Number(item.previousPurchases) || 0),
//       orders: list.map((item) => Number(item.orders) || 0),
//       // averageOrderValue is null when an interval has no orders -> plot as 0
//       averageOrderValue: list.map((item) => Number(item.averageOrderValue) || 0),
//       noOrders: list.map((item) => item.averageOrderValue == null),
//     }
//   }, [summaryData])

//   const purchasesTotal = Number(summaryData?.purchases?.total) || 0
//   const changePercent = summaryData?.purchases?.changePercent // null when the previous period had no purchases
//   const hasChange = changePercent !== null && changePercent !== undefined
//   const changeUp = !hasChange || Number(changePercent) >= 0
//   const ChangeIcon = changeUp ? TrendingUp : TrendingDown

//   // Outstanding / overdue now come from the payments API
//   const outstanding = paymentStatus?.outstanding ?? 0
//   const overdue = paymentStatus?.overdue ?? 0

//  const stats = [
//   {
//     label: "Invoiced purchases",
//     value: money.format(kpis.invoicedPurchases ?? 0),
//     icon: CreditCard,
//     color: "text-primary bg-primary/10",
//   },
//   {
//     label: "Orders placed",
//     value: kpis.ordersPlaced ?? 0,
//     icon: ClipboardList,
//     color: "text-violet-600 bg-violet-500/10 dark:text-violet-400",
//   },
//   {
//     label: "Average order value",
//     value: money.format(kpis.averageOrderValue ?? 0),
//     icon: ShoppingBag,
//     color: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
//   },
//   {
//     label: "Outstanding balance",
//     value: money.format(kpis.outstandingBalance ?? 0),
//     icon: ReceiptText,
//     color: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
//   },
//   {
//     label: "Overdue balance",
//     value: money.format(kpis.overdueBalance ?? 0),
//     icon: TriangleAlert,
//     color: "text-orange-600 bg-orange-500/10 dark:text-orange-400",
//   },
// ];

//   return (
//     <main className="mx-auto grid w-full min-w-0 max-w-[1600px] gap-4 p-2 sm:gap-5 sm:p-4">
//       <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
//         <div className="min-w-0">
//           <h1 className="text-base font-semibold">Purchasing summary</h1>
//           <p className="mt-1 text-xs text-muted-foreground">Your purchasing activity and account balances at a glance.</p>
//         </div>
//         <select id="metrics-period" aria-label="Date range" value={period} onChange={(event) => setPeriod(event.target.value)} className="block h-9 w-36 rounded-lg border border-primary/30 bg-card pl-3 text-xs font-medium text-foreground focus-visible:outline-2 focus-visible:outline-ring sm:w-40">
//           {Object.entries(periods).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
//         </select>
//       </div>
// <section aria-label="Purchasing summary" className="flex flex-wrap gap-3">
//   {summaryLoading ? (
//     <p className="text-sm text-muted-foreground">Loading summary...</p>
//   ) : summaryError ? (
//     <p className="text-sm text-destructive">
//       Failed to load summary data.
//     </p>
//   ) : (
//     stats.map(({ label, value, icon: Icon, color }) => (
//       <Card
//         key={label}
//         className="min-w-0 flex-1 basis-[calc(50%-0.75rem)] gap-0 py-0 md:basis-[calc(33.333%-0.75rem)] xl:basis-0"
//       >
//         <CardContent className="p-3 sm:p-4">
//           <div className="flex items-start justify-between gap-2">
//             <p className="text-xs leading-5 text-muted-foreground">
//               {label}
//             </p>
//             <span className={`rounded-lg p-2 ${color}`}>
//               <Icon aria-hidden="true" className="size-4" />
//             </span>
//           </div>

//           <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
//             {value}
//           </p>
//         </CardContent>
//       </Card>
//     ))
//   )}
// </section>

//       <div className="grid gap-4 lg:grid-cols-2">
//         <MetricPanel title="Purchases over time" description="Invoiced purchases compared with the preceding period.">
//           {summaryLoading && !intervals.length ? (
//             <p className="py-8 text-center text-xs text-muted-foreground">Loading purchases...</p>
//           ) : summaryError_ && !intervals.length ? (
//             <p className="py-8 text-center text-xs font-medium text-destructive">{summaryError_}</p>
//           ) : (
//             <>
//               <div className="mb-1 flex flex-wrap items-center gap-3">
//                 <p className="text-2xl font-semibold tabular-nums">{money.format(purchasesTotal)}</p>
//                 {hasChange ? (
//                   <span className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${changeUp ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
//                     <ChangeIcon aria-hidden="true" className="size-3.5" />{Math.abs(Number(changePercent)).toFixed(1)}%
//                   </span>
//                 ) : (
//                   <span title="No purchases in the previous period to compare with" className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">—</span>
//                 )}
//               </div>
//               <TrendChart labels={chart.labels} ranges={chart.ranges} values={chart.purchases} previous={chart.previousPurchases} label="Invoiced purchases and previous period comparison" />
//             </>
//           )}
//         </MetricPanel>
//        <MetricPanel title="Spend by category" description="Your share of invoiced purchases by product category.">
//   {summaryLoading && !categoryItems.length ? (
//     <p className="py-8 text-center text-xs text-muted-foreground">Loading categories...</p>
//   ) : summaryError_ && !categoryItems.length ? (
//     <p className="py-8 text-center text-xs font-medium text-destructive">{summaryError_}</p>
//   ) : !categoryItems.length ? (
//     <p className="py-8 text-center text-xs text-muted-foreground">No purchases in this period.</p>
//   ) : (
//     <CategoryPie categories={categoryItems} total={categoryTotal} />
//   )}
// </MetricPanel>
//       </div>

//       <div className="grid gap-4 lg:grid-cols-2">
//         <MetricPanel title="Order activity" description="Orders placed in each interval, including cancelled orders.">
//           {summaryLoading && !intervals.length ? (
//             <p className="py-8 text-center text-xs text-muted-foreground">Loading orders...</p>
//           ) : summaryError_ && !intervals.length ? (
//             <p className="py-8 text-center text-xs font-medium text-destructive">{summaryError_}</p>
//           ) : (
//             <OrderBars labels={chart.labels} ranges={chart.ranges} orders={chart.orders} />
//           )}
//         </MetricPanel>
//         <MetricPanel title="Average order value" description="Average value of non-cancelled orders in each interval.">
//           {summaryLoading && !intervals.length ? (
//             <p className="py-8 text-center text-xs text-muted-foreground">Loading average order value...</p>
//           ) : summaryError_ && !intervals.length ? (
//             <p className="py-8 text-center text-xs font-medium text-destructive">{summaryError_}</p>
//           ) : (
//             <TrendChart labels={chart.labels} ranges={chart.ranges} values={chart.averageOrderValue} empty={chart.noOrders} label="Average order value over time" />
//           )}
//         </MetricPanel>
//       </div>

//       <div className="grid gap-4 lg:grid-cols-2">
//         <MetricPanel title="Top purchased products" description="Your five leading products in the selected period."
//           action={<select aria-label="Rank top products by" value={productMetric} onChange={(event) => setProductMetric(event.target.value)} className="h-8 rounded-md border bg-background pl-2 text-xs focus-visible:outline-2 focus-visible:outline-ring"><option value="spend">By spend</option><option value="orders">By order frequency</option></select>}>
//           {summaryLoading && !topProducts.length ? (
//             <p className="py-8 text-center text-xs text-muted-foreground">Loading products...</p>
//           ) : summaryError_ && !topProducts.length ? (
//             <p className="py-8 text-center text-xs font-medium text-destructive">{summaryError_}</p>
//           ) : !topProducts.length ? (
//             <p className="py-8 text-center text-xs text-muted-foreground">No products purchased in this period.</p>
//           ) : (
//             <HorizontalBars currency={productMetric === "spend"} items={topProducts} />
//           )}
//         </MetricPanel>
//         <MetricPanel title="Order status" description="Current status of orders placed in the selected period."
//           action={<Button asChild size="sm"><Link href="/my-orders">My Orders<ArrowRight aria-hidden="true" className="size-3.5" /></Link></Button>}>
//           {summaryLoading && !summaryData ? (
//             <p className="py-8 text-center text-xs text-muted-foreground">Loading order status...</p>
//           ) : summaryError_ && !summaryData ? (
//             <p className="py-8 text-center text-xs font-medium text-destructive">{summaryError_}</p>
//           ) : (
//             <>
//               <p className="mb-4 text-2xl font-semibold">{orderStatusTotal}<span className="ml-2 text-xs font-normal text-muted-foreground">total orders</span></p>
//               <StatusChart statuses={statusItems} />
//             </>
//           )}
//         </MetricPanel>
//       </div>

//       <ProductTable products={periodProducts} total={productsTotal} loading={productsLoading} error={productsError_} />

//       <div className="flex flex-wrap items-end justify-between gap-2 pt-2">
//         <div><h2 className="text-base font-semibold">Payments & balances</h2><p className="mt-1 text-xs text-muted-foreground">Current account position across all invoice dates.</p></div>
//         {paymentsData?.asOf && <p className="text-xs text-muted-foreground">As of {formatDate(paymentsData.asOf, "long")}</p>}
//       </div>
//       <div className="grid gap-4 lg:grid-cols-2">
//         <MetricPanel title="Invoice payment status" description={`${money.format(paymentStatus?.totalInvoiced ?? 0)} invoiced across your account.`}>
//           {paymentsLoading && !paymentStatus ? (
//             <p className="py-8 text-center text-xs text-muted-foreground">Loading payments...</p>
//           ) : paymentsError_ && !paymentStatus ? (
//             <p className="py-8 text-center text-xs font-medium text-destructive">{paymentsError_}</p>
//           ) : (
//             <>
//               <PaymentDonut total={paymentStatus?.totalInvoiced ?? 0} paid={paymentStatus?.paid ?? 0} />
//               <p className="mt-4 border-t pt-4 text-xs text-muted-foreground">
//                 {nextPayment ? (
//                   <>
//                     Next payment due: {formatDate(nextPayment.dueDate, "long")}{" "}
//                     <span className="font-semibold text-foreground">· {money.format(nextPayment.amount ?? 0)}</span>
//                   </>
//                 ) : (
//                   "No upcoming payment due."
//                 )}
//               </p>
//             </>
//           )}
//         </MetricPanel>
//         <MetricPanel title="Outstanding invoice aging" description="Unpaid balances grouped by days past the due date.">
//           {paymentsLoading && !agingItems.length ? (
//             <p className="py-8 text-center text-xs text-muted-foreground">Loading aging...</p>
//           ) : paymentsError_ && !agingItems.length ? (
//             <p className="py-8 text-center text-xs font-medium text-destructive">{paymentsError_}</p>
//           ) : (
//             <HorizontalBars currency items={agingItems} />
//           )}
//         </MetricPanel>
//       </div>
//       <MetricPanel title="Invoices requiring attention" description="Overdue invoices first, followed by upcoming payments." table
//         action={<Button asChild size="sm"><Link href="/invoices">View invoices<ArrowRight aria-hidden="true" className="size-3.5" /></Link></Button>}>
//         <InvoiceTable invoices={attentionInvoices} total={attentionTotal} loading={paymentsLoading} error={paymentsError_} />
//       </MetricPanel>
//     </main>
//   )
// }

//SKELETON_LOADER USING THIS FILE
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { ArrowRight, ClipboardList, CreditCard, ReceiptText, ShoppingBag, TriangleAlert, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MetricPanel from "./MetricPanel"
import MetricsSkeleton from "./MetricsSkeleton"
import { CategoryPie, HorizontalBars, OrderBars, PaymentDonut, StatusChart, TrendChart } from "./MetricCharts"
import { InvoiceTable, ProductTable } from "./MetricTables"
import { money, orderStatuses, periods } from "./metrics-data"
// Adjust this path to wherever your getSlice lives
import { GetProductslist, GetPaymentslist, GetSummarylist } from "../../redux/slices/getSlice"

// Dropdown key -> value the API expects in ?period=
const periodApiMap = {
  week: "7d",        // Last 7 days
  month: "30d",      // Last 30 days
  quarter: "3m",     // Last 3 months
  sixMonths: "6m",   // Last 6 months (assumed from the 3m / 1y pattern, please verify)
  year: "1y",        // Last year
}

// Bar colors for each aging bucket, keyed by the API's `key`
const agingColors = {
  notDue: "var(--primary)",
  "1-30": "#f59e0b",
  "31-60": "#f97316",
  "61-90": "#ef4444",
  "90plus": "#e11d48",
}

// Slice colors, assigned in order (the API doesn't send colors)
const categoryColors = ["var(--primary)", "#10b981", "#8b5cf6", "#f59e0b", "#38bdf8", "#ec4899", "#14b8a6", "#f97316"]

// Same order as `orderStatuses` in metrics-data.js (Delivered, Processing, Pending, Cancelled)
const orderStatusKeys = ["delivered", "processing", "pending", "cancelled"]

// "2026-11-04" -> "Nov 4, 2026" (or "November 4, 2026" with style "long").
// Built from the date parts so the timezone can't shift the day.
function formatDate(value, style = "short") {
  if (!value) return "—"
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number)
  return new Intl.DateTimeFormat("en-US", { month: style, day: "numeric", year: "numeric" })
    .format(new Date(year, month - 1, day))
}

// API product item -> the shape the charts and table already use
function mapProduct(item) {
  return {
    sku: item.itemNumber,
    name: item.name,
    category: item.category,
    orders: Number(item.orders) || 0,
    quantity: Number(item.quantity) || 0,
    unit: item.unit,
    spend: Number(item.spend) || 0,
    lastOrdered: formatDate(item.lastOrdered),
  }
}

// API attention item -> the shape InvoiceTable uses
function mapInvoice(item) {
  return {
    number: item.invoiceNumber,
    due: formatDate(item.dueDate),
    balance: Number(item.balance) || 0,
    overdueDays: item.isOverdue ? Number(item.daysOverdue) || 0 : 0,
  }
}

// Redux errors can be a string or an object; always return a string
function errorText(error) {
  if (!error) return ""
  if (typeof error === "string") return error
  return error.message || error.error || error.Msg || "Something went wrong."
}

// Small helpers so every panel shows empty / error states the same way
function PanelError({ message }) {
  return <p className="py-8 text-center text-xs font-medium text-destructive">{message}</p>
}

function PanelEmpty({ message }) {
  return <p className="py-8 text-center text-xs text-muted-foreground">{message}</p>
}

export default function Metrics() {
  const dispatch = useDispatch()
  const [period, setPeriod] = useState("month")
  const [productMetric, setProductMetric] = useState("spend")

  // Summary (KPIs, charts, top products, order status)
  const summaryData = useSelector((state) => state.getSlice.summaryData)
  // const summaryLoading = useSelector((state) => state.getSlice.summaryLoading)
  const summaryError = useSelector((state) => state.getSlice.summaryError)

  // Products
  const productsData = useSelector((state) => state.getSlice.productsData)
  // const productsLoading = useSelector((state) => state.getSlice.productsLoading)
  const productsError = useSelector((state) => state.getSlice.productsError)

  // Payments
  const paymentsData = useSelector((state) => state.getSlice.paymentsData)
  const paymentsError = useSelector((state) => state.getSlice.paymentsError)

  // false on every mount / period change -> skeleton shows until fresh data arrives
const [summaryReady, setSummaryReady] = useState(false)
const [paymentsReady, setPaymentsReady] = useState(false)

  // Summary and products depend on the selected period, so refetch when it changes
  // useEffect(() => {
    
  //   const apiPeriod = periodApiMap[period]
  //   dispatch(GetSummarylist({ period: apiPeriod }))
  //   dispatch(GetProductslist({ period: apiPeriod }))
  // }, [dispatch, period])
  // Summary + products depend on the selected period
useEffect(() => {
  let cancelled = false
  setSummaryReady(false)

  const apiPeriod = periodApiMap[period]
  // a dispatched thunk resolves for success AND failure, so .finally always runs
  Promise.all([
    dispatch(GetSummarylist({ period: apiPeriod })),
    dispatch(GetProductslist({ period: apiPeriod })),
  ]).finally(() => {
    if (!cancelled) setSummaryReady(true)
  })

  return () => {
    cancelled = true // ignore results of an older period / unmounted screen
  }
}, [dispatch, period])

  // Payments cover all invoice dates, so fetch once
  // useEffect(() => {
  //   dispatch(GetPaymentslist({ attentionTake: 5 }))
  // }, [dispatch])
  // Payments cover all invoice dates, so fetch once per visit
useEffect(() => {
  let cancelled = false
  setPaymentsReady(false)

  dispatch(GetPaymentslist({ attentionTake: 5 })).finally(() => {
    if (!cancelled) setPaymentsReady(true)
  })

  return () => {
    cancelled = true
  }
}, [dispatch])

  const summaryError_ = errorText(summaryError)
  const productsError_ = errorText(productsError)
  const paymentsError_ = errorText(paymentsError)

  // ───────────── Summary: KPIs ─────────────
  const kpis = summaryData?.kpis ?? {}

  // ───────────── Summary: Top purchased products ─────────────
  // The API returns two ready-made lists: bySpend and byFrequency
  const topProducts = useMemo(() => {
    const list =
      summaryData?.topProducts?.[productMetric === "spend" ? "bySpend" : "byFrequency"] ?? []

    return list.slice(0, 5).map((product) => ({
      name: product.name,
      value: Number(productMetric === "spend" ? product.spend : product.orders) || 0,
    }))
  }, [summaryData, productMetric])

  // ───────────── Summary: Order status ─────────────
  const orderStatusTotal = summaryData?.orderStatus?.total ?? 0
  const statusItems = orderStatuses.map((status, index) => ({
    ...status,
    value: Number(summaryData?.orderStatus?.[orderStatusKeys[index]]?.count) || 0,
  }))

  // ───────────── Summary: Spend by category ─────────────
  const categoryItems = useMemo(
    () =>
      (summaryData?.spendByCategory ?? []).map((item, index) => ({
        name: item.category,
        share: Number(item.percent) || 0,
        spend: Number(item.spend) || 0,
        color: categoryColors[index % categoryColors.length],
      })),
    [summaryData]
  )
  const categoryTotal =
    summaryData?.purchases?.total ?? categoryItems.reduce((sum, item) => sum + item.spend, 0)

  // ───────────── Summary: Purchases / Orders / AOV (all from `intervals`) ─────────────
  const intervals = summaryData?.intervals ?? []

  const chart = useMemo(() => {
    const list = summaryData?.intervals ?? []
    return {
      labels: list.map((item) => item.label),
      // Hover text: the full from–to dates of each interval
      ranges: list.map((item) => `${formatDate(item.from)} – ${formatDate(item.to)}`),
      purchases: list.map((item) => Number(item.purchases) || 0),
      previousPurchases: list.map((item) => Number(item.previousPurchases) || 0),
      orders: list.map((item) => Number(item.orders) || 0),
      // averageOrderValue is null when an interval has no orders -> plot as 0
      averageOrderValue: list.map((item) => Number(item.averageOrderValue) || 0),
      noOrders: list.map((item) => item.averageOrderValue == null),
    }
  }, [summaryData])

  const purchasesTotal = Number(summaryData?.purchases?.total) || 0
  const changePercent = summaryData?.purchases?.changePercent // null when the previous period had no purchases
  const hasChange = changePercent !== null && changePercent !== undefined
  const changeUp = !hasChange || Number(changePercent) >= 0
  const ChangeIcon = changeUp ? TrendingUp : TrendingDown

  // ───────────── Products table ─────────────
  const periodProducts = useMemo(
    () => (productsData?.items ?? []).map(mapProduct),
    [productsData]
  )
  const productsTotal = productsData?.total ?? periodProducts.length

  // ───────────── Payments ─────────────
  const paymentStatus = paymentsData?.paymentStatus
  const nextPayment = paymentStatus?.nextPayment

  // HorizontalBars reads `name`, `value` and `color`, so map the API's
  // `label` and `amount` onto those
  const agingItems = useMemo(
    () =>
      (paymentsData?.aging ?? []).map((item) => ({
        name: item.label,
        value: Number(item.amount) || 0,
        color: agingColors[item.key],
      })),
    [paymentsData]
  )
  const attentionInvoices = useMemo(
    () => (paymentsData?.attention?.items ?? []).map(mapInvoice),
    [paymentsData]
  )
  const attentionTotal = paymentsData?.attention?.total ?? attentionInvoices.length

  const stats = [
    {
      label: "Invoiced purchases",
      value: money.format(kpis.invoicedPurchases ?? 0),
      icon: CreditCard,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Orders placed",
      value: kpis.ordersPlaced ?? 0,
      icon: ClipboardList,
      color: "text-violet-600 bg-violet-500/10 dark:text-violet-400",
    },
    {
      label: "Average order value",
      value: money.format(kpis.averageOrderValue ?? 0),
      icon: ShoppingBag,
      color: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      label: "Outstanding balance",
      value: money.format(kpis.outstandingBalance ?? 0),
      icon: ReceiptText,
      color: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
    },
    {
      label: "Overdue balance",
      value: money.format(kpis.overdueBalance ?? 0),
      icon: TriangleAlert,
      color: "text-orange-600 bg-orange-500/10 dark:text-orange-400",
    },
  ]

  // ───────────── Loading state ─────────────
  // First load: nothing has arrived yet (no data and no error), so show the skeleton.
  // This also covers the moment before the effects dispatch, so there is no empty flash.
  // IMPORTANT: this early return must stay below every hook above.
  // const initialLoading =
  //   (!summaryData && !summaryError_) || (!paymentsData && !paymentsError_)

  // if (initialLoading) return <MetricsSkeleton />

  // Skeleton whenever fresh data is still on the way: first visit, coming back
// to this screen, or changing the period. Keep this below every hook.
if (!summaryReady || !paymentsReady) return <MetricsSkeleton />
  // Period changed: old data is still on screen while the new data loads
  // const refreshing = summaryLoading && !!summaryData

  return (
    <main
      // aria-busy={refreshing}
      className={`mx-auto grid w-full min-w-0 max-w-[1600px] gap-4 p-2 transition-opacity sm:gap-5 sm:p-4`}
    >
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
        {summaryError_ && !summaryData ? (
          <p className="text-sm font-medium text-destructive">{summaryError_}</p>
        ) : (
          stats.map(({ label, value, icon: Icon, color }) => (
            <Card
              key={label}
              className="min-w-0 flex-1 basis-[calc(50%-0.75rem)] gap-0 py-0 md:basis-[calc(33.333%-0.75rem)] xl:basis-0"
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs leading-5 text-muted-foreground">{label}</p>
                  <span className={`rounded-lg p-2 ${color}`}>
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <MetricPanel title="Purchases over time" description="Invoiced purchases compared with the preceding period.">
          {summaryError_ && !intervals.length ? (
            <PanelError message={summaryError_} />
          ) : !intervals.length ? (
            <PanelEmpty message="No purchases in this period." />
          ) : (
            <>
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <p className="text-2xl font-semibold tabular-nums">{money.format(purchasesTotal)}</p>
                {hasChange ? (
                  <span className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${changeUp ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                    <ChangeIcon aria-hidden="true" className="size-3.5" />{Math.abs(Number(changePercent)).toFixed(1)}%
                  </span>
                ) : (
                  <span title="No purchases in the previous period to compare with" className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">—</span>
                )}
              </div>
              <TrendChart labels={chart.labels} ranges={chart.ranges} values={chart.purchases} previous={chart.previousPurchases} label="Invoiced purchases and previous period comparison" />
            </>
          )}
        </MetricPanel>

        <MetricPanel title="Spend by category" description="Your share of invoiced purchases by product category.">
          {summaryError_ && !categoryItems.length ? (
            <PanelError message={summaryError_} />
          ) : !categoryItems.length ? (
            <PanelEmpty message="No purchases in this period." />
          ) : (
            <CategoryPie categories={categoryItems} total={categoryTotal} />
          )}
        </MetricPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MetricPanel title="Order activity" description="Orders placed in each interval, including cancelled orders.">
          {summaryError_ && !intervals.length ? (
            <PanelError message={summaryError_} />
          ) : !intervals.length ? (
            <PanelEmpty message="No orders in this period." />
          ) : (
            <OrderBars labels={chart.labels} ranges={chart.ranges} orders={chart.orders} />
          )}
        </MetricPanel>

        <MetricPanel title="Average order value" description="Average value of non-cancelled orders in each interval.">
          {summaryError_ && !intervals.length ? (
            <PanelError message={summaryError_} />
          ) : !intervals.length ? (
            <PanelEmpty message="No orders in this period." />
          ) : (
            <TrendChart labels={chart.labels} ranges={chart.ranges} values={chart.averageOrderValue} empty={chart.noOrders} label="Average order value over time" />
          )}
        </MetricPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MetricPanel title="Top purchased products" description="Your five leading products in the selected period."
          action={<select aria-label="Rank top products by" value={productMetric} onChange={(event) => setProductMetric(event.target.value)} className="h-8 rounded-md border bg-background pl-2 text-xs focus-visible:outline-2 focus-visible:outline-ring"><option value="spend">By spend</option><option value="orders">By order frequency</option></select>}>
          {summaryError_ && !topProducts.length ? (
            <PanelError message={summaryError_} />
          ) : !topProducts.length ? (
            <PanelEmpty message="No products purchased in this period." />
          ) : (
            <HorizontalBars currency={productMetric === "spend"} items={topProducts} />
          )}
        </MetricPanel>

        <MetricPanel title="Order status" description="Current status of orders placed in the selected period."
          action={<Button asChild size="sm"><Link href="/my-orders">My Orders<ArrowRight aria-hidden="true" className="size-3.5" /></Link></Button>}>
          {summaryError_ && !summaryData ? (
            <PanelError message={summaryError_} />
          ) : (
            <>
              <p className="mb-4 text-2xl font-semibold">{orderStatusTotal}<span className="ml-2 text-xs font-normal text-muted-foreground">total orders</span></p>
              <StatusChart statuses={statusItems} />
            </>
          )}
        </MetricPanel>
      </div>

      <ProductTable products={periodProducts} total={productsTotal} 
      // loading={productsLoading} 
      error={productsError_} />

      <div className="flex flex-wrap items-end justify-between gap-2 pt-2">
        <div><h2 className="text-base font-semibold">Payments & balances</h2><p className="mt-1 text-xs text-muted-foreground">Current account position across all invoice dates.</p></div>
        {paymentsData?.asOf && <p className="text-xs text-muted-foreground">As of {formatDate(paymentsData.asOf, "long")}</p>}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MetricPanel title="Invoice payment status" description={`${money.format(paymentStatus?.totalInvoiced ?? 0)} invoiced across your account.`}>
          {paymentsError_ && !paymentStatus ? (
            <PanelError message={paymentsError_} />
          ) : (
            <>
              <PaymentDonut total={paymentStatus?.totalInvoiced ?? 0} paid={paymentStatus?.paid ?? 0} />
              <p className="mt-4 border-t pt-4 text-xs text-muted-foreground">
                {nextPayment ? (
                  <>
                    Next payment due: {formatDate(nextPayment.dueDate, "long")}{" "}
                    <span className="font-semibold text-foreground">· {money.format(nextPayment.amount ?? 0)}</span>
                  </>
                ) : (
                  "No upcoming payment due."
                )}
              </p>
            </>
          )}
        </MetricPanel>

        <MetricPanel title="Outstanding invoice aging" description="Unpaid balances grouped by days past the due date.">
          {paymentsError_ && !agingItems.length ? (
            <PanelError message={paymentsError_} />
          ) : !agingItems.length ? (
            <PanelEmpty message="No outstanding invoices." />
          ) : (
            <HorizontalBars currency items={agingItems} />
          )}
        </MetricPanel>
      </div>

      <MetricPanel title="Invoices requiring attention" description="Overdue invoices first, followed by upcoming payments." table
        action={<Button asChild size="sm"><Link href="/invoices">View invoices<ArrowRight aria-hidden="true" className="size-3.5" /></Link></Button>}>
        <InvoiceTable invoices={attentionInvoices} total={attentionTotal} error={paymentsError_} />
      </MetricPanel>
    </main>
  )
}