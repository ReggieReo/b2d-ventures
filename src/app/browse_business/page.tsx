"use server";
import {
  getAcceptBusinessesByKeyData,
  getAcceptedBusinesses,
  getBusinessByIndustries,
} from "~/server/fetchQuery";
import Link from "next/link";
import BusinessCard from "~/components/business_card";
import SearchBusinessInput from "~/components/search_business_input";
import SearchBusinessFilter from "~/components/search_filter";
import { BrowsePagePagination } from "~/components/browsePagePagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default async function HomePage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    industry?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const industryParam = searchParams?.industry ?? "";
  const businessPerPage = 9;

  const industries = industryParam ? industryParam.split(",") : [];

  const business = await getAcceptBusinessesByKeyData(
    query,
    currentPage,
    businessPerPage,
    industries,
  );

  const listBusiness = await getAcceptedBusinesses();
  let totalBusiness = listBusiness.length;
  if (query !== "") {
    totalBusiness = business.length;
  }

  const totalPages = Math.ceil(totalBusiness / businessPerPage);

  return (
    <main className={"mt-12 flex h-screen w-screen flex-col items-center"}>
      <div className={"mb-4 flex w-full max-w-5xl flex-col"}>
        <p className={"text-3xl font-bold"}>Explore Businesses </p>
        <p>Explore emerging investment opportunities on our platform.</p>
      </div>
      <div className={"mb-8 flex w-full max-w-5xl flex-col items-start gap-2"}>
        <SearchBusinessInput />
        <div className={"flex flex-row gap-x-5"}>
          <SearchBusinessFilter />
          <div className={"flex flex-row gap-x-2"}>
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="most_recent">Created</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="no_investor">Number of Investor</SelectItem>
              <SelectItem value="anount_invest">Amount Invested</SelectItem>
              <SelectItem value="remaining stocks">Remaining Stocks</SelectItem>
              <SelectItem value="min_invest">Minimum Investment</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
          </div>
        </div>
      </div>
      <div className="grid max-w-5xl grid-cols-1 items-stretch gap-10 md:grid-cols-2 lg:grid-cols-3">
        {business.map((b) => (
          <Link
            href={`/business/${b.businessID}`}
            key={b.businessID}
            className="h-full"
          >
            <BusinessCard className={"h-full"} cBusiness={b} />
          </Link>
        ))}
      </div>
      <BrowsePagePagination totalPages={totalPages} />
    </main>
  );
}
