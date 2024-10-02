"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "~/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"

const formSchema = z.object({
    company: z.string().min(2).max(50),
    title: z.string().min(2).max(50),
    website: z.string().url(),
    email: z.string().email(),
    target_fund: z.number(),
})

export default function CreateFundraising() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company: "",
            title: "",
            website: "",
            email: "",
            target_fund: 0
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <main className="justify-left items-left mb-4 ml-4 mt-4 flex min-h-screen flex-col">
            <a className={"text-4xl font-bold mb-4"}>Start the Fundraising Campaign</a>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="company"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Company Name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    We want to get to know more about your business
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Your title</FormLabel>
                                <FormControl>
                                    <Input placeholder="CTO" {...field} />
                                </FormControl>
                                <FormDescription>
                                    What position are you working in this business
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="website"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Your Website</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://b2dventures.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    How can we know more about you
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Your Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="b2d@gmail.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    How can we contact you
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="target_fund"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>How much would you like to raise</FormLabel>
                                <FormControl>
                                    <Input placeholder="ex: b2d@gmail.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    How can we contact you
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </main>
    )
}
