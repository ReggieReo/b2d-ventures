import { getAllBusiness } from "~/server/fetchQuery"
import BusinessTable from "~/components/business_table"
import {CampaignData} from "~/models/fund";
export default async function Fund(){
  const data = await getAllBusiness() as unknown as CampaignData[];

  return (
    <BusinessTable data = {data} />
  )
}