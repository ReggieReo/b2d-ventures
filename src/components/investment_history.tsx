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
import { InvestmentWithBusiness } from "~/components/pie_chart";

export function InvestmentHistoryTable({
  allInvestment,
}: {
  allInvestment: InvestmentWithBusiness[];
}) {
  const totalInvestments = allInvestment
    .flatMap((investment) => investment.fund || [])
    .reduce((acc, val) => acc + val, 0);
  
  return (
    <Table>
      <TableCaption>A list of your investment.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Company</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allInvestment.map((inv) => (
          <TableRow key={inv.investmentID}>
            <TableCell className="font-medium">{inv.investmentID}</TableCell>
            <TableCell>{inv.createdAt.toLocaleDateString()}</TableCell>
            <TableCell>{inv.business?.company}</TableCell>
            <TableCell className="text-right">${inv.fund
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">${totalInvestments
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
