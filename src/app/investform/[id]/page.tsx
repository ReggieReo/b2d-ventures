"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useEffect } from "react";

import { toast } from "~/components/hooks/use-toast";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContentNoClose as DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isCreditCard } from "validator";
import { createInvestment } from "~/server/action/create_investment";

function DialogCountdown() {
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
      // Redirect to the portfolio page when countdown reaches 0
      router.push("/investor_portfolio");
    }
    return () => clearTimeout(timer);
  }, [countdown, router, startCountdown]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="submit"
          className="mt-6 w-full bg-blue-500 py-3 text-lg font-semibold text-white hover:bg-blue-600"
          onClick={handleConfirmInvestment}
        >
          Confirm investment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Investing request has been sent.</DialogTitle>
          <DialogDescription>
            Redirecting you to your portfolio in {countdown} seconds.
            <Link href="/investor_portfolio">
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

const minInvestment = 10;

const FormSchema = z.object({
  name: z.string(),
  terms: z.boolean().refine((value) => value, {
    message: "You must accept the terms of investment.",
  }),
  cardNumber: z.string(),
  expirationDate: z.string(),
  cvv: z.string(),
  amount: z.number().min(1000), // pull from the business database
});

export default function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      terms: false,
    },
  });

  const { watch } = form;
  const watchTerms = watch("terms");

  const createInvestmentBind = createInvestment.bind(null);

  return (
    <div className="font-geist-sans mx-auto max-w-lg pb-20">
      {" "}
      {/* Added padding bottom */}
      <div className="my-6 flex flex-row items-center justify-center gap-2">
        <img
          src="https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg"
          alt="B2D Ventures Logo"
          className="h-[60px] w-[60px]"
        />
        <h1 className="text-4xl font-bold">Invest in Rento</h1>
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
                      placeholder="min $1000"
                      className="p-4 text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="mt-2 text-sm">
                    You are investing as Myself / individual change.
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="mt-8">
              <h2 className="text-lg font-bold">Payment information</h2>

              <div className="mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Card number"
                    className="flex-1 p-3 text-lg"
                  />
                  <Input placeholder="ZIP code" className="w-1/3 p-3 text-lg" />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Republic does not process nor save your credit card
                  information.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">Terms</h2>
              <div className="mt-4 space-y-2 rounded-md bg-gray-100 p-4 text-sm text-gray-700">
                <p>
                  I understand that I can cancel my investment up until 10/30/24
                  (48 hours prior to the deal deadline).
                </p>
                <p>
                  I understand that Republic will receive a cash and securities
                  commission as further detailed in the offering documents.
                </p>
                <p>
                  I understand that investing this amount into several deals
                  would better diversify my risk.
                </p>
                <p>
                  I consent to electronic delivery of all documents, notices and
                  agreements as related to my investment.
                </p>
                <p>
                  I understand my investment won&apost be transferable for 12
                  months and may not have a market for resale.
                </p>
                <p>
                  I have read the educational materials and agree to the Terms
                  of Service, including arbitration provisions.
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
                  <FormLabel htmlFor="terms">
                    I have read and accept the terms of investment
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogCountdown />
          </form>
        </Form>
      </div>
    </div>
  );
}
