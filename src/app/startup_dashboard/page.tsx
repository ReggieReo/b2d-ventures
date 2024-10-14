import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select";


import {Button} from "~/components/ui/button";

import * as React from "react";

import { Progress } from "~/components/ui/progress";

export const dynamic = "force-dynamic";

const dataroom_request = [
  { name: "Elon Musk", date: "2024-10-01", status: "Pending" },
  { name: "Bill Gates", date: "2024-10-05", status: "Pending"},
  { name: "Warren Buffett", date: "2024-10-10", status: "Pending"},
  { name: "Sundar Pichai", date: "2024-10-12", status: "Pending"},
  { name: "Satya Nadella", date: "2024-10-14", status: "Pending"},
];


export default async function StartupDashboard() {
  return (
    <main className="justify-left m-4 flex min-h-screen flex-col">
      <p className={"mb-5 text-3xl font-bold"}>My Fundraising</p>
      <div className={"flex flex-col items-center gap-4"}>
        <Card className={"w-full"}>
          <CardHeader>
            <CardTitle>Fundraising Summary</CardTitle>
            {/*TODO: Change the CardDescription to the time the info updated*/}
            <CardDescription>Last Updated: Date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={"flex flex-col gap-y-5"}>
              <div className={"flex flex-row gap-x-10"}>
                <div className={"flex-col"}>
                  <p className={"text-2xl"}>Fund Raised</p>
                  <div className={"ml-3 flex flex-row items-end gap-2"}>
                    {/*TODO: Implement logic for total fund raised*/}
                    <p className={"text-3xl font-bold"}>$10,000</p>
                    {/*TODO: Implement logic for fund diff to last week*/}
                    <p>(+$1000 from last week)</p>
                  </div>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"text-2xl"}>Investor</p>
                  <div className={"ml-3 flex flex-row items-end gap-2"}>
                    {/*TODO: Implement logic for Total investor*/}
                    <p className={"text-3xl font-bold"}>41</p>
                    {/*TODO: Implement logic for diff investor to last week*/}
                    <p>(+3 from last week)</p>
                  </div>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"text-2xl"}>Day to go</p>
                  <div className={"ml-3 flex flex-row items-end gap-2"}>
                    {/*TODO: Implement logic for Day left*/}
                    <p className={"text-3xl font-bold"}>75</p>
                    {/*TODO: Implement logic for day from start*/}
                    <p>(15 days from start)</p>
                  </div>
                </div>
              </div>
              <div className={"ml-5 flex flex-row items-center gap-x-5"}>
                {/*TODO: Implement fundraised percentage logic*/}
                <p>32%</p>
                <Progress value={32} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={"w-full"}>
          <CardHeader>
            <CardTitle>Statistical Data</CardTitle>
            <CardDescription>
              The statistical data occur in the fundraising
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={"flex flex-col items-center"}>
              <div className={"flex flex-row gap-x-10"}>
                <div className={"flex flex-col"}>
                  {/*TODO: Implement minimum check-size logic*/}
                  <p className={"text-2xl"}>Lowest Check-size Value</p>
                  <p className={"ml-3 text-3xl font-bold"}>$50</p>
                </div>
                <div className={"flex flex-col"}>
                  {/*TODO: Implement maximum check-size logic*/}
                  <p className={"text-2xl"}>Highest Check-size Value</p>
                  <p className={"ml-3 text-3xl font-bold"}>$1,000</p>
                </div>
                <div className={"flex flex-col"}>
                  {/*TODO: Implement average check-size logic*/}
                  <p className={"text-2xl"}>Average Check-size Value</p>
                  <p className={"ml-3 text-3xl font-bold"}>$127</p>
                </div>
                <div className={"flex flex-col"}>
                  {/*TODO: Implement mode check-size logic*/}
                  <p className={"text-2xl"}>Most Invested Amount</p>
                  <p className={"ml-3 text-3xl font-bold"}>$100</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={"w-full"}>
          <CardHeader>
            <CardTitle>Dataroom Requests</CardTitle>
            <CardDescription>
              The request for the dataroom access
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                {dataroom_request.map((request, index) => (
                    <TableRow key={`${request.name}-${index}`}>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell className="text-right">
                        <Select defaultValue={request.status}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder={"Pending"}/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Accept">Accept</SelectItem>
                            <SelectItem value="Denied">Denied</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className={"w-full"}>
          <CardHeader>
            <CardTitle>More Fundraising Details</CardTitle>
            <CardDescription>
              The more details of the fundraising
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={"flex flex-col items-center gap-y-5"}>
              <div className={"flex flex-row gap-x-10"}>
                <div className={"flex flex-col"}>
                  {/*TODO: Implement fundraising info logic*/}
                  <p className={"text-2xl"}>Business Name</p>
                  <p className={"ml-3 text-3xl font-bold"}>Rento</p>
                </div>

                <div className={"flex flex-col"}>
                  <p className={"text-2xl"}>Target Fund</p>
                  <p className={"ml-3 text-3xl font-bold"}>$100,000</p>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"text-2xl"}>Deadline</p>
                  <p className={"ml-3 text-3xl font-bold"}>28 Jan 2025</p>
                </div>
              </div>
              <Button>Edit Fundraising Information</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
