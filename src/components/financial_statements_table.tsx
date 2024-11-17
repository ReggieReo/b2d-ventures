"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { media } from "~/server/db/schema";
import { approveFinancialStatement, rejectFinancialStatement } from "~/server/action/financial_statement_actions";

export function FinancialStatementsTable({ statements }: { statements: typeof media.$inferSelect[] }) {
  const handleApprove = async (mediaID: number) => {
    await approveFinancialStatement(mediaID);
    window.location.reload();
  };

  const handleReject = async (mediaID: number) => {
    await rejectFinancialStatement(mediaID);
    window.location.reload();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No pending financial statements
              </TableCell>
            </TableRow>
          ) : (
            statements.map((statement) => (
              <TableRow key={statement.mediaID}>
                <TableCell>{statement.userID}</TableCell>
                <TableCell>
                  <a href={statement.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {statement.name}
                  </a>
                </TableCell>
                <TableCell>{new Date(statement.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button onClick={() => handleApprove(statement.mediaID)} variant="default">
                      Approve
                    </Button>
                    <Button onClick={() => handleReject(statement.mediaID)} variant="destructive">
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 