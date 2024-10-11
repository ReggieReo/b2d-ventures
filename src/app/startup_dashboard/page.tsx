import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import * as React from "react";

import { Progress } from "~/components/ui/progress";

export const dynamic = "force-dynamic";

export default async function StartupDashboard() {
  return (
    <main className="justify-left m-4 flex min-h-screen flex-col">
      <p className={"mb-5 text-3xl font-bold"}>My Fundraising</p>
      <div className={"flex flex-col items-center"}>
        <Card className={"w-full"}>
          <CardHeader>
            <CardTitle>Fundraising Summary</CardTitle>
            {/*TODO: Change the CardDescription to the time the info updated*/}
            <CardDescription>Last Updated: Date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={"flex flex-row justify-center gap-x-10"}>
              <div className={"flex-col"}>
                <p className={"text-2xl"}>Fund Raised</p>
                <div className={"ml-3 flex flex-row items-end gap-2"}>
                  {/*TODO: Implement logic for total fund raised*/}
                  <p className={"text-3xl font-bold"}>$10,000</p>
                  {/*TODO: Implement logic for fund diff to last week*/}
                  <p>(+$1000 from last week)</p>
                </div>
              </div>
              <div className={"flex-col"}>
                <p className={"text-2xl"}>Investor</p>
                <div className={"ml-3 flex flex-row items-end gap-2"}>
                  {/*TODO: Implement logic for Total investor*/}
                  <p className={"text-3xl font-bold"}>41</p>
                  {/*TODO: Implement logic for diff investor to last week*/}
                  <p>(+3 from last week)</p>
                </div>
              </div>
              <div className={"flex-col"}>
                <p className={"text-2xl"}>Day to go</p>
                <div className={"ml-3 flex flex-row items-end gap-2"}>
                  {/*TODO: Implement logic for Day left*/}
                  <p className={"text-3xl font-bold"}>75</p>
                  {/*TODO: Implement logic for day from start*/}
                  <p>(15 days from start)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
