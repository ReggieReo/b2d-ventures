"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { RequestDataroomStatusEnum } from "~/utils/enum/requestDataroomStatusEnum";
import * as React from "react";
import {updateDataroomRequestAction} from "~/server/action/dataroom_request_action";
import {sendDataroomApprovalEmail} from "~/server/action/send_dataroom_email_action";
export type DataroomRequestWithUser = {
  requestID: number;
  userID: string;
  businessID: number;
  requestStatus: number;
  createdAt: Date;
  user: {
    userID?: string;
    name?: string;
    email?: string;
    media?: {
      status: number;
      createdAt: Date;
    }[];
  } | null;
};

export function DataroomTable({
  dataroomRequestData,
}: {
  dataroomRequestData: DataroomRequestWithUser[];
}) {
  const getFinancialStatementStatus = (media?: { status: number; createdAt: Date }[]) => {
    if (!media || media.length === 0) return "No Statement";
    
    const latestStatement = media.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    switch (latestStatement?.status) {
      case 0:
        return "Pending Review";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "No Statement";
    }
  };

  return (
    <Table>
      <TableCaption>A list of dataroom requests</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Financial Statement</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataroomRequestData.map((request, index) => (
          <TableRow key={`${request.userID}-${index}`}>
            <TableCell>{request.user?.name || "Unknown User"}</TableCell>
            <TableCell>{request.user?.email || "N/A"}</TableCell>
            <TableCell>{getFinancialStatementStatus(request.user?.media)}</TableCell>
            <TableCell>
              {request.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </TableCell>
            <TableCell>
              <Select
                defaultValue={request.requestStatus.toString()}
                onValueChange={async (value) => {
                  await updateDataroomRequestAction(
                    request.businessID,
                    request.userID,
                    Number(value),
                  );
                  if (Number(value) === RequestDataroomStatusEnum.Accepted) {
                    await sendDataroomApprovalEmail(
                      request.userID,
                      request.businessID,
                    );
                  }
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder={request.requestStatus.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={RequestDataroomStatusEnum.Pending.toString()}
                    disabled={true}
                  >
                    Pending
                  </SelectItem>
                  <SelectItem value={RequestDataroomStatusEnum.Accepted.toString()}>
                    Accept
                  </SelectItem>
                  <SelectItem value={RequestDataroomStatusEnum.Rejected.toString()}>
                    Denied
                  </SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
