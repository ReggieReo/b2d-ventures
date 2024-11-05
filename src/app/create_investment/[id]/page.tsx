"use server";

import React from "react";
import { getBusinessByID } from "~/server/fetchQuery";
import { InvestingForm } from "~/components/investment_form";
import { redirect } from "next/navigation";

export default async function InputForm({
  params,
}: {
  params: { id: number };
}) {
  const business = await getBusinessByID(params.id);

  if (!business) {
    redirect("/browse_business");
  }

  return <InvestingForm businessData={business} />;
}