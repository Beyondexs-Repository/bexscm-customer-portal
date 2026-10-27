import { useId } from "react"
import { money } from "./metrics-data"

export function TrendChart({ labels, values, previous, label }) {
  const gradient = useId()
  const ceiling = Math.ceil(Math.max(...values, ...(previous || []), 1) / 4) * 4
  const line = values.map((value, index) => `${index ? "L" : "M"} ${64 + index * 500 / Math.max(values.length - 1, 1)} ${200 - value / ceiling * 160}`).join(" ")
  const comparison = previous?.map((value, index) => `${index ? "L" : "M"} ${64 + index * 500 / Math.max(previous.length - 1, 1)} ${200 - value / ceiling * 160}`).join(" ")

  return (
    <div>
      <svg viewBox="0 0 600 245" role="img" aria-label={label} className="h-48 w-full sm:h-52">
        <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--primary)" stopOpacity="0.2" /><stop offset="100%" stopColor="var(--primary)" stopOpacity="0" /></linearGradient></defs>
        {[0, 1, 2, 3, 4].map((step) => (
          <g key={step}>
            <line x1="64" x2="564" y1={200 - step * 40} y2={200 - step * 40} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
            <text x="54" y={204 - step * 40} textAnchor="end" className="fill-muted-foreground text-[11px]">{money.format(ceiling * step / 4)}</text>
          </g>
        ))}
        <path d={`${line} L 564 200 L 64 200 Z`} fill={`url(#${gradient})`} />
        {comparison && <path d={comparison} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="5 5" strokeWidth="2" />}
        <path d={line} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinejoin="round" />
        {values.map((value, index) => (
          <g key={labels[index]}>
            <circle cx={64 + index * 500 / Math.max(values.length - 1, 1)} cy={200 - value / ceiling * 160} r="4" fill="var(--card)" stroke="var(--primary)" strokeWidth="2"><title>{labels[index]}: {money.format(value)}</title></circle>
            <text x={64 + index * 500 / Math.max(values.length - 1, 1)} y="230" textAnchor="middle" className="fill-muted-foreground text-[11px]">{labels[index]}</text>
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2"><span className="h-0.5 w-5 bg-primary" />Selected period</span>
        {previous && <span className="flex items-center gap-2"><span className="w-5 border-t-2 border-dashed border-muted-foreground/50" />Previous period, aligned by interval</span>}
      </div>
      <ul className="sr-only">{labels.map((name, index) => <li key={name}>{name}: {money.format(values[index])}{previous && ` · Previous: ${money.format(previous[index])}`}</li>)}</ul>
    </div>
  )
}

export function OrderBars({ labels, orders }) {
  const max = Math.max(...orders, 1)
  return (
    <ul aria-label="Orders placed by interval" className="flex gap-3 pt-8 sm:gap-6">
      {labels.map((label, index) => (
        <li key={label} className="min-w-0 flex-1 text-center">
          <div className="flex h-44 items-end justify-center border-b">
            <div className="relative w-full max-w-12 rounded-t-md bg-primary/85" style={{ height: `${orders[index] / max * 100}%` }}>
              <span className="absolute inset-x-0 -top-6 text-xs font-semibold">{orders[index]}</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">{label}</p>
        </li>
      ))}
    </ul>
  )
}

export function CategoryPie({ categories, total }) {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <svg viewBox="0 0 200 200" role="img" aria-label="Share of invoiced purchases by category" className="size-40 shrink-0">
        {categories.map((category, index) => {
          const start = categories.slice(0, index).reduce((sum, item) => sum + item.share, 0) / 100 * Math.PI * 2 - Math.PI / 2
          const end = start + category.share / 100 * Math.PI * 2
          const path = `M 100 100 L ${100 + 88 * Math.cos(start)} ${100 + 88 * Math.sin(start)} A 88 88 0 ${category.share > 50 ? 1 : 0} 1 ${100 + 88 * Math.cos(end)} ${100 + 88 * Math.sin(end)} Z`
          return <path key={category.name} d={path} fill={category.color} stroke="var(--card)" strokeWidth="3"><title>{category.name}: {category.share}%</title></path>
        })}
      </svg>
      <ul className="w-full space-y-4 text-xs">
        {categories.map((category) => <li key={category.name} className="flex items-center gap-2"><span className="size-2.5 shrink-0 rounded-full" style={{ background: category.color }} /><span className="flex-1">{category.name}</span><span className="font-medium tabular-nums">{money.format(total * category.share / 100)}</span><span className="w-8 text-right text-muted-foreground">{category.share}%</span></li>)}
      </ul>
    </div>
  )
}

export function HorizontalBars({ items, currency = false }) {
  const max = Math.max(...items.map((item) => item.value), 1)
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.name}>
          <div className="mb-2 flex justify-between gap-3 text-xs"><span>{item.name}</span><span className="shrink-0 font-semibold tabular-nums">{currency ? money.format(item.value) : `${item.value} orders`}</span></div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${item.value / max * 100}%`, background: item.color || "var(--primary)" }} /></div>
        </li>
      ))}
    </ul>
  )
}

export function PaymentDonut({ total, paid }) {
  const percent = total ? paid / total * 100 : 0
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-2">
      <div className="relative size-40 shrink-0">
        <svg viewBox="0 0 120 120" role="img" aria-label={`${percent.toFixed(1)}% of invoiced amount paid`} className="size-full -rotate-90">
          <circle cx="60" cy="60" r="48" fill="none" stroke="#f59e0b" strokeWidth="12" />
          <circle cx="60" cy="60" r="48" fill="none" stroke="#10b981" strokeWidth="12" pathLength="100" strokeDasharray={`${percent} 100`} />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center text-3xl font-semibold">{Math.round(percent)}%<span className="mt-1 text-xs font-normal text-muted-foreground">Paid</span></span>
      </div>
      <dl className="space-y-4 text-xs">
        <div><dt className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full bg-emerald-500" />Paid</dt><dd className="mt-1 text-lg font-semibold">{money.format(paid)}</dd></div>
        <div><dt className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full bg-amber-500" />Outstanding</dt><dd className="mt-1 text-lg font-semibold">{money.format(total - paid)}</dd></div>
      </dl>
    </div>
  )
}

export function StatusChart({ statuses }) {
  const total = statuses.reduce((sum, item) => sum + item.value, 0)
  return (
    <div>
      <div aria-hidden="true" className="mb-6 flex h-9 overflow-hidden rounded-lg">
        {statuses.map((item) => <div key={item.name} style={{ width: `${total ? item.value / total * 100 : 0}%`, background: item.color }} />)}
      </div>
      <ul className="grid grid-cols-2 gap-5 text-xs">
        {statuses.map((item) => <li key={item.name}><p className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full" style={{ background: item.color }} />{item.name}</p><p className="mt-2 text-xl font-semibold">{item.value}<span className="ml-2 text-xs font-normal text-muted-foreground">{total ? Math.round(item.value / total * 100) : 0}%</span></p></li>)}
      </ul>
    </div>
  )
}
