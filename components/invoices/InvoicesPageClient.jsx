"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { useLocale, useTranslations } from "next-intl"
import { Search, X, ReceiptText, DollarSign, CircleCheck, Clock, Download, Loader2 } from "lucide-react"

import { GetCustomerInvoiceItems, GetinvoicePDF } from "../../redux/slices/getSlice"
import InvoicePagination from "@/components/invoices/InvoicePagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { can } from "@/lib/permissions"


const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const rowOptions = [10, 20, 50, 100]

export default function InvoicesPageClient() {
  const t = useTranslations("invoicesPage")
  const locale = useLocale()

  const searchParams = useSearchParams()
  const query = (searchParams.get("query") ?? "").trim()
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "", 10) || 1
  const requestedPageSize = Number.parseInt(searchParams.get("rows") ?? "", 10) || 10
  const pageSize = rowOptions.includes(requestedPageSize) ? requestedPageSize : 10

  const dispatch = useDispatch()

  const customerInvoicesdata = useSelector((state) => state.getSlice.customerInvoicesdata)
  const error = useSelector((state) => state.getSlice.customerInvoiceserror)

  const [downloadingId, setDownloadingId] = useState(null)

  // Locale-aware date formatting
  const formatDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    return (value) => {
      const d = new Date(value)
      return Number.isNaN(d.getTime()) ? "-" : formatter.format(d)
    }
  }, [locale])

  // Translate API status if a key exists, otherwise show the raw value
  const translateStatus = (status) => {
    const key = `status.${status.toLowerCase()}`
    return t.has(key) ? t(key) : status
  }

  // Read localStorage only on the client
  const [custnmbr, setCustnmbr] = useState(null)
  useEffect(() => {
    setCustnmbr(localStorage.getItem("custnmbr") ?? "")
  }, [])

  // false on every mount -> loader shows until fresh data arrives
  const [invoicesReady, setInvoicesReady] = useState(false)

  // Fetch on every visit once custnmbr is known (cached Redux data is never shown first)
  useEffect(() => {
    if (custnmbr === null) return // still reading localStorage

    // No customer number -> nothing to fetch, show the empty state instead of an endless loader
    if (!custnmbr) {
      setInvoicesReady(true)
      return
    }

    let cancelled = false
    setInvoicesReady(false)

    // a dispatched thunk resolves for success AND failure, so .finally always runs
    dispatch(GetCustomerInvoiceItems(custnmbr)).finally(() => {
      if (!cancelled) setInvoicesReady(true)
    })

    return () => {
      cancelled = true // ignore the result if the screen was left
    }
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
    [customerInvoicesdata, formatDate],
  )

  // Search still matches the raw API status (e.g. "open"), not the translated label
  const normalizedQuery = query.toLowerCase()
  const filteredInvoices = allInvoices.filter(
    (invoice) =>
      !normalizedQuery ||
      invoice.invoiceNumber.toLowerCase().includes(normalizedQuery) ||
      invoice.status.toLowerCase().includes(normalizedQuery) ||
      translateStatus(invoice.status).toLowerCase().includes(normalizedQuery),
  )

  const totals = filteredInvoices.reduce(
    (sum, invoice) => ({
      amount: sum.amount + invoice.total,
      paid: sum.paid + invoice.paidAmount,
      due: sum.due + invoice.balance,
    }),
    { amount: 0, paid: 0, due: 0 },
  )

  const stats = [
    { label: t("stats.totalInvoices"), value: filteredInvoices.length.toLocaleString(locale), icon: ReceiptText, color: "bg-blue-500/10 text-blue-600" },
    { label: t("stats.totalAmount"), value: money.format(totals.amount), icon: DollarSign, color: "bg-violet-500/10 text-violet-600" },
    { label: t("stats.paidAmount"), value: money.format(totals.paid), icon: CircleCheck, color: "bg-emerald-500/10 text-emerald-600" },
    { label: t("stats.dueAmount"), value: money.format(totals.due), icon: Clock, color: "bg-amber-500/10 text-amber-600" },
  ]

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize))
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages)
  const start = (currentPage - 1) * pageSize
  const invoices = filteredInvoices.slice(start, start + pageSize)

  const [role, setRole] = useState(null)
  useEffect(() => {
    setRole(localStorage.getItem("roles"))
  }, [])
  // role is null until localStorage is read; treat the list as visible until then
  const showList = role === null || can(role, "invoice.list")

  const handleDownloadPdf = (invoiceNumber) => {
    setDownloadingId(invoiceNumber)
    dispatch(GetinvoicePDF(invoiceNumber))
      .unwrap()
      .catch((err) => console.error("PDF download failed:", err))
      .finally(() => setDownloadingId(null))
  }

  const emptyMessage = error
    ? typeof error === "string"
      ? error
      : error?.message || String(error)
    : t("empty")

  // Loader on first load AND every time you come back to this screen.
  // IMPORTANT: keep this below every hook above.
  if (!invoicesReady) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center text-muted-foreground"
      >
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-xs font-medium">{t("loading")}</p>
      </div>
    )
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
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAria")}
          />
          {query ? (
            <Link
              href={`/invoices?rows=${pageSize}`}
              aria-label={t("clearSearchAria")}
              className="absolute right-3 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </Link>
          ) : null}
          <input type="hidden" name="rows" value={pageSize} />
        </div>
        <Button type="submit">{t("searchButton")}</Button>
      </form>


      {showList && (
        <Card className="overflow-hidden py-0">
          <CardHeader className="border-b px-4 py-4 sm:px-6">
            <CardTitle className="text-base">{t("title")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">{t("columns.invoice")}</th>
                    <th className="px-4 py-3 font-medium">{t("columns.invoiceDate")}</th>
                    <th className="px-4 py-3 font-medium">{t("columns.dueDate")}</th>
                    <th className="px-4 py-3 font-medium">{t("columns.items")}</th>
                    <th className="px-4 py-3 font-medium">{t("columns.total")}</th>
                    <th className="px-4 py-3 font-medium">{t("columns.paidAmount")}</th>
                    <th className="px-4 py-3 font-medium">{t("columns.balance")}</th>
                    <th className="px-4 py-3 font-medium">{t("columns.status")}</th>
                    <th className="px-4 py-3 font-medium">{t("columns.action")}</th>
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
                            {invoice.invoiceNumber}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">{invoice.invoiceDateLabel}</td>
                        <td className="whitespace-nowrap px-4 py-4">{invoice.dueDateLabel}</td>
                        <td className="px-4 py-4">
                          {t("products", { count: invoice.itemCount })}
                          <p className="text-xs text-muted-foreground">
                            {t("units", { count: invoice.units })}
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
                            {translateStatus(invoice.status)}
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
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                Downloading
                              </>
                            ) : (
                              <>
                                <Download className="size-4" />
                                {t("invoiceButton")}
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className={`px-6 py-12 text-center ${error ? "font-medium text-destructive" : "text-muted-foreground"}`}>
                        {emptyMessage}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="@container flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-xs text-muted-foreground">
              <span>
                {t("showing", {
                  from: filteredInvoices.length === 0 ? 0 : start + 1,
                  to: Math.min(start + pageSize, filteredInvoices.length),
                  total: filteredInvoices.length,
                })}
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
      )}
    </main>
  )
}