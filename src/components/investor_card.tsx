"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { fetchRecentInvestmentsInCurrentWeekAction } from "~/server/action/recent_investment";

// Define the type for the investment data
interface Investment {
  name: string;
  fund: number;
  createdAt: string;
  businessName: string;
}

export function RecentInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchRecentInvestmentsInCurrentWeekAction();
        if (response.status === 200) {
          console.log("Recent investments data:", response.recentInvestments);
          setInvestments(response.recentInvestments);
        } else {
          console.error("Failed to fetch investments");
        }
      } catch (error) {
        console.error("Error fetching recent investments:", error);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Investments</CardTitle>
        <CardDescription>
          You made {investments.length} investments this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {investments.length > 0 ? (
          <ul className="space-y-4">
            {investments.map((investment, index) => (
              <li
                key={index}
                className="flex flex-col border-b border-gray-200 py-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-gray-900">{investment.name}</p>
                    <p className="text-gray-500">{formatDate(investment.createdAt)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-900 font-bold">{investment.businessName}</p>
                  <p className="text-green-600 font-bold">
                    +${investment.fund.toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent investments available</p>
        )}
      </CardContent>
    </Card>
  );
}
