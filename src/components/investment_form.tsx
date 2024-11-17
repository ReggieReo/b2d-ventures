"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContentNoClose as DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { createInvestment } from "~/server/action/create_investment";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { media, type business } from "~/server/db/schema";
import { getInvestmentSchema } from "~/app/create_investment/schema";

function DialogCountdown({ isFormValid }: { isFormValid: boolean }) {
  const [countdown, setCountdown] = useState(3);
  const [startCountdown, setStartCountdown] = useState(false);

  const handleConfirmInvestment = () => {
    setStartCountdown(true);
  };

  const router = useRouter();
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startCountdown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      router.push("/investment_portfolio");
    }
    return () => clearTimeout(timer);
  }, [countdown, router, startCountdown]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="submit"
          className="mt-6 w-full bg-blue-500 py-3 text-lg font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleConfirmInvestment}
          disabled={!isFormValid}
        >
          Confirm investment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Investing request has been sent.</DialogTitle>
          <DialogDescription>
            Redirecting you to your portfolio in {countdown} seconds.
            <Link href="/startup_dashboard">
              <Button className="mt-6 w-full bg-blue-500 py-3 text-lg font-semibold text-white hover:bg-blue-600">
                Go to your portfolio
              </Button>
            </Link>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function InvestingForm({
  businessData,
  financialStatement,
  logo,
}: {
  businessData: typeof business.$inferSelect;
  financialStatement?: typeof media.$inferSelect;
  logo: typeof media.$inferSelect;
}) {


  if (!financialStatement || financialStatement.status !== 1) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Financial Statement Required</h2>
        <p className="text-gray-600 mb-4">
          {!financialStatement 
            ? "Before you can invest, please upload your financial statement in your investment portfolio."
            : "Your financial statement is pending approval from our administrators. Please check back later."}
        </p>
        <Link href="/investment_portfolio">
          <Button className="w-full">Go to Investment Portfolio</Button>
        </Link>
      </div>
    );
  }

  const createInvestmentBind = createInvestment.bind(
    null,
    businessData.businessID,
  );

  const FormSchema = getInvestmentSchema(businessData.min_investment!);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      terms: false,
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      amount: businessData.min_investment!,
    },
    mode: "onBlur",
  });

  const isFormValid = form.formState.isValid && form.watch("terms");

  return (
    <div className="font-geist-sans mx-auto max-w-lg pb-20">
      <div className="my-6 flex flex-row items-center justify-center gap-2">
        <img
          src={logo?.url ?? ""}
          alt="B2D Ventures Logo"
          className="h-[60px] w-[60px]"
        />
        <h1 className="text-4xl font-bold">Invest in {businessData.company}</h1>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-bold">Investment amount</h2>
        <p className="mb-4 text-sm text-gray-600">
          Payments are processed immediately.
        </p>
        <Form {...form}>
          <form action={createInvestmentBind} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={`Minimum investment ${businessData.min_investment!.toLocaleString()} $`}
                      className="p-4 text-lg"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.valueAsNumber))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-8">
              <h2 className="text-lg font-bold">Payment information</h2>

              <div className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Card number"
                          className="p-3 text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="MM/YY"
                            className="p-3 text-lg"
                            {...field}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value.length === 2 && !value.includes("/")) {
                                value += "/";
                              }
                              field.onChange(value);
                            }}
                            maxLength={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormControl>
                          <Input
                            placeholder="CVV"
                            className="p-3 text-lg"
                            type="password"
                            maxLength={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Terms</h2>
              <div className="mt-4 space-y-2 rounded-md bg-gray-100 p-4 text-sm text-gray-700">
                <p>
                  I understand that investing this amount into several deals
                  would better diversify my risk.
                </p>
                <p>
                  I consent to electronic delivery of all documents, notices and
                  agreements as related to my investment.
                </p>
                <p>
                  I understand my investment won't be transferable for 12
                  months and may not have a market for resale.
                </p>
                <p>
                  I understand this investment is risky and that I shouldn&apost
                  invest unless I can afford to lose all invested funds.
                </p>
                <p>
                  I understand I am responsible for all fees and charges
                  associated with the use of my payment method.
                </p>
                <p>
                  I confirm that this investment, together with all my other
                  Regulation Crowdfunding investments during the past 12 months
                  on any crowdfunding portal, does not exceed my investment
                  limit.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="mt-4 flex items-center space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="terms"
                    />
                  </FormControl>
                  <FormLabel>
                    I have read and accept the terms of investment
                  </FormLabel>
                </FormItem>
              )}
            />
            <DialogCountdown isFormValid={isFormValid} />
          </form>
        </Form>
      </div>
    </div>
  );
}
