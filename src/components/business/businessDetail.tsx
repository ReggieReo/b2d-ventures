"use server";
import { type business, type investment, type media } from "~/server/db/schema";
import Image from "next/image";
import Gallery from "~/components/ui/carousel_with_thumbnail";
import Link from "next/link";
import {
  Dialog,
  DialogContentNoClose as DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { RequestDataroomButton } from "~/components/business/business_detail_dataroom_request_button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { calculateStockPrice, getDayUntilDeadline } from "~/utils/util";

export async function BusinessDetail({
  businessData,
  initialRequestStatus,
  allInvestment,
  allImage,
  logo,
}: {
  businessData: typeof business.$inferSelect;
  allInvestment: (typeof investment.$inferSelect)[];
  initialRequestStatus: number;
  logo: typeof media.$inferSelect;
  allImage: (typeof media.$inferSelect)[];
}) {
  const totalInvestemntAmount = allInvestment
    .flatMap((ob) => ob.fund)
    .reduce((a, b) => a + b, 0);
  const totalNumberOfInvester = allInvestment.length;
  const totalRaise =
    totalInvestemntAmount *
    calculateStockPrice(
      businessData.valuation!,
      businessData.target_stock!,
      businessData.allocation!,
    );
  const percentInvestment =
    (totalInvestemntAmount / businessData.target_stock!) * 100;
  const daysToGo = getDayUntilDeadline(businessData.deadline!);
  const isFullyFunded = totalInvestemntAmount >= businessData.target_stock!;


  return (
    <div className="font-geist-sans my-10 flex flex-col">
      {businessData.business_status === 0 && (
        <div className="rounded-lg bg-yellow-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-yellow-800">Under Review</h2>
          <p className="text-yellow-700">
            This business is currently being reviewed by our admin team. You will be notified by email once the review is complete.
          </p>
        </div>
      )}
      <div className="flex flex-col place-content-center gap-10 md:flex-row">
        <div className="flex w-full flex-col gap-4 px-4 md:w-1/2">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-[60px] w-[60px] min-w-[60px]">
              <Image
                src={
                  logo?.url ??
                  "https://utfs.io/f/5SEK9Sxco94yBr3PU81ebWaXIzlQds7Af13tvCKGqkPirZOg"
                }
                alt="Logo"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-3xl font-bold md:text-4xl">
                {businessData.company}
              </div>
              <div className="text-center text-sm md:text-left md:text-base">
                {businessData.slogan}
              </div>
            </div>
          </div>

          <div>
            <Gallery images={allImage} />
          </div>
        </div>
        <div className="flex flex-col gap-5 p-3 md:mt-20 md:w-1/4">
          <div className="text-[24px] font-bold md:text-[28px]">
            Target Stock
          </div>
          <div className="text-3xl font-bold md:text-4xl">
            {businessData.target_stock!.toLocaleString()} shares{" "}
            <span className="text-lg text-gray-500">
              ($
              {calculateStockPrice(
                businessData.valuation!,
                businessData.target_stock!,
                businessData.allocation!,
              ).toLocaleString()}{" "}
              per share)
            </span>
          </div>
          {allInvestment.length > 0 ? (
            <>
              <div className="text-[24px] font-bold md:text-[28px]">
                Stock Raised
              </div>
              <div className="text-3xl font-bold md:text-4xl">
                {totalInvestemntAmount.toLocaleString()} shares
                <div className="text-lg text-gray-500">
                  (${totalRaise.toLocaleString()})
                </div>
              </div>
              <div className="text-sm text-gray-500 md:text-base">
                {`${percentInvestment.toLocaleString()}% raised of 100% of target fund.`}
              </div>
              <div
                className="my-3 h-2 w-full overflow-hidden rounded-full bg-gray-200"
                role="progressbar"
                aria-valuenow={percentInvestment}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-green-600" // You can change the color by modifying bg-blue-600
                  style={{ width: `${percentInvestment}%` }}
                ></div>
              </div>
              <div className="flex flex-row justify-evenly gap-5 md:flex-col">
                <div>
                  <div className="text-3xl font-bold md:text-4xl">
                    {totalNumberOfInvester}
                  </div>
                  <div className="text-lg md:text-xl">Investors</div>
                </div>
              </div>
            </>
          ) : (
            <p className={"text-3xl font-bold"}>Be the first investor!!!</p>
          )}

          {daysToGo > 0 ? (
            <div>
              <div className="text-3xl font-bold md:text-4xl">
                {daysToGo} days
                <div className="text-lg md:text-xl">Left to invest</div>
              </div>
            </div>
          ) : daysToGo === 0 ? (
            <div>
              <div className="text-3xl font-bold md:text-4xl">The Last Day</div>
              <div className="text-lg md:text-xl">To Invest</div>
            </div>
          ) : (
            <div>
              <div className="text-lg md:text-xl">
                This fundraising has been closed
              </div>
            </div>
          )}
          {daysToGo >= 0 ? (
            <div className={"grid gap-y-2"}>
              <Link
                href={`/create_investment/${businessData.businessID}`}
                className={isFullyFunded ? "pointer-events-none" : ""}
              >
                <button
                  className={`w-full rounded px-4 py-2 font-bold text-white ${
                    isFullyFunded
                      ? "cursor-not-allowed bg-gray-700"
                      : "bg-blue-700 hover:bg-blue-500"
                  }`}
                  disabled={isFullyFunded}
                >
                  {isFullyFunded
                    ? "Fully Funded"
                    : `Invest in ${businessData.company}`}
                </button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <RequestDataroomButton
                    pageID={businessData.businessID}
                    initialRequestStatus={initialRequestStatus}
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Data room request has been sent.</DialogTitle>
                    <DialogDescription>
                      You can access Rentos data room after admin approves the
                      request.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <button className="w-full rounded bg-gray-700 px-4 py-2 font-bold text-white">
              Invest in {businessData.company}
            </button>
          )}
        </div>
      </div>

      <div className="my-8 border-b border-gray-200">
        <nav
          className="mx-auto flex w-full max-w-[85%] justify-start gap-x-5"
          aria-label="Tabs"
          role="tablist"
          aria-orientation="horizontal"
        >
          <a
            href="#problem"
            className="inline-flex items-center border-b-2 border-transparent px-1 py-4 text-lg font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Problem
          </a>
          <a
            href="#solution"
            className="inline-flex items-center border-b-2 border-transparent px-1 py-4 text-lg font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Solution
          </a>
          <a
            href="#stage"
            className="inline-flex items-center border-b-2 border-transparent px-1 py-4 text-lg font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Stage
          </a>
          <a
            href="#team"
            className="inline-flex items-center border-b-2 border-transparent px-1 py-4 text-lg font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Team
          </a>
          {businessData.investors && (
            <a
              href="#investors"
              className="inline-flex items-center border-b-2 border-transparent px-1 py-4 text-lg font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Investors
            </a>
          )}
        </nav>
      </div>

      <div className="mx-auto mt-8 w-[80%]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Main Content Section - Takes up 75% of the screen (3/4 of the 80%) */}
          <div className="prose max-w-none space-y-8 md:col-span-3">
            {/* Problem Section */}
            <section id="problem">
              <h2 className="text-2xl font-bold">Problem</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {businessData.problem ?? "No problem statement available."}
              </ReactMarkdown>
            </section>

            {/* Solution Section */}
            <section id="solution">
              <h2 className="text-2xl font-bold">Solution</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {businessData.solution ?? "No solution description available."}
              </ReactMarkdown>
            </section>

            {/* Stage Section */}
            <section id="stage">
              <h2 className="text-2xl font-bold">Stage</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {businessData.stage ?? "No stage information available."}
              </ReactMarkdown>
            </section>

            {/* Team Section */}
            <section id="team">
              <h2 className="text-2xl font-bold">Team</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {businessData.team ?? "No team information available."}
              </ReactMarkdown>
            </section>

            {/* Investors Section */}
            {businessData.investors && (
              <section id="investors">
                <h2 className="text-2xl font-bold">Investors</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {businessData.investors}
                </ReactMarkdown>
              </section>
            )}
          </div>
          {/* Company Details Section - Takes up 20% of the screen (1/4 of the 80%) */}
          <div className="sticky top-4 h-fit space-y-4">
            <h3 className="text-2xl font-bold">Company Details</h3>

            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-gray-600">Valuation</span>
                <span className="font-semibold">
                  ${businessData.valuation?.toLocaleString() ?? "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b py-2">
                <span className="text-gray-600">Allocation</span>
                <span className="font-semibold">
                  {businessData.allocation ?? "N/A"}%
                </span>
              </div>

              <div className="flex items-center justify-between border-b py-2">
                <span className="text-gray-600">Industry</span>
                <span className="font-semibold">
                  {businessData.industry ?? "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Website</span>
                <a
                  href={businessData.website ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Visit
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
