import { Sidebar } from "~/components/browsing/sidebar";
import { InvestmentBarChart } from "~/components/investment_portfolio/bar_chart";
import { RecentInvestments } from "~/components/admin/investor_card";
import {
  TotalInvestmentCard,
  InvestmentWeekCard,
} from "~/components/investment/investment_card";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  return (
    <div className="flex min-h-screen">
      <main className="mt-10 flex-1 space-y-6 p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TotalInvestmentCard />
          <InvestmentWeekCard />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InvestmentBarChart />
          <RecentInvestments />
        </div>
      </main>
    </div>
  );
}
