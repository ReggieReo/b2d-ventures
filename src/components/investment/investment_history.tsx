import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { InvestmentWithBusiness } from "~/components/util/pie_chart";
import { calculateStockPrice } from "~/utils/util";

export function InvestmentHistoryTable({
  allInvestment,
}: {
  allInvestment: InvestmentWithBusiness[];
}) {
  const totalStocks = allInvestment
    .flatMap((investment) => investment.fund || [])
    .reduce((acc, val) => acc + val, 0);

  const totalInvestmentValue = allInvestment.reduce((acc, investment) => {
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

  return (
    <Table>
      <TableCaption>A list of your investment.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Company</TableHead>
          <TableHead className="text-right">Stocks</TableHead>
          <TableHead className="text-right">Stock Price</TableHead>
          <TableHead className="text-right">Investment Value</TableHead>
          <TableHead className="text-right">Ownership</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allInvestment.map((inv) => {
          const stockPrice =
            inv.business?.valuation &&
            inv.business?.target_stock &&
            inv.business?.allocation
              ? calculateStockPrice(
                  inv.business.valuation,
                  inv.business.target_stock,
                  inv.business.allocation,
                )
              : 0;

          const investmentValue = stockPrice * inv.fund;
          const ownershipPercentage = inv.business?.valuation
            ? (investmentValue / inv.business.valuation) * 100
            : 0;

          return (
            <TableRow key={inv.investmentID}>
              <TableCell>{inv.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>{inv.business?.company}</TableCell>
              <TableCell className="text-right">
                {inv.fund.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                $
                {stockPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-right">
                $
                {investmentValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-right">
                {ownershipPercentage.toFixed(2)}%
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {totalStocks.toLocaleString()}
          </TableCell>
          <TableCell />
          <TableCell className="text-right">
            $
            {totalInvestmentValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}
