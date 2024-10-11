import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const dynamic = "force-dynamic";

export default async function StartupDashboard() {
  return (
    <main className="justify-left mb-4 ml-4 mt-4 flex min-h-screen flex-col">
      <p className={"mb-5 text-3xl font-bold"}>My Fundraising</p>
      <div className={"mx-3 flex flex-col items-center"}>
        <Card>
          <CardHeader>
            <CardTitle>Fundraising Summary</CardTitle>
            {/*TODO: Change the CardDescription to the time the info updated*/}
            <CardDescription>Last Updated: Date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={"flex min-w-fit flex-row justify-center gap-x-10"}>
              <div className={"flex flex-col"}>
                <p className={"text-2xl"}>Fund Raised:</p>
                <div className={"flex flex-row items-end"}>
                  {/*TODO: Add a logic to display total fund raised*/}
                  <p className={"mr-2 text-3xl font-bold"}>$70,000</p>
                  {/*TODO: Add a logic to display difference fund raised from last week*/}
                  <p className={"text-green-500"}>(+$1000 from last week)</p>
                </div>
              </div>
              <div className={"flex flex-col"}>
                <p className={"text-2xl"}>Investors:</p>
                <div className={"flex flex-row items-end"}>
                  {/*TODO: Add a logic to display total investor*/}
                  <p className={"mr-2 text-3xl font-bold"}>41</p>
                  {/*TODO: Add a logic to display difference investor from last week*/}
                  <p className={"text-green-500"}>(+3 from last week)</p>
                </div>
              </div>
              <div className={"flex flex-col"}>
                <p className={"text-2xl"}>Day to go:</p>
                {/*TODO: Add a logic to display day left in fundraising*/}
                <p className={"mr-2 text-3xl font-bold"}>75</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
