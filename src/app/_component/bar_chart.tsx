"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"

export const description = "A multiple bar chart"

const chartData = [
  { month: "Jan", total: 500 },
  { month: "Feb", total: 305},
  { month: "Mar", total: 237},
  { month: "Apr", total: 73},
  { month: "May", total: 209},
  { month: "Jun", total: 250},
  { month: "Jul", total: 314},
  { month: "Aug", total: 424},
  { month: "Sep", total: 74},
  { month: "Oct", total: 150},
  { month: "Nov", total: 555},
  { month: "Dec", total: 378},
]

const chartConfig = {
  desktop: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function InvestmentBarChart() {
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
            <Bar dataKey="total" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
