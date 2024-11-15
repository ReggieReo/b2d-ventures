import {
  getAcceptBusinessesByName,
  getAcceptedBusinesses,
} from "~/server/fetchQuery";
import Link from "next/link";
import BusinessCard from "~/components/business_card";
import SearchBusinessInput from "~/components/search_business_input";
import SearchBusinessFilter from "~/components/search_filter";
import { BrowsePagePagination } from "~/components/browsePagePagination";

export default async function HomePage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const businessPerPage = 3;

  const business = await getAcceptBusinessesByName(
    query,
    currentPage,
    businessPerPage,
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
      <div
        className={
          "mb-8 flex w-full max-w-5xl flex-col items-start gap-2 lg:flex-row"
        }
      >
        <SearchBusinessInput />
        <SearchBusinessFilter />
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
