"use client";

import * as React from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "~/components/sidebar";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { CampaignData } from "~/models/fund";
import InvestmentTable from "~/components/investment_table";
import { approveBusiness } from "~/server/action/approve_business";

export default function CampaignApprovalTable({ data: initialData }: { data: CampaignData[] }) {
  const [data, setData] = React.useState<CampaignData[]>(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApprove = (rowData: CampaignData) => {
    if (confirm(`Are you sure you want to approve the campaign for ${rowData.company}?`)) {
      startTransition(async () => {
        const result = await approveBusiness(Number(rowData.businessID));
        if (result.success) {
          router.refresh(); // Refresh the page to update the table data
        } else {
          alert(`Error: ${result.error}`);
        }
      });
    }
  };

  const campaignColumns: ColumnDef<CampaignData>[] = [
    {
      accessorKey: "company",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("company")}</div>,
    },
    {
      accessorKey: "website",
      header: "Website",
      cell: ({ row }) => (
        <a
          href={row.getValue("website")}
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.getValue("website")}
        </a>
      ),
    },
    {
      accessorKey: "industry",
      header: "Industry",
      cell: ({ row }) => <div>{row.getValue("industry")}</div>,
    },
    {
      accessorKey: "target_fund",
      header: () => <div className="text-right">Amount to Raise</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("target_fund"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "allocation",
      header: "Allocation",
      cell: ({ row }) => <div>{row.getValue("allocation")}</div>,
    },
    {
      accessorKey: "deadline",
      header: "Deadline",
      cell: ({ row }) => <div>{row.getValue("deadline")}</div>,
    },
    {
      id: "approve",
      header: "Action",
      cell: ({ row }) => (
        <Button onClick={() => handleApprove(row.original)} disabled={isPending}>
          {isPending ? "Approving..." : "Approve Campaign"}
        </Button>
      ),
      enableSorting: false,
    },
  ];

  const campaignTable = useReactTable({
    data,
    columns: campaignColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="mt-10 flex-1 space-y-4 p-6">
        <div className="w-full">
          <h2 className="mb-2 text-2xl font-bold">Fundraising Campaign Approval</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {campaignTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {campaignTable.getRowModel().rows?.length ? (
                  campaignTable.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={campaignColumns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-2">
            <Button
              variant="outline"
              onClick={() => campaignTable.previousPage()}
              disabled={!campaignTable.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => campaignTable.nextPage()}
              disabled={!campaignTable.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Investment Table Section */}
        <div className="w-full">
          <InvestmentTable />
        </div>
      </main>
    </div>
  );
}
