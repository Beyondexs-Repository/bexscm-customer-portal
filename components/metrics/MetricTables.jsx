import { useState } from "react"
import { ArrowDownWideNarrow, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import MetricPanel from "./MetricPanel"
import { money } from "./metrics-data"

export function ProductTable({ products }) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("spend")
  const visibleProducts = products
    .filter((product) => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(search.toLowerCase()))
    .toSorted((a, b) => b[sort] - a[sort])

  return (
    <MetricPanel title="Product purchasing summary" description="Review purchasing frequency, quantities, and invoiced spend." table
      action={<div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        <div className="relative min-w-0 flex-1 sm:w-48">
          <Search aria-hidden="true" className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input aria-label="Search purchased products" placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 pl-8 text-xs" />
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <ArrowDownWideNarrow aria-hidden="true" className="size-4" /><span className="sr-only">Sort products by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-9 rounded-md border bg-background pl-2 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-ring">
            <option value="spend">Highest spend</option><option value="orders">Most orders</option><option value="quantity">Most cases</option>
          </select>
        </label>
      </div>}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="text-[11px] uppercase text-muted-foreground"><tr>
            <th scope="col" className="px-5 py-3 font-medium">Product</th><th scope="col" className="px-4 py-3 font-medium">Category</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Orders</th><th scope="col" className="px-4 py-3 text-right font-medium">Quantity</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Spend</th><th scope="col" className="px-5 py-3 text-right font-medium">Last ordered</th>
          </tr></thead>
          <tbody className="divide-y">
            {visibleProducts.map((product) => <tr key={product.sku} className="hover:bg-muted/30">
              <td className="px-5 py-3"><p className="font-medium">{product.name}</p><p className="mt-1 text-[11px] text-muted-foreground">{product.sku}</p></td>
              <td className="px-4 py-3 text-muted-foreground">{product.category}</td><td className="px-4 py-3 text-right tabular-nums">{product.orders}</td>
              <td className="px-4 py-3 text-right tabular-nums">{product.quantity} {product.unit}</td><td className="px-4 py-3 text-right font-semibold tabular-nums">{money.format(product.spend)}</td>
              <td className="whitespace-nowrap px-5 py-3 text-right text-muted-foreground">{product.lastOrdered}</td>
            </tr>)}
            {!visibleProducts.length && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No products match your search.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="border-t px-5 py-3 text-xs text-muted-foreground">Showing {visibleProducts.length} of {products.length} products</div>
    </MetricPanel>
  )
}

export function InvoiceTable({ invoices }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[580px] text-left text-xs">
        <thead className="text-[11px] uppercase text-muted-foreground"><tr>
          <th scope="col" className="px-5 py-3 font-medium">Invoice</th><th scope="col" className="px-4 py-3 font-medium">Due date</th>
          <th scope="col" className="px-4 py-3 font-medium">Status</th><th scope="col" className="px-5 py-3 text-right font-medium">Balance</th>
        </tr></thead>
        <tbody className="divide-y">
          {invoices.map((invoice) => <tr key={invoice.number} className="hover:bg-muted/30">
            <td className="px-5 py-4 font-medium">{invoice.number}</td><td className="whitespace-nowrap px-4 py-4 text-muted-foreground">{invoice.due}</td>
            <td className="px-4 py-4"><Badge variant="secondary" className={invoice.overdueDays ? "bg-orange-500/10 text-orange-700 dark:text-orange-300" : "bg-primary/10 text-primary"}>{invoice.overdueDays ? `${invoice.overdueDays} days overdue` : "Not due"}</Badge></td>
            <td className="px-5 py-4 text-right font-semibold tabular-nums">{money.format(invoice.balance)}</td>
          </tr>)}
        </tbody>
      </table>
      <div className="border-t px-5 py-3 text-xs text-muted-foreground">{invoices.length} outstanding invoices</div>
    </div>
  )
}
