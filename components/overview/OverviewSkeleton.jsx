import { Skeleton } from "@/components/ui/skeleton"

// Shared shimmer (uses your existing ui/skeleton, same as RecommendedItems)
function Shimmer({ className = "" }) {
  return <Skeleton aria-hidden="true" className={`motion-reduce:animate-none ${className}`} />
}

// ───────────── Welcome banner ─────────────
function BannerSkeleton() {
  return (
    <section aria-hidden="true" className="relative min-h-[18rem] overflow-hidden rounded-xl border bg-card shadow-sm sm:min-h-[20rem]">
      <Shimmer className="absolute inset-0 rounded-none" />
      {/* faint text blocks where the promo title / description / button sit */}
      <div className="relative z-10 flex min-h-[18rem] w-[40%] flex-col justify-center gap-3 px-10 pb-12 pt-5 sm:min-h-[20rem] sm:p-8">
        <div className="h-8 w-4/5 rounded-md bg-background/60" />
        <div className="h-8 w-3/5 rounded-md bg-background/60" />
        <div className="mt-1 h-4 w-2/3 rounded-md bg-background/60" />
        <div className="mt-4 h-9 w-32 rounded-md bg-background/60" />
      </div>
    </section>
  )
}

// ───────────── Quick actions (4 cards) ─────────────
function QuickActionsSkeleton() {
  return (
    <section aria-hidden="true" className="@container min-w-0">
      <div className="grid grid-cols-1 gap-2 @min-[22rem]:grid-cols-2 @min-[64rem]:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex min-w-0 items-center gap-2 rounded-xl border bg-card p-2.5 shadow-sm sm:gap-3 sm:p-3">
            <Shimmer className="size-9 shrink-0 rounded-full sm:size-10" />
            <div className="min-w-0 flex-1 space-y-2">
              <Shimmer className="h-3.5 w-24" />
              <Shimmer className="h-3 w-32 max-w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ───────────── Recommended items ─────────────
function RecommendedSkeleton() {
  return (
    <section aria-hidden="true" className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Shimmer className="size-10 shrink-0 rounded-full" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-40" />
            <Shimmer className="h-3 w-32" />
          </div>
        </div>
        <Shimmer className="ml-auto h-8 w-32 shrink-0" />
      </div>

      {/* same grid classes as RecommendedItems so the cards line up */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 xl:grid-cols-5 xl:[&>:nth-child(n+6)]:hidden">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex w-[80%] max-w-64 min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-lg border bg-background md:w-auto md:max-w-none">
            <Shimmer className="h-32 w-full rounded-none" />
            <div className="flex flex-1 flex-col gap-1 p-3">
              <div className="flex h-5 items-center"><Shimmer className="h-4 w-3/4" /></div>
              <div className="flex h-4 items-center"><Shimmer className="h-3 w-1/2" /></div>
              <div className="mb-2 mt-auto pt-2"><Shimmer className="h-5 w-20" /></div>
              <div className="grid grid-cols-[3.8rem_minmax(0,1fr)] gap-1.5">
                <Shimmer className="h-8" />
                <Shimmer className="h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ───────────── Recent invoices ─────────────
function InvoicesSkeleton() {
  return (
    <section aria-hidden="true" className="h-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Shimmer className="size-10 shrink-0 rounded-full" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-36" />
            <Shimmer className="h-3 w-52 max-w-full" />
          </div>
        </div>
        <Shimmer className="h-8 w-20 shrink-0" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-muted/50">
            <tr>
              {Array.from({ length: 7 }, (_, index) => (
                <th key={index} className="px-4 py-3"><Shimmer className="h-3 w-16" /></th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.from({ length: 5 }, (_, row) => (
              <tr key={row}>
                <td className="px-4 py-4"><Shimmer className="h-3 w-20" /></td>
                <td className="px-4 py-4"><Shimmer className="h-3 w-20" /></td>
                <td className="px-4 py-4"><Shimmer className="h-3 w-20" /></td>
                <td className="px-4 py-3"><Shimmer className="h-3 w-16" /><Shimmer className="mt-1.5 h-2.5 w-12" /></td>
                <td className="px-4 py-4"><Shimmer className="h-3 w-14" /></td>
                <td className="px-4 py-4"><Shimmer className="h-5 w-12 rounded-full" /></td>
                <td className="px-4 py-3"><Shimmer className="h-8 w-24" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ───────────── Quick order guide ─────────────
function OrderGuideSkeleton() {
  return (
    <section aria-hidden="true" className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Shimmer className="size-10 shrink-0 rounded-full" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-36" />
            <Shimmer className="h-3 w-44 max-w-full" />
          </div>
        </div>
        <Shimmer className="size-8 shrink-0" />
      </div>

      <div className="flex-1 space-y-2 p-4">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
            <Shimmer className="size-4 shrink-0" />
            <Shimmer className="size-8 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Shimmer className="h-3.5 w-24" />
              <Shimmer className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t p-4">
        <Shimmer className="h-9" />
        <Shimmer className="h-9" />
      </div>
    </section>
  )
}

// ───────────── Full page ─────────────
// showInvoices: pass false for roles that can't see the invoices table, so the
// skeleton doesn't show a panel that will disappear.
export default function OverviewSkeleton({ showInvoices = true }) {
  return (
    <div role="status" aria-busy="true" aria-label="Loading overview" className="grid gap-3 sm:gap-4">
      <span className="sr-only">Loading overview...</span>

      <BannerSkeleton />
      <QuickActionsSkeleton />
      <RecommendedSkeleton />

      <div aria-hidden="true" className="grid items-stretch gap-3 sm:gap-4 lg:grid-cols-3">
        <div className="order-1 h-full min-h-0 min-w-0 lg:order-2 lg:col-span-1">
          <OrderGuideSkeleton />
        </div>
        {showInvoices && (
          <div className="order-2 h-full min-h-0 min-w-0 lg:order-1 lg:col-span-2">
            <InvoicesSkeleton />
          </div>
        )}
      </div>
    </div>
  )
}