import Ip3Card from "~/components/ip3-card";

import { getAllBusiness } from "~/server/fetchQuery";
import Link from "next/link";
import BusinessCard from "~/components/business_card";

export default async function HomePage() {
  const business = await getAllBusiness();
  return (
    <main className={"mt-12 flex h-screen w-screen flex-col items-center"}>
      <div className={"mb-8 flex w-full max-w-5xl flex-col"}>
        <p className={"text-3xl font-bold"}>Explore Businesses </p>
        <p>Explore emerging investment opportunities on our platform.</p>
      </div>
      <div className="grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2 lg:grid-cols-3">
        <Link href={"business/1"}>
          <Ip3Card />
        </Link>
        {business.map((b) => (
          <BusinessCard className={"h-full"} cBusiness={b} key={b.businessID} />
        ))}
      </div>
    </main>
  );
}
