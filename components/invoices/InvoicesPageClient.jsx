"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { Search, X, ReceiptText, DollarSign, CircleCheck, Clock, Download, Loader2  } from "lucide-react"

import { GetCustomerInvoiceItems, GetinvoicePDF } from "../../redux/slices/getSlice"
import InvoicePagination from "@/components/invoices/InvoicePagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const rowOptions = [10, 20, 50, 100]

const formatDate = (value) => {
  const d = new Date(value)
  return Number.isNaN(d.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d)
}

export default function InvoicesPageClient() {
  const searchParams = useSearchParams()
  const query = (searchParams.get("query") ?? "").trim()
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "", 10) || 1
  const requestedPageSize = Number.parseInt(searchParams.get("rows") ?? "", 10) || 10
  const pageSize = rowOptions.includes(requestedPageSize) ? requestedPageSize : 10

  const dispatch = useDispatch()

  // CHANGE `s.get` to the key your reducer is registered under in the store
  // const {
  //   customerInvoicesdata,
  //   customerInvoicesloading: loading,
  //   customerInvoiceserror: error,
  // } = useSelector((s) => s.get)


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

  const allInvoices = useMemo(
    () =>
      (customerInvoicesdata ?? []).map((inv) => {
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


  const normalizedQuery = query.toLowerCase()
const filteredInvoices = allInvoices.filter(
  (invoice) =>
    !normalizedQuery ||
    invoice.invoiceNumber.toLowerCase().includes(normalizedQuery) ||
    invoice.status.toLowerCase().includes(normalizedQuery),
)
  const totals = filteredInvoices.reduce((sum, invoice) => ({
    amount: sum.amount + invoice.total,
    paid: sum.paid + invoice.paidAmount,
    due: sum.due + invoice.balance,
  }), { amount: 0, paid: 0, due: 0 })
  const stats = [
    { label: "Total Invoices", value: filteredInvoices.length.toLocaleString("en-US"), icon: ReceiptText, color: "bg-blue-500/10 text-blue-600" },
    { label: "Total Amount", value: money.format(totals.amount), icon: DollarSign, color: "bg-violet-500/10 text-violet-600" },
    { label: "Paid Amount", value: money.format(totals.paid), icon: CircleCheck, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Due Amount", value: money.format(totals.due), icon: Clock, color: "bg-amber-500/10 text-amber-600" },
  ]
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize))
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages)
  const start = (currentPage - 1) * pageSize
  const invoices = filteredInvoices.slice(start, start + pageSize)


const [downloadingId, setDownloadingId] = useState(null)

const handleDownloadPdf = (invoiceNumber) => {
  setDownloadingId(invoiceNumber)
  dispatch(GetinvoicePDF(invoiceNumber))
    .unwrap()
    .catch((err) => console.error("PDF download failed:", err))
    .finally(() => setDownloadingId(null))
}



  return (
    <main className="space-y-4 p-2 sm:space-y-5 sm:p-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="py-2.5 sm:py-4">
            <CardContent className="flex items-center gap-1.5 px-2.5 sm:gap-3 sm:px-4">
              <span className={`grid size-7 shrink-0 place-items-center rounded-lg sm:size-10 ${color}`}><Icon className="size-3.5 sm:size-5" /></span>
              <div className="min-w-0">
                <p className="text-[10px] leading-3 font-medium text-muted-foreground sm:text-xs sm:leading-normal">{label}</p>
                <p className="mt-0.5 whitespace-nowrap text-[11px] font-semibold tabular-nums sm:mt-1 sm:text-xl">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="query"
            defaultValue={query}
            className="pl-9 pr-9"
            placeholder="Search invoices..."
            aria-label="Search invoices"
          />
          {query ? (
            <Link
              href={`/invoices?rows=${pageSize}`}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </Link>
          ) : null}
          <input type="hidden" name="rows" value={pageSize} />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <Card className="overflow-hidden py-0">
        <CardHeader className="border-b px-4 py-4 sm:px-6">
          <CardTitle className="text-base">Invoices</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review invoice totals, payments, balances, and status.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Invoice</th>
                  <th className="px-4 py-3 font-medium">Invoice date</th>
                  <th className="px-4 py-3 font-medium">Due date</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Paid amount</th>
                  <th className="px-4 py-3 font-medium">Balance</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <Link
                          href={`/invoices/details/?id=${encodeURIComponent(invoice.invoiceNumber)}`}
                          className="font-semibold hover:text-primary"
                        >
                          #{invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {invoice.invoiceDateLabel}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {invoice.dueDateLabel}
                      </td>
                      <td className="px-4 py-4">
                        {invoice.itemCount} products
                        <p className="text-xs text-muted-foreground">
                          {invoice.units} units
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold">
                        {money.format(invoice.total)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {money.format(invoice.paidAmount)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold">
                        {money.format(invoice.balance)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant="secondary"
                          className={
                            invoice.statusTone === "orange"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-sky-500/10 text-sky-600"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
 <Button
  variant="outline"
  size="sm"
  disabled={downloadingId === invoice.invoiceNumber}
  onClick={() => handleDownloadPdf(invoice.invoiceNumber)}
>
  {downloadingId === invoice.invoiceNumber ? (
    <Loader2 className="size-4 animate-spin" />
  ) : (
    <Download className="size-4" />
  )}
  Download PDF
</Button>
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                     <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
    {loading ? "Loading invoices..." : error ? String(error) : "No invoices found."}
  </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>
              Showing {filteredInvoices.length === 0 ? 0 : start + 1}-
              {Math.min(start + pageSize, filteredInvoices.length)} of{" "}
              {filteredInvoices.length} invoices
            </span>
            <InvoicePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              query={query}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
