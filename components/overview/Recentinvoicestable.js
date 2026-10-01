"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ChevronRight, Download, Loader2, PackageCheck } from "lucide-react"
import { GetCustomerInvoiceItems, GetinvoicePDF } from "../../redux/slices/getSlice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const formatCurrency = (value) => currency.format(value)

const formatDate = (value) => {
  const d = new Date(value)
  return Number.isNaN(d.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(d)
}

export default function RecentInvoicesTable() {
  const dispatch = useDispatch()

  const customerInvoicesdata = useSelector((state) => state.getSlice.customerInvoicesdata)
  const loading = useSelector((state) => state.getSlice.customerInvoicesloading)
  const error = useSelector((state) => state.getSlice.customerInvoiceserror)

  // Read localStorage only on the client
  const [custnmbr, setCustnmbr] = useState(null)
  useEffect(() => {
    setCustnmbr(localStorage.getItem("custnmbr") ?? "")
  }, [])

  // Fetch once custnmbr is known
  useEffect(() => {
    if (custnmbr) dispatch(GetCustomerInvoiceItems(custnmbr))
  }, [custnmbr, dispatch])

  // Newest first, then keep only the first 5
  const recentOrders = useMemo(
    () =>
      [...(customerInvoicesdata ?? [])]
        .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
        .slice(0, RECENT_LIMIT)
        .map((inv) => {
          const invoiceNumber = String(inv.invoiceNumber ?? "").trim() // API has trailing spaces
          const status = String(inv.status ?? "Open")
          return {
            id: invoiceNumber,
            invoiceNumber,
            invoiceDateLabel: formatDate(inv.invoiceDate),
            dueDateLabel: formatDate(inv.dueDate),
            itemCount: inv.itemsCount ?? 0,
            units: inv.unitsCount ?? 0,
            total: Number(inv.total) || 0,
            paidAmount: Number(inv.paidAmount) || 0,
            balance: Number(inv.balance) || 0,
            status,
            statusTone: status.toLowerCase() === "open" ? "blue" : "orange",
          }
        }),
    [customerInvoicesdata],
  )

  const emptyMessage = loading
    ? "Loading invoices..."
    : error
      ? typeof error === "string"
        ? error
        : error?.message || "Something went wrong."
      : "No invoices found."

      
       const [downloadingId, setDownloadingId] = useState(null)
 
  const handleDownloadPdf = (invoiceNumber) => {
    setDownloadingId(invoiceNumber)
    dispatch(GetinvoicePDF(invoiceNumber))
      .unwrap()
      .catch((err) => console.error("PDF download failed:", err))
      .finally(() => setDownloadingId(null))
  }

  return (
    <section className="h-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PackageCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold sm:text-lg">Recent Invoices</h2>
            <p className="text-xs text-muted-foreground">
              View and manage your latest orders
            </p>
          </div>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/invoices">
            View all
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
              {/* <th className="px-4 py-3 font-semibold">Paid amount</th>
              <th className="px-4 py-3 font-semibold">Balance</th> */}
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
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
                  {/* <td className="whitespace-nowrap px-4 py-2 font-semibold">
                    {formatCurrency(order.paidAmount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-semibold">
                    {formatCurrency(order.balance)}
                  </td> */}
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
                   <td className="px-4 py-4">
 <Button
                      variant="outline"
                      size="sm"
                      className="relative z-20"
                      disabled={downloadingId === order.invoiceNumber}
                      onClick={() => handleDownloadPdf(order.invoiceNumber)}
                    >
                      {downloadingId === order.invoiceNumber ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Download className="size-4" />
                      )}
                      Invoice
                    </Button>
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}