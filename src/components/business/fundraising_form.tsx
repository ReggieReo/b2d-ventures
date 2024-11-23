"use client";
import { Suspense, useEffect, useState } from "react";
import {
  useForm,
  useFormState,
  useFieldArray,
  useWatch,
} from "react-hook-form";
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
import * as React from "react";
import { z } from "zod";
import { formSchema } from "~/app/create_fundraising/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "~/utils/uploadthings";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { format } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import { X } from "lucide-react";


import { industries } from "~/utils/enum/industryList";

import dynamic from "next/dynamic";
import { FileIcon } from "lucide-react";
import { createFundraising } from "~/server/action/business_action";

const EditorComp = dynamic(() => import("~/components/util/markdown_editor"), {
  ssr: false,
});

function DialogCountdown() {
  const [countdown, setCountdown] = useState(3);
  const [startCountdown, setStartCountdown] = useState(false);

  const { isValid, isDirty } = useFormState();
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
      router.push("/startup_dashboard");
    }
    return () => clearTimeout(timer);
  }, [countdown, startCountdown]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="submit"
          disabled={!isValid || !isDirty}
          onClick={handleConfirmInvestment}
        >
          Submit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Fundraising Information has been sent to admin.
          </DialogTitle>
          <DialogDescription>
            Redirecting you to homepage in {countdown} seconds.
            <Link href="/startup_dashboard">
              <Button className="mt-6 w-full bg-blue-500 py-3 text-lg font-semibold text-white hover:bg-blue-600">
                Go to Dashboard
              </Button>
            </Link>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function FundraisingForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      slogan: "",
      website: "",
      industry: "",
      deadline: new Date(Date.now()),
      media: [],
      dataroom: [],
      problem: "",
      solution: "",
      stage: "",
      team: "",
      investors: "",
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "media",
  });

  const {
    fields: dataroomFields,
    append: appendDataroom,
    remove: removeDataroom,
  } = useFieldArray({
    control: form.control,
    name: "dataroom",
  });

  const createFundraisingBind = createFundraising.bind(null);

  const valuation = useWatch({ control: form.control, name: "valuation" });
  const allocation = useWatch({ control: form.control, name: "allocation" });
  const targetStock = useWatch({ control: form.control, name: "target_stock" });
  const [stockPrice, setStockPrice] = useState<number | null>(null);

  useEffect(() => {
    if (valuation > 0 && allocation > 0 && targetStock > 0) {
      const calculatedPrice = (valuation * allocation) / 100 / targetStock;
      setStockPrice(calculatedPrice);
    } else {
      setStockPrice(null);
    }
  }, [valuation, allocation, targetStock]);

  const { trigger } = form;
  return (
    <main className="justify-left items-left mb-4 ml-4 mt-4 flex min-h-screen flex-col">
      <a className={"mb-4 text-4xl font-bold"}>
        Start the Fundraising Campaign
      </a>
      <Form {...form}>
        <form
          action={createFundraisingBind}
          // onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your company name (2-50 characters)" {...field} />
                </FormControl>
                <FormDescription>
                  This will be displayed as your main business identifier across the platform
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slogan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Slogan</FormLabel>
                <FormControl>
                  <Input placeholder="A brief, compelling description of your business (10-100 characters)" {...field} />
                </FormControl>
                <FormDescription>
                  A concise tagline that captures your business's unique value proposition
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
                <FormLabel>Company Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.yourcompany.com" {...field} />
                </FormControl>
                <FormDescription>
                  Your official company website where investors can learn more about your business
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
                <input
                  type="hidden"
                  name={field.name}
                  value={field.value?.toString()}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="valuation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Valuation</FormLabel>
                <FormControl>
                  <Input placeholder="Minimum $25,000" {...field} />
                </FormControl>
                <FormDescription>
                  Your company's current valuation - this will be used to calculate the stock price
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="allocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equity Allocation</FormLabel>
                <FormControl>
                  <Input placeholder="Enter percentage (10-49%)" {...field} />
                </FormControl>
                <FormDescription>
                  The percentage of equity you're offering to investors in this fundraising round
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="target_stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Stock Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Minimum 10 shares" {...field} />
                </FormControl>
                <FormDescription>
                  The total number of shares available for investment in this fundraising round
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 text-lg">
            {stockPrice !== null ? (
              <p>Stock price: ${stockPrice.toFixed(2)}</p>
            ) : (
              <p>Stock price: to be calculated</p>
            )}
          </div>
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fundraising Deadline</FormLabel>
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
                <FormDescription>
                  Set the closing date for your fundraising campaign (minimum 2 weeks from today)
                </FormDescription>
                <FormMessage />
                <input
                  type="hidden"
                  name={field.name}
                  value={field.value?.toISOString()}
                />
              </FormItem>
            )}
          />

          {/* Add Media Upload Section */}
          <FormField
            control={form.control}
            name="media"
            render={(field) => (
              <FormItem>
                <FormLabel>Company Gallery Images</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={async (res) => {
                        res?.forEach((file) => {
                          append({
                            url: file.url,
                            name: file.name,
                            size: file.size,
                            key: file.key,
                          });
                        });
                        await trigger("media");
                      }}
                      onUploadError={(error: Error) => {
                        console.error("Upload error:", error);
                      }}
                    />

                    <div className="mt-4 space-y-2">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="relative rounded-lg border-2 border-dashed border-gray-200 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="h-16 w-16 overflow-hidden rounded-md border">
                                <img
                                  src={field.url}
                                  alt="Media preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {field.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(field.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <input
                      type="hidden"
                      name="media"
                      value={JSON.stringify(fields)}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload images that will be displayed in your company's gallery section. These images should showcase your products, services, or company highlights to potential investors. (Recommended: 3-5 high-quality images, maximum 2MB per image, WEBP or JPEG format)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Logo</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {!field.value ? (
                      <UploadButton
                        endpoint="logoUploader"
                        onClientUploadComplete={async (res) => {
                          console.log(res);
                          console.log(res[0]);
                          if (res?.[0]) {
                            form.setValue("logo", {
                              url: res[0].url,
                              name: res[0].name,
                              size: res[0].size,
                              key: res[0].key,
                            });
                            await trigger("logo");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          console.error("Logo upload error:", error);
                        }}
                      />
                    ) : (
                      <div className="relative rounded-lg border-2 border-dashed border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 overflow-hidden rounded-md border">
                              <img
                                src={field.value.url}
                                alt="Company logo"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {field.value.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(field.value.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              // @ts-expect-error user can delete logo but require to have
                              form.setValue("logo", null);
                              await form.trigger("logo"); // Trigger validation after removal}
                            }}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <input
                      type="hidden"
                      name="logo"
                      value={field.value ? JSON.stringify(field.value) : ""}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload your company logo that will appear at the top of your business profile. This will be your primary brand identifier across the platform. (Maximum 512 KB, WEBP or JPEG)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Banner</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {!field.value ? (
                      <UploadButton
                        endpoint="bannerUploader"
                        onClientUploadComplete={async (res) => {
                          console.log(res);
                          console.log(res[0]);
                          if (res?.[0]) {
                            form.setValue("banner", {
                              url: res[0].url,
                              name: res[0].name,
                              size: res[0].size,
                              key: res[0].key,
                            });
                            await trigger("banner");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          console.error("Banner upload error:", error);
                        }}
                      />
                    ) : (
                      <div className="relative rounded-lg border-2 border-dashed border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 overflow-hidden rounded-md border">
                              <img
                                src={field.value.url}
                                alt="Company banner"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {field.value.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(field.value.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              // @ts-expect-error user can delete logo but require to have
                              form.setValue("banner", null);
                              await form.trigger("banner"); // Trigger validation after removal}
                            }}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <input
                      type="hidden"
                      name="banner"
                      value={field.value ? JSON.stringify(field.value) : ""}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload a banner image that will be displayed at the top of your business profile page. Choose a high-quality image that represents your brand. (Maximum 2MB, WEBP or JPEG, recommended size: 1200x400px)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Room Documents</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <UploadButton
                      endpoint="dataroomUploader"
                      onClientUploadComplete={async (res) => {
                        res?.forEach((file) => {
                          appendDataroom({
                            url: file.url,
                            name: file.name,
                            size: file.size,
                            key: file.key,
                          });
                        });
                        await trigger("dataroom");
                      }}
                      onUploadError={(error: Error) => {
                        console.error("Dataroom upload error:", error);
                      }}
                    />

                    <div className="mt-4 space-y-2">
                      {dataroomFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between rounded-md border border-gray-200 p-2"
                        >
                          <div className="flex items-center space-x-2">
                            <FileIcon className="h-8 w-8 text-gray-400" />
                            <div>
                              <span className="text-sm font-medium">
                                {field.name}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">
                                ({(field.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDataroom(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="hidden"
                      name="dataroom"
                      value={JSON.stringify(dataroomFields)}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload confidential business documents (financial statements, business plans, etc.) that will be available to approved investors. These documents will require investor approval to access.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="problem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problem</FormLabel>
                <FormDescription>
                  Clearly describe the problem or pain point your business is addressing. What specific challenges do your target customers face? What are the consequences of this problem remaining unsolved? <br></br>
                  To add images: Paste or drag & drop images directly into the editor (max 2MB per image, WEBP or JPEG format).<br></br> 
                  Maximum text length: 5000 characters.
                </FormDescription>
                <FormControl>
                  <Suspense fallback={null}>
                    <EditorComp
                      markdown={field.value}
                      onChangeFn={field.onChange}
                      trigger={() => trigger("problem")}
                    />
                  </Suspense>
                </FormControl>
                <FormMessage />
                <input type="hidden" name="problem" value={field.value} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="solution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solution</FormLabel>
                <FormDescription>
                  Explain how your product or service solves the problem. What makes your solution unique and effective? Include specific features, benefits, and competitive advantages. Demonstrate how your solution creates value for customers.<br></br>
                  To add images: Paste or drag & drop product screenshots, diagrams, or demos directly into the editor (max 2MB per image, WEBP or JPEG format).<br></br>
                  Maximum text length: 5000 characters.
                </FormDescription>
                <FormControl>
                  <Suspense fallback={null}>
                    <EditorComp
                      markdown={field.value}
                      onChangeFn={field.onChange}
                      trigger={() => trigger("solution")}
                    />
                  </Suspense>
                </FormControl>
                <FormMessage />
                <input type="hidden" name="solution" value={field.value} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stage</FormLabel>
                <FormDescription>
                  Detail your current business stage and traction. Include key metrics like:<br></br>
                  • Current stage (Idea, MVP, Growth)<br></br>
                  • Key milestones achieved<br></br>
                  • User/customer metrics<br></br>
                  • Revenue figures (if applicable)<br></br>
                  • Market validation points<br></br>
                  To add images: Paste or drag & drop charts, graphs, or milestone timelines directly into the editor (max 2MB per image, WEBP or JPEG format).<br></br>
                  Maximum text length: 3000 characters.
                </FormDescription>
                <FormControl>
                  <Suspense fallback={null}>
                    <EditorComp
                      markdown={field.value}
                      onChangeFn={field.onChange}
                      trigger={() => trigger("stage")}
                    />
                  </Suspense>
                </FormControl>
                <FormMessage />
                <input type="hidden" name="stage" value={field.value} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team</FormLabel>
                <FormDescription>
                  Introduce your team members and their qualifications. For each key team member, include:<br></br>
                  • Role and responsibilities<br></br>
                  • Relevant experience<br></br>
                  • Education<br></br>
                  • Notable achievements<br></br>
                  • LinkedIn profiles (optional)<br></br>
                  To add images: Paste or drag & drop professional headshots or team photos directly into the editor (max 2MB per image, WEBP or JPEG format).<br></br>
                  Maximum text length: 3000 characters.
                </FormDescription>
                <FormControl>
                  <Suspense fallback={null}>
                    <EditorComp
                      markdown={field.value}
                      onChangeFn={field.onChange}
                      trigger={() => trigger("team")}
                    />
                  </Suspense>
                </FormControl>
                <FormMessage />
                <input type="hidden" name="team" value={field.value} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Investors (Optional)</FormLabel>
                <FormDescription>
                  List any notable investors, advisors, or partnerships. Include:<br></br>
                  • Names and roles<br></br>
                  • Investment amounts (if public)<br></br>
                  • Strategic value they bring<br></br>
                  • Notable achievements or expertise<br></br>

                  To add images: Paste or drag & drop investor/partner logos directly into the editor (max 2MB per image, WEBP or JPEG format).<br></br>
                  Maximum text length: 2000 characters.
                </FormDescription>
                <FormControl>
                  <Suspense fallback={null}>
                    <EditorComp
                      markdown={field.value ?? ""}
                      onChangeFn={field.onChange}
                      trigger={() => trigger("investors")}
                    />
                  </Suspense>
                </FormControl>
                <FormMessage />
                <input
                  type="hidden"
                  name="investors"
                  value={field.value ?? ""}
                />
              </FormItem>
            )}
          />
          {/* DIALOG เด้งๆ */}
          <DialogCountdown />
        </form>
      </Form>
    </main>
  );
}
