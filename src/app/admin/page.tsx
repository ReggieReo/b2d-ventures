import { Sidebar } from "~/components/sidebar";
import { InvestmentBarChart } from "~/components/bar_chart";
import { RecentInvestments } from "~/components/investor_card";
import { TotalInvestmentCard, InvestmentGrowthCard } from "~/components/investment_card";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6 mt-10"> 
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TotalInvestmentCard />
          <InvestmentGrowthCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InvestmentBarChart />
          <RecentInvestments />
        </div>
      </main>
    </div>
  );
}
