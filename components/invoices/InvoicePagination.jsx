"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function InvoicePagination({
  currentPage,
  totalPages,
  pageSize,
  query,
  basePath = "/invoices",
  rowOptions = [10, 20, 50, 100],
}) {
  const router = useRouter()

  const changePage = (page, rows = pageSize) => {
    const [path, search = ""] = basePath.split("?")
    const params = new URLSearchParams(search)

    params.set("rows", String(rows))
    if (query) params.set("query", query)
    if (page > 1) params.set("page", String(page))
    if (page <= 1) params.delete("page")

    router.push(`${path}?${params}`, { scroll: false })
    document
      .querySelector("[data-dashboard-scroll]")
      ?.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2">
        Rows per page
        <select
          value={pageSize}
          onChange={(event) => changePage(1, Number(event.target.value))}
          className="h-8 rounded-lg border border-border bg-background px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:border-input dark:bg-input/30 dark:[color-scheme:dark] [&_option]:bg-popover [&_option]:text-popover-foreground"
        >
          {rowOptions.map((rows) => (
            <option key={rows} value={rows}>
              {rows}
            </option>
          ))}
        </select>
      </label>
      <span className="px-2">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        aria-label="Previous page"
        title="Previous page"
      >
        <ChevronLeft />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
        aria-label="Next page"
        title="Next page"
      >
        <ChevronRight />
      </Button>
    </div>
  )
}
