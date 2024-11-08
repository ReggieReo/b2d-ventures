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
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StartupDashboard() {
  const business = await getBusinessByUserID();

  if (!business) {
    return (
        <main>
          <div className={"flex flex-col items-center gap-y-4"}>
            <p className={"text-3xl font-bold"}>No Business Found</p>
            <Button>
              <Link href={"/create_fundraising"}>Create Business</Link>
            </Button>
          </div>
        </main>
    );
  }

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

  const thisWeekInvestmentAmount = investment
      .filter(inv => isInCurrentWeek(new Date(inv.createdAt))) // Assuming there's a createdAt field
      .flatMap(investment => investment.fund || [])
      .reduce((acc, val) => acc + val, 0);

  const thisWeekInvestmentCount = investment
      .filter(inv => isInCurrentWeek(new Date(inv.createdAt))) // Assuming there's a createdAt field
      .flatMap(investment => investment.fund || [])
      .reduce((acc) => acc + 1, 0);
  const minInvestment = Math.min(...investment.flatMap(investment => investment.fund || []));
  const maxInvestment = Math.max(...investment.flatMap(investment => investment.fund || []));
  const avgInvestment = Math.floor((totalInvestment/countInvestment))


  const dayStartFundRaise = business.createdAt
  const dayDeadline = business.deadline ? new Date(business.deadline) : new Date('2025-01-28');  const today = new Date();
  const daysToGo = Math.floor((dayDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceStart = Math.ceil((today.getTime() - dayStartFundRaise.getTime()) / (1000 * 60 * 60 * 24));

  const percentageFund = (totalInvestment/business.target_fund!) * 100

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
                  <div className={"ml-3 flex flex-col gap-2 lg:flex-row"}>
                    <p className={"text-3xl font-bold"}>
                      ${totalInvestment
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                    <p>
                      ($
                      {thisWeekInvestmentAmount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      from this week)
                    </p>
                  </div>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"text-2xl"}>Investor</p>
                  <div className={"ml-3 flex flex-col gap-2 lg:flex-row"}>
                    <p className={"text-3xl font-bold"}>{countInvestment}</p>
                    <p>({thisWeekInvestmentCount} from this week)</p>
                  </div>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"text-2xl"}>Day to go</p>
                  <div className={"ml-3 flex flex-col  gap-2 lg:flex-row"}>
                    <p className={"text-3xl font-bold"}>{daysToGo}</p>
                    <p>({daysSinceStart} days from start)</p>
                  </div>
                </div>
              </div>
              <div className={"ml-5 flex flex-row items-center gap-x-5"}>
                <p>{Math.round(percentageFund)}%</p>
                <Progress value={percentageFund} />
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
                <div className={"flex flex-col"}><p className={"text-2xl"}>Lowest Check-size Value</p>
                  <p className={"ml-3 text-3xl font-bold"}>${minInvestment
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"text-2xl"}>Highest Check-size Value</p>
                  <p className={"ml-3 text-3xl font-bold"}>${maxInvestment
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"text-2xl"}>Average Check-size Value</p>
                  <p className={"ml-3 text-3xl font-bold"}>${avgInvestment.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
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
                  <p className={"text-2xl"}>Business Name</p>
                  <p className={"ml-3 text-3xl font-bold"}>
                    {business.company}
                  </p>
                </div>

                <div className={"flex flex-col"}>
                  <p className={"text-2xl"}>Target Fund</p>
                  <p className={"ml-3 text-3xl font-bold"}>
                    {business.target_fund}
                  </p>
                </div>
                <div className={"flex flex-col"}>
                  <p className={"text-2xl"}>Deadline</p>
                  <p className={"ml-3 text-3xl font-bold"}>
                    {dayDeadline.toLocaleDateString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
