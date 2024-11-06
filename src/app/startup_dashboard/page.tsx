import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Button } from "~/components/ui/button";

import * as React from "react";

import { Progress } from "~/components/ui/progress";
import {getBusinessByUserID, getInvestmentByBusinessID, getRequestByID} from "~/server/fetchQuery";
import { redirect } from "next/navigation";

import {
  DataroomRequestWithUser,
  DataroomTable,
} from "~/components/dataroomTable";

export const dynamic = "force-dynamic";

export default async function StartupDashboard() {
  const business = await getBusinessByUserID();

  if (!business) redirect("/browse_business");

  const businessID = business.businessID;

  const dataroomRequests = await getRequestByID(businessID);

  const validatedRequests: DataroomRequestWithUser[] = dataroomRequests.map(
    (request) => ({
      requestID: request.requestID,
      userID: request.userID!,
      businessID: request.businessID,
      requestStatus: request.requestStatus,
      createdAt: new Date(request.createdAt),
      user: {
        userID: request.user?.userID,
        name: request.user?.name,
      },
    }),
  );
  const isInCurrentWeek = (date: Date) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today.setDate(today.getDate() + 7));
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  };

  const investment = await getInvestmentByBusinessID(businessID);


  const businessUpdateAt = business.updatedAt?.toLocaleDateString('en-US');

  const totalInvestment = investment
      .flatMap(investment => investment.fund || [])  // Get all funds, with fallback to empty if undefined
      .reduce((acc, val) => acc + val, 0);           // Sum all values

  const countInvestment = investment
      .flatMap(investment => investment || [])
      .reduce((acc) => acc + 1, 0);

  const thisWeekInvestment = investment
      .filter(inv => isInCurrentWeek(new Date(inv.createdAt))) // Assuming there's a createdAt field
      .flatMap(investment => investment.fund || [])
      .reduce((acc, val) => acc + val, 0);

  const investmentDiff = thisWeekInvestment;

  return (
    <main className="justify-left m-4 flex min-h-screen flex-col">
      <p className={"mb-5 text-3xl font-bold"}>My Fundraising</p>
      <div className={"flex flex-col items-center gap-4"}>
        <Card className={"w-full"}>
          <CardHeader>
            <CardTitle>Fundraising Summary</CardTitle>
            <CardDescription>Last Updated: {businessUpdateAt}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={"flex flex-col gap-y-5"}>
              <div className={"flex flex-row gap-x-10"}>
                <div className={"flex-col"}>
                  <p className={"text-2xl"}>Fund Raised</p>
                  <div className={"ml-3 flex flex-row items-end gap-2"}>
                    <p className={"text-3xl font-bold"}>{totalInvestment}</p>
                    <p>({investmentDiff} from last week)</p>
                  </div>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"text-2xl"}>Investor</p>
                  <div className={"ml-3 flex flex-row items-end gap-2"}>
                    <p className={"text-3xl font-bold"}>{countInvestment}</p>
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
            <DataroomTable dataroomRequestData={validatedRequests} />
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
