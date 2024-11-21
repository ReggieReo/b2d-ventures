"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

import { fetchTotalInvestmentByMonthAction } from "~/server/action/investment_action";

export const description = "A multiple bar chart";

const chartConfig = {
  desktop: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface InvestmentData {
  month: string;
  totalInvestment: number;
}

export function InvestmentBarChart() {
  const [chartData, setChartData] = useState<InvestmentData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchTotalInvestmentByMonthAction();

        if (
          response &&
          response.status === 200 &&
          Array.isArray(response.totalInvestmentByMonth)
        ) {
          setChartData(response.totalInvestmentByMonth);
        } else {
          console.error(
            "Failed to fetch data or invalid data format:",
            response?.message,
          );
        }
      } catch (error) {
        console.error("Error fetching investment data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>January - December 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="totalInvestment"
              fill="var(--color-desktop)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
