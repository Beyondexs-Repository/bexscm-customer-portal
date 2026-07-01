import { PackageCheck } from "lucide-react";

import { number, topCategories } from "./dashboard-data";

const topCategoryCount = topCategories[0]?.count || 1;

export default function ItemMixCard() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-lg font-semibold">Item Mix</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Top live item groups by available master data.
          </p>
        </div>
        <PackageCheck className="size-5 text-primary" />
      </div>
      <div className="mt-4 grid gap-4">
        {topCategories.map((category, index) => (
          <div key={category.name} className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium">{category.name}</span>
              <span className="text-muted-foreground">{number.format(category.count)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-[var(--chart-1)]"
                style={{
                  width: `${Math.max((category.count / topCategoryCount) * 100, 8)}%`,
                  backgroundColor: `var(--chart-${(index % 5) + 1})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
