"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { fetchMostRecentInvestmentAction } from "~/server/action/recent_investment";

interface InvestmentData {
  userName: string;
  amount: number;
  date: string;
}

export function RecentInvestments() {
  const [investment, setInvestment] = useState<InvestmentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const response = await fetchMostRecentInvestmentAction();
        if (response.status === 200) {
          setInvestment(response.mostRecentInvestment);
        } else {
          setError("Failed to fetch recent investments");
        }
      } catch (e) {
        setError("An error occurred while fetching data");
      }
    };

    fetchInvestment();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Investments</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {investment && (
          <div>
            <p>Investment Name: {investment.userName}</p>
            <p>Amount: ${investment.amount}</p>
            <p>Date: {new Date(investment.date).toLocaleDateString()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
