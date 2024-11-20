"use server";
import {
  getAcceptBusinessesByKeyData,
  getAcceptedBusinesses,
} from "~/server/fetchQuery";
import Link from "next/link";
import BusinessCard from "~/components/business/business_card";
import SearchBusinessInput from "~/components/browsing/search_business_input";
import SearchBusinessFilter from "~/components/browsing/search_filter";
import { BrowsePagePagination } from "~/components/browsing/browse_page_pagination";
import SortingSelect from "~/components/browsing/sorting_select";

export default async function HomePage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    industry?: string;
    sortBy?: string;
    orderBy?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const industryParam = searchParams?.industry ?? "";
  const sortByParam = searchParams?.sortBy ?? "";
  const orderByParam = searchParams?.orderBy ?? "";
  const businessPerPage = 9;

  const industries = industryParam ? industryParam.split(",") : [];

  const business = await getAcceptBusinessesByKeyData(
    query,
    currentPage,
    businessPerPage,
    industries,
    sortByParam,
    orderByParam,
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
          <SortingSelect />
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
