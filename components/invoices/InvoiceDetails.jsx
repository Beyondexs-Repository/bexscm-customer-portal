"use client"

import Link from "next/link"
import { useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { ArrowLeft, FileDown, Share2, Loader2 } from "lucide-react"

import { GetInvoicedetails,  GetinvoicePDF} from "../../redux/slices/getSlice"
import InvoicePagination from "@/components/invoices/InvoicePagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images"
import { resolveItemImageUrl } from "@/lib/api/itemsApi"


const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const clean = (value) => String(value ?? "").trim()

const date = (value) => {
  const d = new Date(value)
  return Number.isNaN(d.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(d)
}

// API returns image as "" or just a filename like "500002.png".

const placeholderImage = getCategoryPlaceholderImage("Product")

// "" / null  -> default placeholder
// "500002.png" -> resolved image URL (same logic as cart-sidebar)
const resolveImage = (image) => {
  const file = clean(image)
  if (!file) return placeholderImage
  return resolveItemImageUrl(file) || file
}
const rowOptions = [5, 10, 20, 50, 100]

export default function InvoiceDetails({ invoiceId }) {
  const searchParams = useSearchParams()
  const dispatch = useDispatch()

  const invoiceData = useSelector((state) => state.getSlice.GetInvoicedetailsdata)
  const loading = useSelector((state) => state.getSlice.GetInvoicedetailsloading)
  const error = useSelector((state) => state.getSlice.GetInvoicedetailserror)


  const pdfLoading = useSelector((state) => state.getSlice.GetinvoicePDFloading)

  const requestedPage = Number.parseInt(searchParams.get("page") ?? "", 10) || 1
  const requestedPageSize = Number.parseInt(searchParams.get("rows") ?? "", 10) || 5
  const pageSize = rowOptions.includes(requestedPageSize) ? requestedPageSize : 5

  useEffect(() => {
    if (invoiceId) dispatch(GetInvoicedetails(invoiceId))
  }, [invoiceId, dispatch])

  // Ignore stale data from a previously opened invoice
  const invoice = useMemo(() => {
    if (!invoiceData || clean(invoiceData.invoiceNumber) !== clean(invoiceId)) return null
    return invoiceData
  }, [invoiceData, invoiceId])

  const lines = invoice?.items ?? []

  const backButton = (
    <Button asChild variant="ghost" size="sm" className="px-0">
      <Link href="/invoices">
        <ArrowLeft className="size-4" />
        Back to Invoices
      </Link>
    </Button>
  )

 if (!invoice) {
  const message = loading
    ? "Loading invoice..."
    : typeof error === "string"
      ? error
      : error?.message || "Invoice not found."

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground"
    >
      {loading ? (
        <>
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-xs font-medium">{message}</p>
        </>
      ) : (
        <p className="text-xs font-medium">{message}</p>
      )}
    </div>
  )
}

  const total = Number(invoice.total) || 0
  const balance = Number(invoice.balance) || 0
  const paidAmount = Number(invoice.paidAmount) || 0
  const statusLabel = clean(invoice.status) || "Open"

  const totalPages = Math.max(1, Math.ceil(lines.length / pageSize))
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages)
  const start = (currentPage - 1) * pageSize
  const products = lines.slice(start, start + pageSize)

  const handleDownloadPdf = () => {
  dispatch(GetinvoicePDF(invoiceId))
    .unwrap()
    .catch((err) => console.error("PDF download failed:", err))
}


  return (
    <main className="space-y-5 p-4">
      {backButton}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">Invoice #{invoiceId}</h1>
            <Badge className="bg-sky-500/10 text-sky-600" variant="secondary">
              {statusLabel}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {date(invoice.invoiceDate)} - Due {date(invoice.dueDate)}
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-80">
          <Button variant="outline" size="sm" className="w-full"
          onClick={handleDownloadPdf}
          disabled={pdfLoading}>
            {pdfLoading ? (
    <Loader2 className="size-4 animate-spin" />
  ) : (
    <FileDown className="size-4" />
  )}
  {pdfLoading ? "Preparing..." : "Download"}
</Button>
          <Button size="sm" className="w-full">
            <Share2 className="size-4" />
            Share
          </Button>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total", money.format(total)],
          ["Paid Amount", money.format(paidAmount)],
          ["Balance", money.format(balance)],
          ["Status", statusLabel],
        ].map(([label, value]) => (
          <Card key={label} className="py-0">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-muted-foreground">{label}</p>
              <p className="mt-2 text-lg font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold">Products Ordered ({lines.length})</h2>

        <Card className="overflow-hidden py-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Unit Price</th>
                    <th className="px-4 py-3 font-medium">Quantity</th>
                    <th className="px-4 py-3 font-medium">Unit</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.length > 0 ? (
                    products.map((product, index) => (
                      <tr key={`${product.itemNumber}-${start + index}`}>
                        <td className="px-4 py-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              role="img"
                              aria-label={clean(product.itemDescription)}
                              className="size-11 shrink-0 rounded-md border bg-cover bg-center"
                              style={{ backgroundImage: `url("${resolveImage(product.image)}")` }}
                            />
                            <div className="min-w-0">
                              <p className="truncate font-semibold">
                                {clean(product.itemDescription)}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {clean(product.packSizeDescription)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {money.format(Number(product.unitPrice) || 0)}
                        </td>
                        <td className="px-4 py-3">{Number(product.quantity) || 0}</td>
                        <td className="px-4 py-3">{clean(product.unit)}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {money.format(Number(product.total) || 0)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-muted-foreground"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {lines.length === 0 ? 0 : start + 1} to{" "}
                {Math.min(start + pageSize, lines.length)} of {lines.length} products
              </span>
              <InvoicePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                basePath={`/invoices/details/?id=${encodeURIComponent(invoiceId)}`}
                rowOptions={rowOptions}
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}