import { Sidebar } from "~/components/sidebar";
import { getPendingFinancialStatements } from "~/server/fetchQuery";
import { FinancialStatementsTable } from "~/components/financial_statements_table";

export const dynamic = "force-dynamic";

export default async function FinancialStatementsPage() {
  const statements = await getPendingFinancialStatements();
  
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 space-y-6 mt-10">
        <h1 className="text-3xl font-bold">Financial Statement Approvals</h1>
        <FinancialStatementsTable statements={statements} />
      </main>
    </div>
  );
}
