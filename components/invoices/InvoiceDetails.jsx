import { readFile } from "node:fs/promises"
import path from "node:path"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  FileDown,
  Share2,
} from "lucide-react"

import InvoicePagination from "@/components/invoices/InvoicePagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images"

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const clean = (value) => String(value ?? "").trim()

const date = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))

export default async function InvoiceDetails({ invoiceId, page = 1, pageSize = 5 }) {
  const [invoiceText, statusText, itemsText, proprietaryText] = await Promise.all([
    readFile(path.join(process.cwd(), "data", "livedata", "Invoices.json"), "utf8"),
    readFile(
      path.join(process.cwd(), "data", "livedata", "InvoicesStatus.json"),
      "utf8",
    ),
    readFile(path.join(process.cwd(), "data", "livedata", "Items.json"), "utf8"),
    readFile(
      path.join(process.cwd(), "data", "livedata", "ProprietaryItems.json"),
      "utf8",
    ),
  ])
  const allLines = JSON.parse(invoiceText.replace(/^\uFEFF/, ""))
  const statuses = JSON.parse(statusText.replace(/^\uFEFF/, ""))
  const items = JSON.parse(itemsText.replace(/^\uFEFF/, ""))
  const proprietaryItems = JSON.parse(proprietaryText.replace(/^\uFEFF/, ""))
  const lines = allLines.filter(
    (line) => clean(line.InvoiceNumber) === invoiceId,
  )

  if (lines.length === 0) notFound()

  const firstLine = lines[0]
  const status =
    statuses.find((item) => clean(item.InvoiceNumber) === invoiceId) ?? {}
  const total = Number(firstLine.OrderAmount) || 0
  const balance = Number(status.Balance) || 0
  const paidAmount = Number.isFinite(Number(status.PaidAmount))
    ? Number(status.PaidAmount)
    : Math.max(total - balance, 0)
  const statusLabel = clean(status.Status) || "Open"
  const totalPages = Math.max(1, Math.ceil(lines.length / pageSize))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const start = (currentPage - 1) * pageSize
  const products = lines.slice(start, start + pageSize)
  const itemsByNumber = new Map(items.map((item) => [clean(item.ITEMNMBR), item]))
  const proprietaryByNumber = new Map(
    proprietaryItems.map((item) => [clean(item.ItemNmbr), item]),
  )

  return (
    <main className="space-y-5 p-4">
      <Button asChild variant="ghost" size="sm" className="px-0">
        <Link href="/invoices">
          <ArrowLeft className="size-4" />
          Back to Invoices
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">Invoice #{invoiceId}</h1>
            <Badge className="bg-sky-500/10 text-sky-600" variant="secondary">
              {statusLabel}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {date(firstLine.InvoiceDate)} - Due {date(firstLine.DueDate)}
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-80">
          <Button variant="outline" size="sm" className="w-full">
            <FileDown className="size-4" />
            Download PDF
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
              <p className="text-xs font-semibold text-muted-foreground">
                {label}
              </p>
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
                  {products.map((product) => {
                    const item =
                      itemsByNumber.get(clean(product.ItemNumber)) ??
                      proprietaryByNumber.get(clean(product.ItemNumber))
                    const image = getCategoryPlaceholderImage(
                      item?.MainGroup || "Product",
                    )

                    return (
                      <tr key={`${product.ItemNumber}-${product.LineItemAmount}`}>
                        <td className="px-4 py-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              role="img"
                              aria-label={clean(product.ItemDescription)}
                              className="size-11 shrink-0 rounded-md border bg-cover bg-center"
                              style={{ backgroundImage: `url(${image})` }}
                            />
                            <div className="min-w-0">
                              <p className="truncate font-semibold">
                                {clean(product.ItemDescription)}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {clean(product.PackSizeDescription)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {money.format(Number(product.UnitPrice) || 0)}
                        </td>
                        <td className="px-4 py-3">
                          {Number(product.ShippedQuantity) || 0}
                        </td>
                        <td className="px-4 py-3">
                          {clean(product.SellByUnitofMeasure)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {money.format(Number(product.LineItemAmount) || 0)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {start + 1} to {Math.min(start + pageSize, lines.length)}{" "}
                of {lines.length} products
              </span>
              <InvoicePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                basePath={`/invoices/${invoiceId}`}
                rowOptions={[5, 10, 20, 50, 100]}
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
