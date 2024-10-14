"use client";

import * as React from "react";
import { Sidebar } from "~/app/_component/sidebar";
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
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type InvestmentData = {
  amount: number;
  Investment: string;
};

const data: InvestmentData[] = [
  {
    amount: 316,
    Investment: "Rento",
  },
  {
    amount: 242,
    Investment: "Green Energy Solutions",
  },
  {
    amount: 837,
    Investment: "Urban Farming Co",
  },
  {
    amount: 874,
    Investment: "Rento",
  },
  {
    amount: 721,
    Investment: "EcoBuild Constructors",
  },
];

export const columns: ColumnDef<InvestmentData>[] = [
  {
    accessorKey: "Investment",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Investment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("Investment")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right pr-6">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right pr-6 font-medium">{formatted}</div>;
    },
  },
  {
    id: "checkout",
    header: "Action",
    cell: ({ row }) => (
      <Button onClick={() => handleCheckout(row.original)}>
        Checkout
      </Button>
    ),
    enableSorting: false,
  },
];

const handleCheckout = (rowData: InvestmentData) => {
  console.log(`Processing checkout for:`, rowData);
  alert(`Confirmed checkout for ${rowData.Investment}`);
};

type CampaignData = {
  companyName: string;
  title: string;
  website: string;
  industry: string;
  amountToRaise: number;
  allocation: string;
  deadline: string;
};

const campaignData: CampaignData[] = [
  {
    companyName: "B2D Ventures",
    title: "CTO",
    website: "https://b2dventures.com",
    industry: "Technology",
    amountToRaise: 500000,
    allocation: "10%",
    deadline: "2024-12-01",
  },
  {
    companyName: "Green Energy Co",
    title: "Founder",
    website: "https://greenenergy.co",
    industry: "Energy",
    amountToRaise: 750000,
    allocation: "15%",
    deadline: "2024-11-15",
  },
];

export const campaignColumns: ColumnDef<CampaignData>[] = [
  {
    accessorKey: "companyName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("companyName")}</div>,
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
    accessorKey: "amountToRaise",
    header: () => <div className="text-right">Amount to Raise</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountToRaise"));

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
      <Button onClick={() => handleApprove(row.original)}>
        Approve Campaign
      </Button>
    ),
    enableSorting: false,
  },
];

const handleApprove = (rowData: CampaignData) => {
  console.log(`Approving campaign for:`, rowData);
  alert(`Approved fundraising campaign for ${rowData.companyName}`);
};

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Investment Table (with page size of 10)
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10, // Limit to 10 rows per page
      },
    },
  });

  // Campaign Table (with page size of 5)
  const campaignTable = useReactTable({
    data: campaignData,
    columns: campaignColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 5, // Limit to 5 rows per page
      },
    },
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
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {campaignTable.getRowModel().rows?.length ? (
                  campaignTable.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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

          <h2 className="mb-2 mt-6 text-2xl font-bold">Investment Table</h2>
          <div className="flex items-center py-2">
            <Input
              placeholder="Filter investments..."
              value={
                (table.getColumn("Investment")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("Investment")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
                      colSpan={columns.length}
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
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
