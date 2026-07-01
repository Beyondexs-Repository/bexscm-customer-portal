import ItemMixCard from "./ItemMixCard";
import RecentInvoicesCard from "./RecentInvoicesCard";
import SalesGraphCard from "./SalesGraphCard";
import StatsCards from "./StatsCards";

export default function BackofficeOverview() {
  return (
    <section className="grid gap-4">
      <StatsCards />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <SalesGraphCard />
        <ItemMixCard />
      </div>
      <RecentInvoicesCard />
    </section>
  );
}
