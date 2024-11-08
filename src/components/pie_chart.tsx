"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "~/components/ui/chart";

const industryColors = {
  tech: "hsl(var(--chart-1))",
  health: "hsl(var(--chart-2))",
  finance: "hsl(var(--chart-3))",
  education: "hsl(var(--chart-4))",
  retail: "hsl(var(--chart-5))",
  manufacturing: "hsl(var(--chart-6))",
  hospitality: "hsl(var(--chart-7))",
  transport: "hsl(var(--chart-8))",
  real_estate: "hsl(var(--chart-9))",
  energy: "hsl(var(--chart-10))",
  food_beverage: "hsl(var(--chart-11))",
  entertainment: "hsl(var(--chart-12))",
  telecom: "hsl(var(--chart-1))",
  construction: "hsl(var(--chart-2))",
  consulting: "hsl(var(--chart-3))",
};


const chartConfig = {
  industry: {
    label: "Industries",
  },tech: {
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
    businessID: number, // Changed from string to number to match schema
    company: string,
  } | null;
};

export function InvestorPortPieChart({
  allInvestment,
}: {
  allInvestment: InvestmentWithBusiness[];
}) {


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
              data={allInvestment}
              dataKey="fund"
              nameKey="industry"
              innerRadius={60}
              strokeWidth={5}
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
                          {/*{totalVisitors.toLocaleString()}*/}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
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
