"use client"

import ItemMixCard from "./ItemMixCard";
import RecentInvoicesCard from "./RecentInvoicesCard";
import SalesGraphCard from "./SalesGraphCard";
import StatsCards from "./StatsCards";
import { useLiveItems } from "./useLiveItems";

export default function BackofficeOverview() {
  const { stats, topCategories, loading } = useLiveItems();

  return (
    <section className="grid gap-4">
      <StatsCards stats={stats} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <SalesGraphCard />
        <ItemMixCard categories={topCategories} />
      </div>
      <RecentInvoicesCard />
    </section>
  );
}
