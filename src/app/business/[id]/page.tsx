"use server";
import Image from "next/image";
import Link from "next/link";

import React from "react";
import { getRequest, getBusinessByID } from "~/server/fetchQuery";
import { redirect } from "next/navigation";
import { BusinessDetail } from "~/components/businessDetail";
import { auth } from "@clerk/nextjs/server";
import { RequestDataroomStatusEnum } from "~/utils/enum/requestDataroomStatusEnum";

async function getRequestStatus(business: number, curUserID?: string) {
  if (!curUserID) {
    return RequestDataroomStatusEnum.NoUsers;
  }
  const requestStatus = await getRequest(business);
  if (!requestStatus) {
    return RequestDataroomStatusEnum.NoRequest;
  }
  return requestStatus.requestStatus;
}

export default async function Page({ params }: { params: { id: number } }) {
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

  return (
    <BusinessDetail
      businessData={business}
      initialRequestStatus={initialStatus}
    />
  );
}
