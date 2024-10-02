"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";

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

const FormSchema = z.object({
  username: z.string(),
  terms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms of investment.",
  }),
});

export default function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      terms: false,
    },
  });

  const [selectedTab, setSelectedTab] = useState("bank");

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="font-geist-sans mx-auto max-w-lg pb-20"> {/* Added padding bottom */}
      <div className="my-6 flex flex-row justify-center gap-2 items-center">
        <img
          src="https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg"
          alt="B2D Ventures Logo"
          className="h-[60px] w-[60px]"
        />
        <h1 className="text-4xl font-bold">Invest in Rento</h1>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold">Investment amount</h2>
        <p className="text-sm text-gray-600 mb-4">Payments are processed immediately.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="min $1000" className="text-lg p-4" {...field} />
                  </FormControl>
                  <FormDescription className="mt-2 text-sm">
                    You are investing as Myself / individual change.
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="mt-8">
              <h2 className="text-lg font-bold">Payment information</h2>
              <div className="flex border-b mt-4">
                <button
                  className={`px-4 py-2 font-semibold ${
                    selectedTab === "bank" ? "border-b-2 border-black" : ""
                  }`}
                  onClick={() => setSelectedTab("bank")}
                >
                  Bank
                </button>
                <button
                  className={`px-4 py-2 font-semibold ${
                    selectedTab === "card" ? "border-b-2 border-black" : ""
                  }`}
                  onClick={() => setSelectedTab("card")}
                >
                  Card
                </button>
              </div>

              {selectedTab === "card" && (
                <div className="mt-4">
                  <div className="flex gap-2">
                    <Input placeholder="Card number" className="flex-1 text-lg p-3" />
                    <Input placeholder="ZIP code" className="w-1/3 text-lg p-3" />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Republic does not process nor save your credit card information.
                  </p>
                </div>
              )}

              {selectedTab === "bank" && (
                <div className="mt-4">
                  <p>Pay using a United States bank account:</p>
                  <Button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white">
                    Select bank account
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">Terms</h2>
              <div className="mt-4 bg-gray-100 rounded-md p-4 space-y-2 text-sm text-gray-700">
                <p>I understand that I can cancel my investment up until 10/30/24 (48 hours prior to the deal deadline).</p>
                <p>I understand that Republic will receive a cash and securities commission as further detailed in the offering documents.</p>
                <p>I understand that investing this amount into several deals would better diversify my risk.</p>
                <p>I consent to electronic delivery of all documents, notices and agreements as related to my investment.</p>
                <p>I understand my investment won't be transferable for 12 months and may not have a market for resale.</p>
                <p>I have read the educational materials and agree to the Terms of Service, including arbitration provisions.</p>
                <p>I understand this investment is risky and that I shouldn't invest unless I can afford to lose all invested funds.</p>
                <p>I understand I am responsible for all fees and charges associated with the use of my payment method.</p>
                <p>I confirm that this investment, together with all my other Regulation Crowdfunding investments during the past 12 months on any crowdfunding portal, does not exceed my investment limit.</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 mt-4">
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

            <Button
              type="submit"
              className="mt-6 w-full py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"
            >
              Confirm investment
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
