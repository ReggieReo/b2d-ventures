import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

export function RecentInvestments() {
  const investments = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: "+$1,999.00",
      seed: "Olivia Martin",
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: "+$1,999.00",
      seed: "Jackson Lee",
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: "+$39.00",
      seed: "Isabella Nguyen",
    },
    {
      name: "William Kim",
      email: "will@email.com",
      amount: "+$299.00",
      seed: "William Kim",
    },
    {
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      amount: "+$39.00",
      seed: "Sofia Davis",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Investments</CardTitle>
        <CardDescription>You made 265 investments this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {investments.map((investment, index) => (
            <li
              key={index}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(investment.seed)}`}
                  alt={investment.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium leading-none">
                    {investment.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {investment.email}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-green-500">
                {investment.amount}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
