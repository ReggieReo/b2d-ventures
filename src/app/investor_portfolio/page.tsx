import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const dynamic = "force-dynamic";

export default async function InvestorPortfolioPage() {
  return (
    <main className="justify-left items-left mb-4 ml-4 mt-4 flex min-h-screen flex-col">
      <p className={"mb-5 text-3xl font-bold"}>My Business Portfolio</p>
        <div className={"flex flex-row gap-4 justify-center"}>
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
              <CardDescription>
                A brief summary of the investment portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={"flex flex-col items-center"}>
                <p className={"text-2xl"}>Total:</p>
                <p className={"text-3xl font-bold"}>$2,250</p>
              </div>
              <div className={"mt-4 flex flex-row justify-center gap-x-5"}>
                <div className={"flex flex-col gap-2"}>
                  <div className={"flex flex-col"}>
                    <p className={"mr-1"}>A1-sector:</p>
                    <p className={"font-bold"}>$1,000</p>
                  </div>
                  <div className={"flex flex-col"}>
                    <p className={"mr-1"}>A2-sector:</p>
                    <p className={"font-bold"}>$1,000</p>
                  </div>
                  <div className={"flex flex-col"}>
                    <p className={"mr-1"}>A3-sector:</p>
                    <p className={"font-bold"}>$1,000</p>
                  </div>
                </div>
                <div className={"flex flex-col gap-2"}>
                  <div className={"flex flex-col"}>
                    <p className={"mr-1"}>B1-sector:</p>
                    <p className={"font-bold"}>$1,000</p>
                  </div>
                  <div className={"flex flex-col"}>
                    <p className={"mr-1"}>B2-sector:</p>
                    <p className={"font-bold"}>$1,000</p>
                  </div>
                  <div className={"flex flex-col"}>
                    <p className={"mr-1"}>B3-sector:</p>
                    <p className={"font-bold"}>$1,000</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Investment Breakdown</CardTitle>
            </CardHeader>
          </Card>
        </div>
    </main>
  );
}
