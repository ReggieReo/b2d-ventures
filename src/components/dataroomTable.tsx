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

export type DataroomRequestWithUser = {
  requestID: number;
  userID: string;
  businessID: number;
  requestStatus: number;
  createdAt: Date;
  user: {
    userID?: string | undefined;  // Make userID optional
    name?: string | null;         // Make name optional and nullable
  } | null;
};


export function DataroomTable({
  dataroomRequestData,
}: {
  dataroomRequestData: DataroomRequestWithUser[]
}) {
  return (
    <Table>
      <TableCaption>A list of dataroom requests</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataroomRequestData.map((request, index) => (
          <TableRow key={`${request.userID}-${index}`}>
            <TableCell>{request.user?.name}</TableCell>
            <TableCell>
              {new Date(request.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <Select
                defaultValue={request.requestStatus.toString()}
                onValueChange={
                async(value) => {await updateDataroomRequestAction(request.businessID, request.userID, Number(value))}
              }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder={request.requestStatus.toString()} />
                </SelectTrigger>
                <SelectContent>
                  {/*TODO: Change the value of the status*/}
                  <SelectItem
                    value={RequestDataroomStatusEnum.Pending.toString()}
                    disabled={true}
                  >
                    Pending
                  </SelectItem>
                  <SelectItem
                    value={RequestDataroomStatusEnum.Accepted.toString()}
                  >
                    Accept
                  </SelectItem>
                  <SelectItem
                    value={RequestDataroomStatusEnum.Rejected.toString()}
                  >
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
