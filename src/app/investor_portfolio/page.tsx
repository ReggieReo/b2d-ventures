import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { InvestorPortPieChart } from "~/components/pie_chart";
import { InvestmentHistoryTable } from "~/components/investment_history";

export const dynamic = "force-dynamic";

export default async function InvestorPortfolioPage() {
  return (
    <main className="justify-left items-left m-4 flex min-h-screen flex-col gap-y-5">
      <p className={"text-3xl font-bold"}>My Business Portfolio</p>
      <div
        className={
          "flex flex-col md:flex-row w-full max-w-7xl  justify-center gap-4 self-center"
        }
      >
        <Card className={"justify-center md:w-1/2"}>
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
            <CardDescription>
              A brief summary of the investment portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={"flex flex-col items-center"}>
              <p className={"text-2xl"}>Total:</p>
              <p className={"text-3xl font-bold"}>$2,250</p>
            </div>
            <div className={"mt-4 flex flex-row justify-center gap-x-5"}>
              <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-col"}>
                  <p className={"mr-1"}>A1-sector:</p>
                  <p className={"font-bold"}>$1,000</p>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"mr-1"}>A2-sector:</p>
                  <p className={"font-bold"}>$1,000</p>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"mr-1"}>A3-sector:</p>
                  <p className={"font-bold"}>$1,000</p>
                </div>
              </div>
              <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-col"}>
                  <p className={"mr-1"}>B1-sector:</p>
                  <p className={"font-bold"}>$1,000</p>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"mr-1"}>B2-sector:</p>
                  <p className={"font-bold"}>$1,000</p>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"mr-1"}>B3-sector:</p>
                  <p className={"font-bold"}>$1,000</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <InvestorPortPieChart />
      </div>
      <div
        className={
          "m-4 flex w-full max-w-7xl flex-col justify-center gap-4 self-center"
        }
      >
        <p className={"text-2xl font-bold"}>Investment Breakdown</p>
        <InvestmentHistoryTable />
      </div>
    </main>
  );
}
