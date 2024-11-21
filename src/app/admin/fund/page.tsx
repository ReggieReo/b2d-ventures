import BusinessTable from "~/components/business/business_table";
import { Business } from "~/components/business/business_table";
import { getPendingBusinesses } from "~/server/repository/business_repository";

export default async function Fund() {
  const data = (await getPendingBusinesses()) as unknown as Business[];
  return <BusinessTable data={data} />;
}
