"use server";
import Image from "next/image";
import Link from "next/link";

import React from "react";
import { redirect } from "next/navigation";
import Gallery from "~/components/ui/carousel_with_thumbnail";
import { auth } from "@clerk/nextjs/server";
import { RequestDataroomStatusEnum } from "~/utils/enum/requestDataroomStatusEnum";
import { BusinessDetail } from "~/components/business/businessDetail";
import {
  getImageByBusinessID,
  getLogoByBusinessID,
} from "~/server/repository/media_repository";
import { getBusinessByID } from "~/server/repository/business_repository";
import { getInvestmentByBusinessID } from "~/server/repository/investment_repository";
import { getRequestByBusinessID } from "~/server/repository/dataroom_request_repository";

async function getRequestStatus(business: string, curUserID?: string) {
  if (!curUserID) {
    return RequestDataroomStatusEnum.NoUsers;
  }
  const requestStatus = await getRequestByBusinessID(business);
  if (!requestStatus) {
    return RequestDataroomStatusEnum.NoRequest;
  }
  return requestStatus.requestStatus;
}

export default async function Page({ params }: { params: { id: string} }) {
  const business = await getBusinessByID(params.id);
  if (!business) {
    redirect("/browse_business");
  }
  const curUserID = auth().userId;
  let initialStatus;
  if (curUserID) {
    initialStatus = await getRequestStatus(business.businessID, curUserID);
  } else {
    initialStatus = await getRequestStatus(business.businessID);
  }
  const investment = await getInvestmentByBusinessID(business.businessID);
  const media = await getImageByBusinessID(business.businessID);
  const logo = await getLogoByBusinessID(business.businessID);

  return (
    <BusinessDetail
      businessData={business}
      allInvestment={investment}
      initialRequestStatus={initialStatus}
      allImage={media}
      logo={logo!}
    />
  );
}
