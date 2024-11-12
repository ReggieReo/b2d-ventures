import { getPendingBusinesses } from "~/server/fetchQuery"
import BusinessTable from "~/components/business_table"
import { Business } from "~/components/business_table"

export default async function Fund(){
  const data = await getPendingBusinesses() as unknown as Business[];
  return (
    <BusinessTable data = {data} />
  )
}