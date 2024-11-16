"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { fetchTotalInvestmentAction } from "~/server/action/total_invesment";

export function TotalInvestmentCard() {
  const [investment, setInvestment] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvestment() {
      try {
        const response = await fetchTotalInvestmentAction();
        if (response.status === 200) {
          setInvestment(Number(response.totalInvestment));
        } else {
          setError("Failed to load investment data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchInvestment();
  }, []);

  return (
    <Card className="p-4">
      <CardHeader className="flex justify-between">
        <CardTitle>Total Investment</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-lg">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-2xl font-bold">
            ${investment ? investment.toFixed(2) : "0.00"}
          </p>
        )}
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
