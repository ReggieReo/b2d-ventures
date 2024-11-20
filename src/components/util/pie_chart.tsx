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
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
} from "~/components/ui/chart";
import { calculateStockPrice } from "~/utils/util";

const industryColors = {
  tech: "#3B82F6", // Soft blue
  health: "#0EA5E9", // Muted cyan
  finance: "#14B8A6", // Teal
  education: "#10B981", // Soft green
  retail: "#22C55E", // Lime green
  manufacturing: "#84CC16", // Olive green
  hospitality: "#A3E635", // Yellow-green
  transport: "#FACC15", // Soft amber
  real_estate: "#F59E0B", // Golden orange
  energy: "#EF4444", // Muted red
  food_beverage: "#DB2777", // Soft pink
  entertainment: "#D946EF", // Soft purple
  telecom: "#8B5CF6", // Muted indigo
  construction: "#6366F1", // Muted blue-violet
  consulting: "#3B82F6", // Slightly brighter blue
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
    businessID: number;
    company: string;
    valuation?: number;
    target_stock?: number;
    allocation?: number;
  } | null;
};

export function InvestorPortPieChart({
  allInvestment,
}: {
  allInvestment: InvestmentWithBusiness[];
}) {
  if (!allInvestment || allInvestment.length === 0) {
    return (
      <Card className={"justify-center md:w-1/2"}>
        <CardHeader className="items-left pb-0">
          <CardTitle>Investment Visualization</CardTitle>
        </CardHeader>
        <CardContent className="mt-8 flex-1 pb-0 text-center text-muted-foreground">
          Your investment visualization will appear here once you make your
          first investment
        </CardContent>
      </Card>
    );
  }

  const aggregatedData = allInvestment.reduce(
    (acc, investment) => {
      const investmentValue =
        investment.business?.valuation &&
        investment.business?.target_stock &&
        investment.business?.allocation
          ? calculateStockPrice(
              investment.business.valuation,
              investment.business.target_stock,
              investment.business.allocation,
            ) * investment.fund
          : 0;

      if (acc[investment.industry]) {
        acc[investment.industry]!.value += investmentValue;
      } else {
        acc[investment.industry] = {
          industry: investment.industry,
          value: investmentValue,
          fill:
            industryColors[
              investment.industry as keyof typeof industryColors
            ] || "#ffffff",
        };
      }
      return acc;
    },
    {} as Record<string, { industry: string; value: number; fill: string }>,
  );

  const industryCount = Object.keys(aggregatedData).length;
  const chartData = Object.values(aggregatedData);

  return (
    <Card className={"justify-center md:w-1/2"}>
      <CardHeader className="items-left pb-0">
        <CardTitle>Investment Visualization</CardTitle>
        <CardDescription>
          A breakdown visualization of portfolio value by industry
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
              content={({ payload }) => {
                if (payload?.[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Industry
                          </span>
                          <span className="font-bold">
                            {chartConfig[
                              data.industry as keyof typeof chartConfig
                            ]?.label || data.industry}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Value
                          </span>
                          <span className="font-bold">
                            $
                            {data.value.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
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
                          {industryCount}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Industries
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
