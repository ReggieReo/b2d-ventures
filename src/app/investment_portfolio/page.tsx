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
} from "~/components/util/pie_chart";
import { InvestmentHistoryTable } from "~/components/investment/investment_history";
import { auth } from "@clerk/nextjs/server";
import { FinancialStatementUpload } from "~/components/investment_portfolio/financial_statement_upload";
import { calculateStockPrice } from "~/utils/util";
import { getInvestmentByUserID } from "~/server/repository/investment_repository";
import { getFirstMediaByTypeAndUserID } from "~/server/repository/media_repository";

export const dynamic = "force-dynamic";

export default async function InvestorPortfolioPage() {
  const userID = auth().userId;
  const financialStatement = await getFirstMediaByTypeAndUserID(
    "financial_statement",
    userID!,
  );

  if (!financialStatement) {
    return (
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 rounded-md bg-yellow-50 p-4">
          <p className="text-yellow-800">
            Please upload your financial statement before making any
            investments.
          </p>
        </div>
        <FinancialStatementUpload />
      </div>
    );
  }

  if (financialStatement.status === 0) {
    return (
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 rounded-md bg-blue-50 p-4">
          <p className="text-blue-800">
            Your financial statement is pending review by our administrators.
            We'll notify you once it's approved.
          </p>
        </div>
        <div className="text-gray-600">
          Uploaded on:{" "}
          {new Date(financialStatement.createdAt).toLocaleDateString()}
        </div>
      </div>
    );
  }

  if (financialStatement.status === 2) {
    return (
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-red-800">
            Your financial statement was not approved. Please upload a new
            statement.
          </p>
        </div>
        <FinancialStatementUpload />
      </div>
    );
  }

  const allInvestment = await getInvestmentByUserID(userID!);
  const validatedInvestment: InvestmentWithBusiness[] = allInvestment.map(
    (inv) => ({
      investmentID: inv.investmentID,
      businessID: inv.businessID!,
      userID: inv.userID,
      createdAt: inv.createdAt,
      updatedAt: inv.updatedAt,
      fund: inv.fund,
      industry: inv.business!.industry ?? "",
      business: inv.business
        ? {
            businessID: inv.business.businessID,
            company: inv.business.company ?? "",
            valuation: inv.business.valuation ?? undefined,
            target_stock: inv.business.target_stock ?? undefined,
            allocation: inv.business.allocation ?? undefined,
          }
        : null,
    }),
  );

  const totalInvestmentValue = validatedInvestment.reduce((acc, investment) => {
    if (
      !investment.business?.valuation ||
      !investment.business?.target_stock ||
      !investment.business?.allocation
    ) {
      return acc;
    }
    const stockPrice = calculateStockPrice(
      investment.business.valuation,
      investment.business.target_stock,
      investment.business.allocation,
    );
    return acc + stockPrice * investment.fund;
  }, 0);

  const totalStocks = validatedInvestment
    .flatMap((investment) => investment.fund || [])
    .reduce((acc, val) => acc + val, 0);

  const countInvestments = validatedInvestment.length;

  const avgInvestmentValue =
    countInvestments > 0 ? totalInvestmentValue / countInvestments : 0;

  const investmentValues = validatedInvestment.map((inv) => {
    if (
      !inv.business?.valuation ||
      !inv.business?.target_stock ||
      !inv.business?.allocation
    ) {
      return 0;
    }
    const stockPrice = calculateStockPrice(
      inv.business.valuation,
      inv.business.target_stock,
      inv.business.allocation,
    );
    return stockPrice * inv.fund;
  });

  const biggestInvestmentValue = Math.max(...investmentValues, 0);
  const smallestInvestmentValue =
    investmentValues.length > 0
      ? Math.min(...investmentValues.filter((val) => val > 0))
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
              <p className={"text-2xl"}>Portfolio Value:</p>
              <p className={"text-3xl font-bold"}>
                $
                {totalInvestmentValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className={"text-md mt-1 text-gray-500"}>
                {totalStocks.toLocaleString()} total stocks
              </p>
            </div>
            <div className={"mt-4 flex flex-row justify-center gap-x-5"}>
              <div className={"mr-2 flex flex-col gap-2"}>
                <div className={"flex flex-col"}>
                  <p>Number of Investments:</p>
                  <p className={"font-bold"}>{countInvestments}</p>
                </div>
                <div className={"mr-2 flex flex-col gap-2"}>
                  <p>Average Investment:</p>
                  <p className={"font-bold"}>
                    $
                    {avgInvestmentValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              <div className={"mr-2 flex flex-col gap-2"}>
                <div className={"flex flex-col"}>
                  <p>Biggest Investment:</p>
                  <p className={"font-bold"}>
                    $
                    {biggestInvestmentValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className={"mr-2 flex flex-col gap-2"}>
                  <p>Smallest Investment:</p>
                  <p className={"font-bold"}>
                    $
                    {smallestInvestmentValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
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
        <InvestmentHistoryTable allInvestment={validatedInvestment} />
      </div>
    </main>
  );
}
