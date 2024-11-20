import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { getTotalInvestmentCurrentMonth, getTotalInvestmentCurrentWeek } from "~/server/fetchQuery";

export async function TotalInvestmentCard() {
  try {
    const totalInvestment = await getTotalInvestmentCurrentMonth();

    return (
      <Card className="p-4">
        <CardHeader className="flex justify-between">
          <CardTitle>Investment in the current month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${totalInvestment !== null ? totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
          </p>
        </CardContent>
      </Card>
    );
  } catch {
    return (
      <Card className="p-4">
        <CardHeader className="flex justify-between">
          <CardTitle>Investment in the current month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">An error occurred while fetching data</p>
        </CardContent>
      </Card>
    );
  }
}

export async function InvestmentWeekCard() {
  try {
    const totalInvestment = await getTotalInvestmentCurrentWeek();

    return (
      <Card className="p-4">
        <CardHeader className="flex justify-between">
          <CardTitle>Investment in the current Week</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${totalInvestment !== null ? totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
          </p>
        </CardContent>
      </Card>
    );
  } catch {
    return (
      <Card className="p-4">
        <CardHeader className="flex justify-between">
          <CardTitle>Investment in the current Week</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">An error occurred while fetching data</p>
        </CardContent>
      </Card>
    );
  }
}
