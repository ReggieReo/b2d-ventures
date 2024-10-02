"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContentNoClose as DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import Link from "next/link";

const industries = [
  { label: "Technology", value: "tech" },
  { label: "Healthcare", value: "health" },
  { label: "Finance", value: "finance" },
  { label: "Education", value: "education" },
  { label: "Retail", value: "retail" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Transportation", value: "transport" },
  { label: "Real Estate", value: "real_estate" },
  { label: "Energy", value: "energy" },
  { label: "Food & Beverage", value: "food_beverage" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Telecommunications", value: "telecom" },
  { label: "Construction", value: "construction" },
  { label: "Consulting", value: "consulting" },
] as const;

const formSchema = z.object({
  company: z
    .string({
      required_error: "Please enter your company name.",
    })
    .min(2)
    .max(50),
  title: z
    .string({
      required_error: "Please enter your business title.",
    })
    .min(2)
    .max(50),
  website: z
    .string({
      required_error: "Please enter your company's website.",
    })
    .url(),
  target_fund: z.coerce.number({
    required_error: "Please enter the target fund.",
  }),
  industry: z.string({
    required_error: "Please select the industry.",
  }),
  min_investment: z.coerce.number({
    required_error: "Please enter the minimum investment.",
  }),
  allocation: z.coerce.number({
    required_error: "Please enter the allocation.",
  }),
  valuation: z.coerce.number({
    required_error: "Please enter the valuation.",
  }),
  deadline: z.coerce.date({
    required_error: "Please select a date and time",
  }),
});

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
      router.push("/browse_buisiness");
    }
    return () => clearTimeout(timer);
  }, [countdown, startCountdown]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="submit" onClick={handleConfirmInvestment}>
          Submit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Fundraising Information has been saved.
          </DialogTitle>
          <DialogDescription>
            Redirecting you to business browsing page in {countdown} seconds.
            <Link href="/browse_buisiness">
              <Button className="mt-6 w-full bg-blue-500 py-3 text-lg font-semibold text-white hover:bg-blue-600">
                Go to business browsing page
              </Button>
            </Link>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default function CreateFundraising() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      title: "",
      website: "",
      industry: "",
    },
  });

  const [date, setDate] = useState<Date | undefined>(undefined);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    //  This will be type-safe and validated.
    console.log(values);
  }

  return (
    <main className="justify-left items-left mb-4 ml-4 mt-4 flex min-h-screen flex-col">
      <a className={"mb-4 text-4xl font-bold"}>
        Start the Fundraising Campaign
      </a>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Company Name" {...field} />
                </FormControl>
                <FormDescription>
                  We want to get to know more about your business
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your title</FormLabel>
                <FormControl>
                  <Input placeholder="CTO" {...field} />
                </FormControl>
                <FormDescription>
                  What position are you working in this business
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://b2dventures.com" {...field} />
                </FormControl>
                <FormDescription>
                  How can we know more about you
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Industry</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? industries.find(
                              (industry) => industry.value === field.value,
                            )?.label
                          : "Select Industry"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search Industry..." />
                      <CommandList>
                        <CommandEmpty>No Industry found.</CommandEmpty>
                        <CommandGroup>
                          {industries.map((industry) => (
                            <CommandItem
                              value={industry.label}
                              key={industry.value}
                              onSelect={() => {
                                form.setValue("industry", industry.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  industry.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {industry.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Which industry is best described your company
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="target_fund"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How much would you like to raise</FormLabel>
                <FormControl>
                  <Input placeholder="$" {...field} />
                </FormControl>
                <FormDescription>
                  The target amount of investment
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="min_investment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>The minimum check-size per investment</FormLabel>
                <FormControl>
                  <Input placeholder="$" {...field} />
                </FormControl>
                <FormDescription>
                  The minimum check-size per investment
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="valuation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valuation</FormLabel>
                <FormControl>
                  <Input placeholder="$" {...field} />
                </FormControl>
                <FormDescription>Company Valuation</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="allocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allocation</FormLabel>
                <FormControl>
                  <Input placeholder="10%" {...field} />
                </FormControl>
                <FormDescription>Company Allocation</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className={"flex flex-col"}>
                <FormLabel>Investment Deadline</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormDescription>Company Allocation</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* DIALOG เด้งๆ */}
          {/*<Button type="submit">Submit</Button>*/}
          <DialogCountdown />
          {/*    */}
        </form>
      </Form>
    </main>
  );
}
