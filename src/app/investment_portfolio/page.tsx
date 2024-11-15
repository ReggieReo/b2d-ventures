import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  InvestmentWithBusiness,
  InvestorPortPieChart,
} from "~/components/pie_chart";
import { InvestmentHistoryTable } from "~/components/investment_history";
import { auth } from "@clerk/nextjs/server";
import { getFirstMediaByTypeAndUserID, getInvestmentByUserID } from "~/server/fetchQuery";
import { FinancialStatementUpload } from "~/components/financial_statement_upload";

export const dynamic = "force-dynamic";

export default async function InvestorPortfolioPage() {
  const userID = auth().userId;
  const financialStatement = await getFirstMediaByTypeAndUserID("financial_statement", userID!);
  if (!financialStatement) {
    return (
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-yellow-50 p-4 rounded-md mb-4">
        <p className="text-yellow-800">
          Please upload your financial statement before making any investments.
        </p>
      </div>
      <FinancialStatementUpload />
    </div>
  )}

  const allInvestment = await getInvestmentByUserID(userID!);
  const validatedInvestment: InvestmentWithBusiness[] = allInvestment.map(
    (inv) => ({
      investmentID: inv.investmentID,
      businessID: inv.businessID,
      userID: inv.userID,
      createdAt: inv.createdAt,
      updatedAt: inv.updatedAt,
      fund: inv.fund,
      industry: inv.business.industry ?? "",
      business: inv.business
        ? {
            businessID: inv.business.businessID,
            company: inv.business.company ?? "",
          }
        : null,
    }),
  );

  const totalInvestments = validatedInvestment
    .flatMap((investment) => investment.fund || [])
    .reduce((acc, val) => acc + val, 0);

  const countInvestments = validatedInvestment
    .flatMap((investment) => investment.fund || [])
    .reduce((acc) => acc + 1, 0);

  const avgInvestment =
    countInvestments > 0 ? totalInvestments / countInvestments : 0;

    const biggestInvestment =
        validatedInvestment.length > 0
            ? Math.max(...validatedInvestment.flatMap((inv) => inv.fund || [0]))
            : 0;

    const smallestInvestment =
        validatedInvestment.length > 0
            ? Math.min(...validatedInvestment.flatMap((inv) => inv.fund || [0]))
            : 0;


    return (
      <main className="justify-left items-left m-4 flex min-h-screen flex-col gap-y-5">
        <p className={"text-3xl font-bold"}>My Business Portfolio</p>
        <div
          className={
            "flex w-full max-w-7xl flex-col justify-center gap-4 self-center md:flex-row"
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
                <p className={"text-2xl"}>Grand Total:</p>
                <p className={"text-3xl font-bold"}>
                  $
                  {totalInvestments
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
              </div>
              <div className={"mt-4 flex flex-row justify-center gap-x-5"}>
                <div className={"mr-2 flex flex-col gap-2"}>
                  <div className={"flex flex-col"}>
                    <p>Number of Investment:</p>
                    <p className={"font-bold"}>{countInvestments}</p>
                  </div>
                  <div className={"mr-2 flex flex-col gap-2"}>
                    <p>Average Investment:</p>
                    <p className={"font-bold"}>
                      $
                      {avgInvestment
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                  </div>
                </div>
                <div className={"mr-2 flex flex-col gap-2"}>
                  <div className={"flex flex-col"}>
                    <p>Biggest Invested:</p>
                    <p className={"font-bold"}>${biggestInvestment.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }</p>
                  </div>
                  <div className={"mr-2 flex flex-col gap-2"}>
                    <p>Smallest Invested:</p>
                    <p className={"font-bold"}>${smallestInvestment
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                  </div>
                </div>
                <div className={"flex flex-col gap-2"}></div>
              </div>
            </CardContent>
          </Card>
          <InvestorPortPieChart allInvestment={validatedInvestment} />
        </div>
        <div
          className={
            "m-4 flex w-full max-w-7xl flex-col justify-center gap-4 self-center"
          }
        >
          <p className={"text-2xl font-bold"}>Invetment Breakdown</p>
          <InvestmentHistoryTable allInvestment={validatedInvestment}/>
        </div>
      </main>
    );
}
