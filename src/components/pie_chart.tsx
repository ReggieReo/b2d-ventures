"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

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

const industryColors = {
  tech: "#3B82F6",         // Soft blue
  health: "#0EA5E9",       // Muted cyan
  finance: "#14B8A6",      // Teal
  education: "#10B981",    // Soft green
  retail: "#22C55E",       // Lime green
  manufacturing: "#84CC16",// Olive green
  hospitality: "#A3E635",  // Yellow-green
  transport: "#FACC15",    // Soft amber
  real_estate: "#F59E0B",  // Golden orange
  energy: "#EF4444",       // Muted red
  food_beverage: "#DB2777",// Soft pink
  entertainment: "#D946EF",// Soft purple
  telecom: "#8B5CF6",      // Muted indigo
  construction: "#6366F1", // Muted blue-violet
  consulting: "#3B82F6",   // Slightly brighter blue
};

const chartConfig = {
  industry: {
    label: "Industries",
  },
  tech: {
    label: "Technology",
    color: industryColors.tech,
  },
  health: {
    label: "Healthcare",
    color: industryColors.health,
  },
  finance: {
    label: "Finance",
    color: industryColors.finance,
  },
  education: {
    label: "Education",
    color: industryColors.education,
  },
  retail: {
    label: "Retail",
    color: industryColors.retail,
  },
  manufacturing: {
    label: "Manufacturing",
    color: industryColors.manufacturing,
  },
  hospitality: {
    label: "Hospitality",
    color: industryColors.hospitality,
  },
  transport: {
    label: "Transportation",
    color: industryColors.transport,
  },
  real_estate: {
    label: "Real Estate",
    color: industryColors.real_estate,
  },
  energy: {
    label: "Energy",
    color: industryColors.energy,
  },
  food_beverage: {
    label: "Food & Beverage",
    color: industryColors.food_beverage,
  },
  entertainment: {
    label: "Entertainment",
    color: industryColors.entertainment,
  },
  telecom: {
    label: "Telecommunications",
    color: industryColors.telecom,
  },
  construction: {
    label: "Construction",
    color: industryColors.construction,
  },
  consulting: {
    label: "Consulting",
    color: industryColors.consulting,
  },
} satisfies ChartConfig;

export type InvestmentWithBusiness = {
  investmentID: number;
  businessID: number;
  userID: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  fund: number;
  industry: string;
  business: {
    businessID: number,
    company: string,
  } | null;
};

export function InvestorPortPieChart({
                                       allInvestment,
                                     }: {
  allInvestment: InvestmentWithBusiness[];
}) {

  const aggregatedData = allInvestment.reduce((acc, investment) => {
    if (acc[investment.industry]) {
      acc[investment.industry].fund += investment.fund;
    } else {
      acc[investment.industry] = {
        industry: investment.industry,
        fund: investment.fund,
        fill: industryColors[investment.industry as keyof typeof industryColors] || "#ffffff",
      };
    }
    return acc;
  }, {} as Record<string, { industry: string; fund: number; fill: string }>);

  const industryCount = Object.keys(
      allInvestment.reduce((acc, investment) => {
        acc[investment.industry] = true;
        return acc;
      }, {} as Record<string, boolean>)
  ).length;

  const chartData = Object.values(aggregatedData);

  return (
      <Card className={"justify-center md:w-1/2"}>
        <CardHeader className="items-left pb-0">
          <CardTitle>Investment Visualization</CardTitle>
          <CardDescription>
            A breakdown visualization of investment
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                  data={chartData}
                  dataKey="fund"
                  nameKey="industry"
                  innerRadius={60}
              >
                <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                            <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                              <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                              >
                                {industryCount.toLocaleString()}
                              </tspan>
                              <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy ?? 0) + 24}
                                  className="fill-muted-foreground"
                              >
                                Industry
                              </tspan>
                            </text>
                        )
                      }
                    }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
  );
}
