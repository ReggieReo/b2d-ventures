import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

export function TotalInvestmentCard() {
  return (
    <Card className="p-4">
      <CardHeader className="flex justify-between">
        <CardTitle>Total Investment</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">$45,231.89</p>
        <p className="text-sm text-green-500">+20.1% from last month</p>
      </CardContent>
    </Card>
  );
}

export function InvestmentGrowthCard() {
  return (
    <Card className="p-4">
      <CardHeader className="flex justify-between">
        <CardTitle>Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">+2350</p>
        <p className="text-sm text-green-500">+180.1% from last month</p>
      </CardContent>
    </Card>
  );
}
