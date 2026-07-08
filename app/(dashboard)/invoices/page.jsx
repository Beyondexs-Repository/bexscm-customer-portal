import { Search, X } from "lucide-react"
import Link from "next/link"

import InvoicePagination from "@/components/invoices/InvoicePagination"
import { getInvoices } from "@/components/overview/recent-invoices"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default async function InvoicesPage({ searchParams }) {
  const params = await searchParams
  const query = typeof params.query === "string" ? params.query.trim() : ""
  const requestedPage = Number.parseInt(params.page, 10) || 1
  const requestedPageSize = Number.parseInt(params.rows, 10)
  const pageSize = [10, 20, 50, 100].includes(requestedPageSize)
    ? requestedPageSize
    : 10
  const allInvoices = await getInvoices()
  const normalizedQuery = query.toLowerCase()
  const filteredInvoices = normalizedQuery
    ? allInvoices.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(normalizedQuery) ||
          invoice.customerId.toLowerCase().includes(normalizedQuery) ||
          invoice.status.toLowerCase().includes(normalizedQuery),
      )
    : allInvoices
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize))
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages)
  const start = (currentPage - 1) * pageSize
  const invoices = filteredInvoices.slice(start, start + pageSize)

  return (
    <main className="space-y-5 p-4">
      <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="query"
            defaultValue={query}
            className="pl-9 pr-9"
            placeholder="Search invoices..."
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
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <Link
                          href={`/invoices/${invoice.invoiceNumber}`}
                          className="font-semibold hover:text-primary"
                        >
                          #{invoice.invoiceNumber}
                        </Link>
                        {/* <p className="text-xs text-muted-foreground">
                          Customer {invoice.customerId}
                        </p> */}
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>
              Showing {filteredInvoices.length === 0 ? 0 : start + 1}–
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
