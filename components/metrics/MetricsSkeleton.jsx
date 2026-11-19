import { Card, CardContent, CardHeader } from "@/components/ui/card"

// Base shimmer block. Everything below is built from this.
function Skeleton({ className = "", style }) {
  return <div aria-hidden="true" style={style} className={`animate-pulse rounded-md bg-muted ${className}`} />
}

// Same Card + header structure as MetricPanel, so borders and spacing line up
function PanelSkeleton({ children, table = false, hasAction = false, className = "" }) {
  return (
    <Card className={`min-w-0 gap-0 py-0 ${className}`}>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 rounded-none border-b px-4 py-3 [.border-b]:pb-3 sm:px-5">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-64 max-w-full" />
        </div>
        {hasAction && <Skeleton className="h-8 w-24" />}
      </CardHeader>
      <CardContent className={table ? "p-0" : "flex flex-1 flex-col p-4 sm:px-5"}>{children}</CardContent>
    </Card>
  )
}

// ───────────── KPI cards (also exported: use it when only the KPIs reload) ─────────────
export function StatCardsSkeleton({ count = 5 }) {
  return (
    <section aria-hidden="true" className="flex flex-wrap gap-3">
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} className="min-w-0 flex-1 basis-[calc(50%-0.75rem)] gap-0 py-0 md:basis-[calc(33.333%-0.75rem)] xl:basis-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="mt-1 h-3 w-24" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <Skeleton className="mt-3 h-7 w-28" />
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

// ───────────── Chart pieces ─────────────
function LineChartSkeleton({ withTotal = false }) {
  return (
    <>
      {withTotal && (
        <div className="mb-3 flex items-center gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-16" />
        </div>
      )}
      <Skeleton className="h-48 w-full rounded-lg sm:h-52" />
      <div className="mt-3 flex gap-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-40" />
      </div>
    </>
  )
}

function PieSkeleton() {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <Skeleton className="size-40 shrink-0 rounded-full" />
      <div className="w-full space-y-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Skeleton className="size-2.5 shrink-0 rounded-full" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderBarsSkeleton() {
  const heights = [35, 80, 55, 95]
  return (
    <div className="flex gap-3 pt-8 sm:gap-6">
      {heights.map((height, index) => (
        <div key={index} className="min-w-0 flex-1 text-center">
          <div className="flex h-44 items-end justify-center border-b">
            <Skeleton className="w-full max-w-12 rounded-b-none rounded-t-md" style={{ height: `${height}%` }} />
          </div>
          <Skeleton className="mx-auto mt-3 h-3 w-16" />
        </div>
      ))}
    </div>
  )
}

function BarListSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index}>
          <div className="mb-2 flex justify-between gap-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  )
}

function StatusSkeleton() {
  return (
    <>
      <Skeleton className="mb-4 h-8 w-28" />
      <Skeleton className="mb-6 h-9 w-full rounded-lg" />
      <div className="grid grid-cols-2 gap-5">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </>
  )
}

function DonutSkeleton() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-6 py-2">
        <Skeleton className="size-40 shrink-0 rounded-full" />
        <div className="space-y-4">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-64 max-w-full" />
    </>
  )
}

// ───────────── Table rows (also exported: use inside ProductTable / InvoiceTable) ─────────────
export function TableRowsSkeleton({ rows = 5, cols = 4 }) {
  return Array.from({ length: rows }, (_, row) => (
    <tr key={row} aria-hidden="true">
      {Array.from({ length: cols }, (_, col) => (
        <td key={col} className={`py-4 ${col === 0 ? "px-5" : "px-4"}`}>
          <Skeleton className={`h-3 ${col === 0 ? "w-32" : "w-16"} ${col === cols - 1 ? "ml-auto" : ""}`} />
        </td>
      ))}
    </tr>
  ))
}

function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <>
      <div className="flex gap-6 px-5 py-3">
        {Array.from({ length: cols }, (_, index) => <Skeleton key={index} className="h-3 w-16" />)}
      </div>
      <table className="w-full border-t text-left text-xs"><tbody className="divide-y"><TableRowsSkeleton rows={rows} cols={cols} /></tbody></table>
      <div className="border-t px-5 py-3"><Skeleton className="h-3 w-40" /></div>
    </>
  )
}

// ───────────── Full-page skeleton (same grid as <Metrics />) ─────────────
export default function MetricsSkeleton() {
  return (
    <main role="status" aria-busy="true" aria-label="Loading purchasing summary" className="mx-auto grid w-full min-w-0 max-w-[1600px] gap-4 p-2 sm:gap-5 sm:p-4">
      <span className="sr-only">Loading purchasing summary...</span>

      {/* Page header + period select */}
      <div aria-hidden="true" className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-72 max-w-full" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg sm:w-40" />
      </div>

      <StatCardsSkeleton />

      <div aria-hidden="true" className="grid gap-4 lg:grid-cols-2">
        <PanelSkeleton><LineChartSkeleton withTotal /></PanelSkeleton>
        <PanelSkeleton><PieSkeleton /></PanelSkeleton>
      </div>

      <div aria-hidden="true" className="grid gap-4 lg:grid-cols-2">
        <PanelSkeleton><OrderBarsSkeleton /></PanelSkeleton>
        <PanelSkeleton><LineChartSkeleton /></PanelSkeleton>
      </div>

      <div aria-hidden="true" className="grid gap-4 lg:grid-cols-2">
        <PanelSkeleton hasAction><BarListSkeleton /></PanelSkeleton>
        <PanelSkeleton hasAction><StatusSkeleton /></PanelSkeleton>
      </div>

      <PanelSkeleton table hasAction><TableSkeleton rows={5} cols={6} /></PanelSkeleton>

      {/* Payments & balances */}
      <div aria-hidden="true" className="flex flex-wrap items-end justify-between gap-2 pt-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-72 max-w-full" />
        </div>
        <Skeleton className="h-3 w-36" />
      </div>

      <div aria-hidden="true" className="grid gap-4 lg:grid-cols-2">
        <PanelSkeleton><DonutSkeleton /></PanelSkeleton>
        <PanelSkeleton><BarListSkeleton /></PanelSkeleton>
      </div>

      <PanelSkeleton table hasAction><TableSkeleton rows={4} cols={4} /></PanelSkeleton>
    </main>
  )
}