"use server";

import React from "react";
import {
  getBusinessByID,
  getLogoByBusinessID,
  getFinancialStatement,
  getInvestmentByBusinessID,
} from "~/server/fetchQuery";
import { InvestingForm } from "~/components/investment/investment_form";
import { redirect } from "next/navigation";

export default async function InputForm({
  params,
}: {
  params: { id: number };
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
