"use client";
import { Suspense, useEffect, useState } from "react";
import { useForm, useFormState, useFieldArray } from "react-hook-form";
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
import { createFundraising } from "~/server/action/create_fundraising";
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
import dynamic from "next/dynamic";
import { FileIcon } from "lucide-react";

const EditorComp = dynamic(() => import("~/components/markdown_editor"), {
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
      router.push("/");
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
            <Link href="/">
              <Button className="mt-6 w-full bg-blue-500 py-3 text-lg font-semibold text-white hover:bg-blue-600">
                Go to homepage
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
      target_fund: 0,
      min_investment: 0,
      valuation: 0,
      allocation: 0,
      deadline: new Date(Date.now()),
      media: [],
      dataroom: [],
      pitch: "",
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
    remove: removeDataroom 
  } = useFieldArray({
    control: form.control,
    name: "dataroom",
  });

  const createFundraisingBind = createFundraising.bind(null);

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
            name="slogan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Company Slogan Or Short introduction</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Your Company Slogan Or Short introduction
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
                <FormLabel>Upload Media</FormLabel>
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
                                <p className="text-sm font-medium">{field.name}</p>
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
                  Upload images, documents, or other media files related to your fundraising campaign
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
                  Upload your company logo (maximum 2MB, PNG or JPEG)
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
                <FormLabel>Dataroom</FormLabel>
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
                  Upload documents for your dataroom
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
              <FormControl>
                <Suspense fallback={null}>
                  <EditorComp
                    markdown={field.value}
                    onChangeFn={field.onChange}
                    trigger={() => trigger("problem")}
                  />
                </Suspense>
              </FormControl>
              <FormDescription>
                Describe the problem or pain point your business is solving. What challenges do your customers face?
              </FormDescription>
              <FormMessage />
              <input
                type="hidden"
                name="problem"
                value={field.value}
              />
            </FormItem>
          )}
          />

          <FormField
          control={form.control}
          name="solution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solution</FormLabel>
              <FormControl>
                <Suspense fallback={null}>
                  <EditorComp
                    markdown={field.value}
                    onChangeFn={field.onChange}
                    trigger={() => trigger("solution")}
                  />
                </Suspense>
              </FormControl>
              <FormDescription>
                Explain your solution and how it addresses the problem. You can include images to showcase your product or service.
              </FormDescription>
              <FormMessage />
              <input
                type="hidden"
                name="solution"
                value={field.value}
              />
            </FormItem>
          )}
          />

          <FormField
          control={form.control}
          name="stage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stage</FormLabel>
              <FormControl>
                <Suspense fallback={null}>
                  <EditorComp
                    markdown={field.value}
                    onChangeFn={field.onChange}
                    trigger={() => trigger("stage")}
                  />  
                </Suspense>
              </FormControl>
              <FormDescription>
                What is your current business stage? (e.g., Idea, MVP, Growth) Include key metrics and milestones achieved.
              </FormDescription>
              <FormMessage />
              <input
                type="hidden"
                name="stage"
                value={field.value}
              />
            </FormItem>
          )}
          />

          <FormField
          control={form.control}
          name="team"
          render={({ field }) => (  
            <FormItem>
              <FormLabel>Team</FormLabel>
              <FormControl>
                <Suspense fallback={null}>
                  <EditorComp
                    markdown={field.value}
                    onChangeFn={field.onChange}
                    trigger={() => trigger("team")}
                  />
                </Suspense>
              </FormControl>
              <FormDescription>
                Introduce your team members, their roles, and relevant experience. You can include team photos.
              </FormDescription>
              <FormMessage />
              <input
                type="hidden"
                name="team"
                value={field.value}
              />
            </FormItem>
          )}
          />

          <FormField
          control={form.control}
          name="investors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Investors (Optional)</FormLabel>
              <FormControl>
                <Suspense fallback={null}>
                  <EditorComp
                    markdown={field.value ?? ""}
                    onChangeFn={field.onChange}
                    trigger={() => trigger("investors")}
                  />
                </Suspense>
              </FormControl>
              <FormDescription>
                List any current investors, advisors, or notable partnerships. You can include their logos if available.
              </FormDescription>
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
