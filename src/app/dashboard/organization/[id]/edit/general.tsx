"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { organizationFormSchema } from "../../_lib/schema"

type organizationFormValues = z.infer<typeof organizationFormSchema>

interface GeneralFormProps {
    initialData: Partial<organizationFormValues>;
}

export function GeneralForm({initialData}: GeneralFormProps) {
    const form = useForm<organizationFormValues>({
        resolver: zodResolver(organizationFormSchema),
        defaultValues: initialData,
        mode: "onChange",
    });

    function onSubmit(data: organizationFormValues) {
        console.log({ data })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="MRDS" {...field} />
                            </FormControl>
                            <FormDescription>
                                Your NGO's short name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Malaysian Rare Disease Society" {...field} />
                            </FormControl>
                            <FormDescription>
                                Your NGO's full name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>About</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="My organization is about..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Tell us a bit about your NGO.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Visibility</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={field.value ? 'Public' : 'Private'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Public</SelectItem>
                                        <SelectItem value="false">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                Set your organization as public or private.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                <Button type="submit">Update profile</Button>
            </form>
        </Form>
    )
}