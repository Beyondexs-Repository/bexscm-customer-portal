import { Boxes, CircleDollarSign, ReceiptText, Users } from "lucide-react";

import { stats } from "./dashboard-data";

const icons = {
  balance: CircleDollarSign,
  invoices: ReceiptText,
  customers: Users,
  items: Boxes,
};

export default function StatsCards({ stats: statsData = stats }) {
  const currentStats = statsData || stats;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {currentStats.map((stat) => {
        const Icon = icons[stat.type] || Boxes;

        return (
          <div key={stat.label} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.helper}</p>
          </div>
        );
      })}
    </div>
  );
}
