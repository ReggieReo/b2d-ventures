import {
  getBannerByBusinessID,
  getImageByBusinessID,
  getLogoByBusinessID,
} from "~/server/repository/media_repository";

("use server-only");

import Image from "next/image";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { type business } from "~/server/db/schema";
import { cn } from "~/lib/utils";
import { getDayUntilDeadline, calculateStockPrice } from "~/utils/util";
import { getInvestmentByBusinessID } from "~/server/repository/investment_repository";

export default async function BusinessCard({
  cBusiness,
  className,
}: {
  cBusiness: typeof business.$inferSelect;
  className?: string;
}) {
  const allInvestment = await getInvestmentByBusinessID(cBusiness.businessID);
  const logo = await getLogoByBusinessID(cBusiness.businessID);
  const banner = await getBannerByBusinessID(cBusiness.businessID);

  const totalStocks = allInvestment.reduce((acc, cur) => acc + cur.fund, 0);
  const remainingStocks = Math.max(0, cBusiness.target_stock! - totalStocks);
  const stockPrice = calculateStockPrice(
    cBusiness.valuation!,
    cBusiness.target_stock!,
    cBusiness.allocation!,
  );
  const totalRaise = totalStocks * stockPrice;
  const percentInvestment = (totalStocks / cBusiness.target_stock!) * 100;
  const dayTillDeadline = getDayUntilDeadline(cBusiness.deadline!);
  const countInvestment = allInvestment.length;

  return (
    <Card className={cn("relative w-full min-w-40 max-w-md", className)}>
      <CardHeader className="border-b">
        <div className="relative h-32 w-full">
          <Image
            src={banner?.url ?? ""}
            alt="IP3 Banner"
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
      </CardHeader>
      <div className="absolute left-4 top-[168px] h-16 w-16 -translate-y-1/2 overflow-hidden rounded-lg border-4 border-white bg-white shadow-lg">
        <Image
          src={logo?.url ?? ""}
          alt="IP3 Logo"
          width={64}
          height={64}
          layout="responsive"
        />
      </div>

      <CardContent className="content-start p-4 pt-6">
        <h2 className="mb-2 text-2xl font-bold">{cBusiness.company}</h2>
        <p className="mb-4 text-gray-600">{cBusiness.slogan}</p>

        <div className="space-y-2">
          <div className="flex flex-row items-center gap-1">
            <p className="font-bold">
              $
              {totalRaise.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>raised</p>
            <p className="ml-1 text-sm text-gray-500">
              ({percentInvestment.toFixed(1)}% of target)
            </p>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-600"
              style={{ width: `${Math.min(percentInvestment, 100)}%` }}
            />
          </div>

          <div className="flex flex-row gap-1">
            <p className="font-bold">
              $
              {stockPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>per share</p>
          </div>

          <div className="flex flex-row gap-1">
            <p className="font-bold">{totalStocks.toLocaleString()}</p>
            <p>shares purchased</p>
          </div>

          <div className="flex flex-row gap-1">
            <p className="font-bold">{countInvestment}</p>
            <p>investors</p>
          </div>

          <div className="flex flex-row gap-1">
            <p className="font-bold">{remainingStocks.toLocaleString()}</p>
            <p>shares remaining</p>
          </div>

          <div className="flex flex-row gap-1">
            <p className="font-bold">{dayTillDeadline}</p>
            <p>days till deadline</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{cBusiness.industry!.toUpperCase()}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
