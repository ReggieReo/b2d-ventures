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
      <div className={"flex flex-row gap-4"}>
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
            <CardDescription>
              A brief summary of the investment portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className={"flex flex-row"}>
            <div className={"mb-4 ml-4 flex flex-col gap-y-3"}>
              <div>
                <p>Total:</p>
                <p className={"text-xl font-bold"}>$2,250</p>
              </div>
              <div>
                <p>Media:</p>
                <p className={"text-xl font-bold"}>$150</p>
              </div>
              <div>
                <p>Technology</p>
                <p className={"text-xl font-bold"}>$450</p>
              </div>
              <div>
                <p>Gaming</p>
                <p className={"text-xl font-bold"}>$200</p>
              </div>
            </div>
            <div className={"mb-4 flex flex-col gap-y-3"}>
              <div>
                <p>Finance and Fintech:</p>
                <p className={"text-xl font-bold"}>$250</p>
              </div>
              <div>
                <p>Healthcare:</p>
                <p className={"text-xl font-bold"}>$350</p>
              </div>
              <div>
                <p>Energy</p>
                <p className={"text-xl font-bold"}>$550</p>
              </div>
              <div>
                <p>Real Estate</p>
                <p className={"text-xl font-bold"}>$300</p>
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
