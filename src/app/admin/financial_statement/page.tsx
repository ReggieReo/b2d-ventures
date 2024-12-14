import { Sidebar } from "~/components/browsing/sidebar";
import { FinancialStatementsTable } from "~/components/admin/financial_statements_table";
import { getAllImages, getPendingFinancialStatements } from "~/server/repository/media_repository";

export const dynamic = "force-dynamic";

export default async function FinancialStatementsPage() {
  const statements = await getPendingFinancialStatements();
  const sta = await getAllImages();
  console.log(sta)
  console.log(statements, "a")

  return (
    <div className="flex min-h-screen">
      <main className="mt-10 flex-1 space-y-6 p-6">
        <h1 className="text-3xl font-bold">Financial Statement Approvals</h1>
        <FinancialStatementsTable statements={statements} />
      </main>
    </div>
  );
}
