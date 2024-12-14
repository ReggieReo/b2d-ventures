"use server";

import React from "react";
import { InvestingForm } from "~/components/investment/investment_form";
import { redirect } from "next/navigation";
import {
  getFinancialStatement,
  getLogoByBusinessID,
} from "~/server/repository/media_repository";
import { getBusinessByID } from "~/server/repository/business_repository";
import { getInvestmentByBusinessID } from "~/server/repository/investment_repository";

export default async function InputForm({
  params,
}: {
  params: { id: string};
}) {
  const business = await getBusinessByID(params.id);
  const logo = await getLogoByBusinessID(params.id);
  const financialStatement = await getFinancialStatement(params.id);
  const allInvestments = await getInvestmentByBusinessID(params.id);
  const currentTotalPurchased = allInvestments.reduce(
    (acc, curr) => acc + curr.fund,
    0,
  );

  if (!business) {
    redirect("/browse_business");
  }

  return (
    <InvestingForm
      businessData={business}
      logo={logo!}
      financialStatement={financialStatement}
      currentTotalPurchased={currentTotalPurchased}
    />
  );
}
