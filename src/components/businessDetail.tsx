"use server";
import { type business, type investment, type media } from "~/server/db/schema";
import Image from "next/image";
import Gallery from "~/components/carousel_with_thumbnail";
import Link from "next/link";
import {
  Dialog,
  DialogContentNoClose as DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { RequestDataroomButton } from "~/components/businessDetailDataroomRequestButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDayUntilDeadline } from "~/utils/util";

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
  const percentInvestment =
    (totalInvestemntAmount / businessData.target_fund!) * 100;
  const daysToGo = getDayUntilDeadline(businessData.deadline!);

  return (
    <div className="font-geist-sans my-10 flex flex-col">
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
            Target Fund
          </div>
          <div className="text-3xl font-bold md:text-4xl">
            ${businessData.target_fund!.toLocaleString()}
          </div>
          {allInvestment.length > 0 ? (
            <>
              <div className="text-[24px] font-bold md:text-[28px]">
                Fund Raised
              </div>
              <div className="text-3xl font-bold md:text-4xl">
                ${totalInvestemntAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 md:text-base">
                {`${percentInvestment}% raised of 100% of target fund.`}
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
              <Link href={`/create_investment/${businessData.businessID}`}>
                <button className="w-full rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-500">
                  Invest in {businessData.company}
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
          <div className="mt-2 text-center text-sm text-gray-500">
            {businessData.min_investment!.toLocaleString()}$ minimum investment
          </div>
        </div>
      </div>

      <div className="my-8 border-b border-gray-200">
        <nav
          className="mx-auto flex w-full max-w-[85%] justify-start gap-x-5"
          aria-label="Tabs"
          role="tablist"
          aria-orientation="horizontal"
        >
          <p className="self-centerhs-tab-active:font-semibold inline-flex items-center justify-start gap-x-2 border-b-2 border-transparent px-1 py-4 text-lg font-bold text-gray-500">
            Pitch
          </p>
        </nav>
      </div>

      <div className="mx-auto mt-8 max-w-[85%]">
        <div
          id="tabs-with-underline-1"
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-1"
        ></div>
      </div>
      <div
        className={"prose flex max-w-[85%] flex-col justify-start self-center"}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {businessData.pitch ?? "No pitch available."}
        </ReactMarkdown>
      </div>
    </div>
  );
}
