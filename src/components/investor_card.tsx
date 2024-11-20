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
import { investment } from '~/server/db/schema';
import { calculateStockPrice } from '~/utils/util';

// Define the type for the investment data
interface Investment {
  name: string | null;
  fund: number;
  createdAt: Date;
  allocation: number; 
  valuation: number;
  businessName: string | null;
}

export function RecentInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchRecentInvestmentsInCurrentWeekAction();
        if (response.status === 200) {
          console.log("Recent investments data:", response.recentInvestments);
          setInvestments(response.recentInvestments as Investment[]);
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
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const totalPages = Math.ceil(investments.length / itemsPerPage);
  const paginatedInvestments = investments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
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
        {paginatedInvestments.length > 0 ? (
          <ul className="space-y-4">
            {paginatedInvestments.map((investment, index) => (
              <li
                key={index}
                className="flex flex-col border-b border-gray-200 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-gray-900">{investment.name}</p>
                    <p className="text-gray-500">
                      {formatDate(investment.createdAt.toLocaleString())}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-bold text-gray-900">
                    {investment.businessName}
                  </p>
                  <p className="font-bold text-green-600">
                    +${calculateStockPrice(investment.valuation, investment.allocation, investment.fund).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent investments available</p>
        )}
      </CardContent>
      <div className="mt-4 flex items-center justify-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`mr-4 rounded-md bg-white-300 border border-gray-300 px-3 py-1 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-400"}`}
        >
          Previous
        </button>
        <span className="text-sm font-bold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`ml-4 rounded-md bg-white-300 border border-gray-300 px-3 py-1 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-gray-400"}`}
        >
          Next
        </button>
      </div>
    </Card>
  );
}
