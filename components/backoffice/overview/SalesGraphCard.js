import { ChevronDown } from "lucide-react";

import { money, monthlySales, salesYear, yearSales } from "./dashboard-data";

const maxSales = Math.max(...monthlySales.map((month) => month.amount), 1);
const chartWidth = 600;
const chartHeight = 220;
const chartPadding = 22;
const usableHeight = chartHeight - chartPadding * 2;
const points = monthlySales.map((month, index) => ({
  x: (index / (monthlySales.length - 1 || 1)) * chartWidth,
  y: chartPadding + usableHeight - (month.amount / maxSales) * usableHeight,
}));
const linePath = points
  .map((point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  })
  .join(" ");
const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
const gridLines = Array.from({ length: 5 }, (_, index) => chartPadding + index * (usableHeight / 4));

export default function SalesGraphCard() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b p-4">
        <div>
          <h2 className="text-lg font-semibold">Sales vs Month</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Last 6 months in {salesYear}. Year sales: {money.format(yearSales)}.
          </p>
        </div>
        <button
          className="flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium"
          type="button"
        >
          Last 6 months
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </div>

      <div className="px-5 pb-6 pt-8">
        <div className="relative h-72">
          <svg
            aria-label="Sales over the last six months"
            className="h-full w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            <defs>
              <linearGradient id="sales-area-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-3)" stopOpacity="0.52" />
                <stop offset="100%" stopColor="var(--chart-3)" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            {gridLines.map((y) => (
              <line
                key={y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeWidth="1"
                x1="0"
                x2={chartWidth}
                y1={y}
                y2={y}
              />
            ))}
            <path d={areaPath} fill="url(#sales-area-gradient)" />
            <path d={linePath} fill="none" stroke="var(--chart-3)" strokeWidth="2.5" />
          </svg>

          <div className="absolute inset-x-0 bottom-2 grid grid-cols-6 text-center text-xs text-muted-foreground">
            {monthlySales.map((month) => (
              <span key={`${month.label}-${month.year}`}>
                {month.label} {String(month.year).slice(2)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium">
          <span className="size-2 rounded-sm bg-[var(--chart-3)]" />
          Sales
        </div>
      </div>
    </div>
  );
}
