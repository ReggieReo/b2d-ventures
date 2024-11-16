"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { fetchTotalInvestmentAction } from "~/server/action/total_invesment";
import { fetchTotalInvestmentCurrentWeekAction } from "~/server/action/investment_in_week";

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
        <CardTitle>Investment in the current month</CardTitle>
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

export function InvestmentWeekCard() {
  const [investment, setInvestment] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvestment() {
      try {
        const response = await fetchTotalInvestmentCurrentWeekAction();
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
        <CardTitle>Investment in the current Week</CardTitle>
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
