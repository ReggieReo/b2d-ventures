"use client";

import * as React from "react";
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

type UserInvestmentData = {
  userName: string;
  companyName: string;
  investmentAmount: number;
  investmentStatus: string;
};

const userInvestmentData: UserInvestmentData[] = [
  {
    userName: "Phumrapee Chaowanapricha",
    companyName: "Rento",
    investmentAmount: 1000,
    investmentStatus: "Pending",
  },
  {
    userName: "Setthapon Thadisakun",
    companyName: "Green Energy Solutions",
    investmentAmount: 2000,
    investmentStatus: "Pending",
  },
  {
    userName: "Nanthawat Duang-ead",
    companyName: "Urban Farming Co",
    investmentAmount: 1500,
    investmentStatus: "Pending",
  },
];

export const userInvestmentColumns: ColumnDef<UserInvestmentData>[] = [
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("userName")}</div>,
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
    cell: ({ row }) => <div>{row.getValue("companyName")}</div>,
  },
  {
    accessorKey: "investmentAmount",
    header: () => <div className="text-center">Investment Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("investmentAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "investmentStatus",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("investmentStatus")}</div>,
  },
  {
    id: "approve",
    header: "Action",
    cell: ({ row }) => (
      <Button onClick={() => handleApproveInvestment(row.original)}>
        Confirm Investment
      </Button>
    ),
    enableSorting: false,
  },
];

const handleApproveInvestment = (rowData: UserInvestmentData) => {
  console.log(`Confirming investment for:`, rowData);
  alert(
    `Investment for ${rowData.userName} in ${rowData.companyName} has been confirmed.`,
  );
};

export default function DataTableWithUserInvestments() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const userInvestmentTable = useReactTable({
    data: userInvestmentData,
    columns: userInvestmentColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="flex min-h-screen">
      <main className="mt-10 flex-1 space-y-6 p-6">
        <div className="w-full">
          <h2 className="mb-4 text-2xl font-bold">Confirm User Investments</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {userInvestmentTable.getHeaderGroups().map((headerGroup) => (
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
                {userInvestmentTable.getRowModel().rows?.length ? (
                  userInvestmentTable.getRowModel().rows.map((row) => (
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
                      colSpan={userInvestmentColumns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              onClick={() => userInvestmentTable.previousPage()}
              disabled={!userInvestmentTable.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => userInvestmentTable.nextPage()}
              disabled={!userInvestmentTable.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
