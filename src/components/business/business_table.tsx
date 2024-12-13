"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "~/components/browsing/sidebar";
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
import { business } from "~/server/db/schema";
import InvestmentTable from "~/components/investment/investment_table";
import { businessStatusEnum } from "~/utils/enum/businessStatusEnum";
import {
  approveBusinessAction,
  declineBusinessAction,
} from "~/server/action/business_action";
import { getDayUntilDeadline } from "~/utils/util";
export type Business = typeof business.$inferSelect;

export default function CampaignApprovalTable({
  data: initialData,
}: {
  data: Business[];
}) {
  const filteredData = initialData.filter(
    (campaign) => campaign.business_status === businessStatusEnum.pending,
  );
  const [data, setData] = React.useState<Business[]>(filteredData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const router = useRouter();

  const handleApprove = async (rowData: Business) => {
    if (
      confirm(
        `Are you sure you want to approve the campaign for ${rowData.company}?`,
      )
    ) {
      try {
        const result = await approveBusinessAction(rowData.businessID);
        if (result.status === 200) {
          setData((prevData) =>
            prevData.filter((item) => item.businessID !== rowData.businessID),
          );
          router.refresh();
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error approving campaign:", error);
        alert("An unexpected error occurred while approving the campaign.");
      }
    }
  };

  const handleDecline = async (rowData: Business) => {
    if (
      confirm(
        `Are you sure you want to decline the campaign for ${rowData.company}?`,
      )
    ) {
      try {
        const result = await declineBusinessAction(rowData.businessID);
        if (result.status === 200) {
          setData((prevData) =>
            prevData.filter((item) => item.businessID !== rowData.businessID),
          );
          router.refresh();
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error declining campaign:", error);
        alert("An unexpected error occurred while declining the campaign.");
      }
    }
  };

  const campaignColumns: ColumnDef<Business>[] = [
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
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("company")}</div>
      ),
    },
    {
      accessorKey: "website",
      header: "Website",
      cell: ({ row }) => (
        <a
          href={row.getValue("website")}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center"
        >
          {row.getValue("website")}
        </a>
      ),
    },
    {
      accessorKey: "industry",
      header: "Industry",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("industry")}</div>
      ),
    },
    {
      accessorKey: "target_stock",
      header: () => <div className="text-center">Target Shares</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("target_stock"));
        const formatted = new Intl.NumberFormat("en-US").format(amount);
        return (
          <div className="text-center">
            <div className="font-medium">{formatted}</div>
            <div className="text-sm text-gray-500">shares</div>
          </div>
        );
      },
    },
    {
      accessorKey: "allocation",
      header: "Ownership Allocation",
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium">{row.getValue("allocation")}%</div>
          <div className="text-sm text-gray-500">ownership</div>
        </div>
      ),
    },
    {
      accessorKey: "deadline",
      header: "Campaign Deadline",
      cell: ({ row }) => {
        const date = new Date(row.getValue("deadline"));
        const daysToGo = getDayUntilDeadline(date.toISOString());
        return (
          <div className="text-center">
            <div className="font-medium">{date.toLocaleDateString()}</div>
            <div className="text-sm text-gray-500">
              {daysToGo > 0 ? `${daysToGo} days left` : "Ended"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "valuation",
      header: () => <div className="text-center">Company Valuation</div>,
      cell: ({ row }) => {
        const valuation = row.getValue<number>("valuation");
        return (
          <div className="text-center">
            <div className="font-medium">
              ${valuation?.toLocaleString() ?? "N/A"}
            </div>
            <div className="text-sm text-gray-500">USD</div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <Button onClick={() => handleApprove(row.original)}>Approve</Button>
          <Button
            variant="destructive"
            onClick={() => handleDecline(row.original)}
          >
            Decline
          </Button>
        </div>
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
      <main className="mt-10 flex-1 space-y-4 p-6">
        <div className="w-full">
          <h2 className="mb-2 text-2xl font-bold">
            Fundraising Campaign Approval
          </h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {campaignTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
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
                        <TableCell key={cell.id} className="text-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={campaignColumns.length}
                      className="h-24 text-center"
                    >
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

      </main>
    </div>
  );
}
