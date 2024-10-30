"use server";
import Image from "next/image";
import Link from "next/link";

import React from "react";
import { getBusinessByID } from "~/server/fetchQuery";
import { redirect } from "next/navigation";
import {BusinessDetail} from "~/components/businessDetail";


export default async function Page({ params }: { params: { id: number } }) {
  const business = await getBusinessByID(params.id);
  if (!business) {
    redirect("/browse_business");
  }

  return (
      <BusinessDetail businessData={business} />
  );
}
