import { useId } from "react"

const currency = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)

export function SpendingGraph({ labels, amounts }) {
  const gradientId = useId()
  const ceiling = Math.ceil(Math.max(...amounts, 1) / 4) * 4
  const points = amounts.map((amount, index) => ({ x: 65 + index * 510 / (amounts.length - 1), y: 205 - amount / ceiling * 170 }))
  const line = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ")
  return (
    <div className="mt-4">
      <svg viewBox="0 0 610 250" role="img" aria-label={`Spending graph. ${labels.map((label, index) => `${label}: ${currency(amounts[index])}`).join("; ")}`} className="w-full">
        <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" /><stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" /></linearGradient></defs>
        {[0, 1, 2, 3, 4].map((step) => {
          const y = 205 - step * 42.5
          return <g key={step}><line x1="65" x2="575" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" /><text x="55" y={y + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">{currency(ceiling * step / 4)}</text></g>
        })}
        <path d={`${line} L 575 205 L 65 205 Z`} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinejoin="round" />
        {points.map((point, index) => <g key={labels[index]}><circle cx={point.x} cy={point.y} r="4" fill="var(--card)" stroke="var(--primary)" strokeWidth="2"><title>{labels[index]}: {currency(amounts[index])}</title></circle><text x={point.x} y="235" textAnchor="middle" className="fill-muted-foreground text-[10px]">{labels[index]}</text></g>)}
      </svg>
      <details className="text-xs text-muted-foreground"><summary className="w-fit cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary">View chart values</summary><ul className="mt-2 grid grid-cols-2 gap-2">{labels.map((label, index) => <li key={label}>{label}: {currency(amounts[index])}</li>)}</ul></details>
    </div>
  )
}

export function CategoryPie({ categories }) {
  const slices = categories.map((category, index) => {
    const start = categories.slice(0, index).reduce((sum, item) => sum + item.share, 0) / 100 * Math.PI * 2 - Math.PI / 2
    const end = start + category.share / 100 * Math.PI * 2
    const point = (angle) => `${100 + 87 * Math.cos(angle)} ${100 + 87 * Math.sin(angle)}`
    return { ...category, path: `M 100 100 L ${point(start)} A 87 87 0 ${category.share > 50 ? 1 : 0} 1 ${point(end)} Z` }
  })
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`Category spending. ${categories.map((item) => `${item.name}: ${item.share}%`).join("; ")}`} className="mx-auto mb-4 size-44">
      {slices.map((slice) => <path key={slice.name} d={slice.path} fill={slice.color} stroke="var(--card)" strokeWidth="2"><title>{slice.name}: {currency(slice.amount)} ({slice.share}%)</title></path>)}
    </svg>
  )
}

export function OrderBars({ labels, orders }) {
  const max = Math.max(...orders, 1)
  return <ul aria-label="Order counts over time" className="flex gap-2 pt-7 sm:gap-5">{labels.map((label, index) => <li key={label} className="min-w-0 flex-1 text-center"><div className="flex h-28 items-end justify-center border-b"><div className="relative w-full max-w-12 rounded-t-md bg-violet-500/80" style={{ height: `${orders[index] / max * 100}%` }}><span className="absolute inset-x-0 -top-6 text-xs font-semibold">{orders[index]}</span></div></div><p className="mt-3 text-[10px] text-muted-foreground">{label}</p></li>)}</ul>
}

export function ProductBars({ products }) {
  const max = Math.max(...products.map((product) => product.orders), 1)
  const colors = ["bg-primary", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-sky-400"]

  return (
    <ul aria-label="Most frequently ordered products" className="space-y-6">
      {products.map((product, index) => (
        <li key={product.name}>
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-medium">{product.name}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">{product.orders} {product.orders === 1 ? "order" : "orders"}</span>
          </div>
          <div aria-hidden="true" className="h-4 overflow-hidden rounded-full bg-muted/60">
            <div className={`h-full rounded-full ${colors[index % colors.length]}`} style={{ width: `${product.orders / max * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function PaymentDonut({ spend, balance }) {
  const paidPercent = (spend - balance) / spend * 100
  return <div className="flex items-center gap-5"><div className="relative size-28 shrink-0"><svg viewBox="0 0 120 120" role="img" aria-label={`${paidPercent.toFixed(1)}% paid; ${currency(balance)} outstanding`} className="size-full -rotate-90"><circle cx="60" cy="60" r="48" fill="none" stroke="#f59e0b" strokeWidth="12" /><circle cx="60" cy="60" r="48" fill="none" stroke="#10b981" strokeWidth="12" pathLength="100" strokeDasharray={`${paidPercent} 100`} /></svg><span className="absolute inset-0 flex flex-col items-center justify-center text-xl font-semibold">{Math.round(paidPercent)}%<span className="text-[10px] font-normal text-muted-foreground">Paid</span></span></div><div className="space-y-3 text-xs"><p><span aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-emerald-500" />Paid <strong>{currency(spend - balance)}</strong></p><p><span aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-amber-500" />Unpaid <strong>{currency(balance)}</strong></p></div></div>
}
