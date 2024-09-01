"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { allocateGrant } from "../_lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addGrantSchema, allocateGrantSchema } from "../_lib/schema";
import { useLoading } from "@/hooks/useLoading";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface AllocateGrantDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    grantId: string;
}

export function AllocateGrantDialog({ open, onOpenChange, grantId }: AllocateGrantDialogProps) {

    const { isLoading, withLoading } = useLoading()
    const form = useForm<z.infer<typeof allocateGrantSchema>>({
        resolver: zodResolver(allocateGrantSchema),
        defaultValues: {
            name: "",
            amount: String(0),
        },
    });

    const onSubmit = withLoading(async (values: z.infer<typeof allocateGrantSchema>) => {

        console.log(values)
        const response = await allocateGrant({
            grantId: grantId,
            name: values.name,
            amount: Number(values.amount),
        });

        if (response.error) {
            toast.error(response.error)
            return
        }


        toast.success(`Grant ${values.name} allocated successfully`)
        onOpenChange(false)

    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Allocate Grant</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Budget name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Merdeka event" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Grant name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">
                                {isLoading ? "Loading.." : "Submit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

