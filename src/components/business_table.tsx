"use client";

import * as React from "react";
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
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { CampaignData } from "~/models/fund";

type InvestmentData = {
  amount: number;
  Investment: string;
};

const investmentData: InvestmentData[] = [
  { amount: 316, Investment: "Rento" },
  { amount: 242, Investment: "Green Energy Solutions" },
  { amount: 837, Investment: "Urban Farming Co" },
  { amount: 874, Investment: "Rento" },
  { amount: 721, Investment: "EcoBuild Constructors" },
];

// Define columns for InvestmentData
export const columns: ColumnDef<InvestmentData>[] = [
  {
    accessorKey: "Investment",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Business
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("Investment")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="pr-6 text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="pr-6 text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "checkout",
    header: "Action",
    cell: ({ row }) => (
      <Button onClick={() => handleCheckout(row.original)}>Checkout</Button>
    ),
    enableSorting: false,
  },
];

const handleCheckout = (rowData: InvestmentData) => {
  console.log(`Processing checkout for:`, rowData);
  alert(`Confirmed checkout for ${rowData.Investment}`);
};

export default function BusinessTable({ data: initialData }: { data: CampaignData[] }) {
  const [data, setData] = React.useState<CampaignData[]>(initialData); // Use state to hold data for local updates
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Define handleApprove inside the component
  const handleApprove = (rowData: CampaignData) => {
    if (confirm(`Are you sure you want to approve the campaign for ${rowData.company}?`)) {
      setData((prevData) =>
        prevData.map((campaign) =>
          campaign.businessID === rowData.businessID
            ? { ...campaign, isApproved: true }
            : campaign
        )
      );
      alert(`Approved fundraising campaign for ${rowData.company}`);
    }
  };

  // Define campaignColumns inside the component to access handleApprove
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
        <Button onClick={() => handleApprove(row.original)}>
          Approve Campaign
        </Button>
      ),
      enableSorting: false,
    },
  ];

  const investmentTable = useReactTable({
    data: investmentData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    initialState: { pagination: { pageSize: 10 } },
  });

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
          {/* Campaign Approval Table */}
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

          {/* Investment Table */}
          <h2 className="mb-2 mt-6 text-2xl font-bold">Business Table</h2>
          <div className="flex items-center py-2">
            <Input
              placeholder="Filter businesses..."
              value={(investmentTable.getColumn("Investment")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                investmentTable.getColumn("Investment")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {investmentTable.getHeaderGroups().map((headerGroup) => (
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
                {investmentTable.getRowModel().rows?.length ? (
                  investmentTable.getRowModel().rows.map((row) => (
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
                    <TableCell colSpan={columns.length} className="h-24 text-center">
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
              onClick={() => investmentTable.previousPage()}
              disabled={!investmentTable.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => investmentTable.nextPage()}
              disabled={!investmentTable.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
