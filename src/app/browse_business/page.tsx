import Ip3Card from "~/components/ip3-card";
import { getAcceptedBusinesses } from "~/server/fetchQuery";
import Link from "next/link";
import BusinessCard from "~/components/business_card";

export default async function HomePage() {
  const business = await getAcceptedBusinesses();

  return (
    <main className={"mt-12 flex h-screen w-screen flex-col items-center"}>
      <div className={"mb-8 flex w-full max-w-5xl flex-col"}>
        <p className={"text-3xl font-bold"}>Explore Businesses </p>
        <p>Explore emerging investment opportunities on our platform.</p>
      </div>
      <div className="grid max-w-5xl grid-cols-1 items-stretch gap-10 md:grid-cols-2 lg:grid-cols-3">
        {business.map((b) => (
          <Link href={`/business/${b.businessID}`} key={b.businessID} className="h-full">
            <BusinessCard className={"h-full"} cBusiness={b} />
          </Link>
        ))}
      </div>
    </main>
  );
}
