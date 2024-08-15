"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useLoading } from "@/hooks/useLoading";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addMember } from "../_lib/actions";
import { useParams } from "next/navigation";
import { PlusIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  fullName: z
    .string({
      required_error: "Full name is required",
      message: "Full name is required and must be a string",
    })
    .min(1, {
      message: "Full name is required",
    })
    .max(50, {
      message: "Full name must be less than 50 characters",
    }),
  email: z
    .string({
      required_error: "Email is required",
      message: "Email is required and must be a string",
    })
    .email({
      message: "Email is not valid",
    }),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
      message: "Phone number is required and must be a string",
    })
    .min(1, {
      message: "Phone number is required",
    })
    .max(50, {
      message: "Phone number must be less than 50 characters",
    }),
});

export function AddMemberForm() {
  const { isLoading, withLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit = withLoading(async (values: z.infer<typeof formSchema>) => {
    const response = await addMember({
      fullName: values.fullName,
      email: values.email,
      phone: values.phoneNumber,
      organizationId: params.id as string,
    });

    if (response.error) {
      toast.error(response.error);
    } else if (response.data) {
      toast.success("Member added successfully");
      setOpen(false);
    }
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          New Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Muhd Farhan" {...field} />
                  </FormControl>
                  <FormDescription>User&apos;s full name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="farhan@example.com" {...field} />
                  </FormControl>
                  <FormDescription>User&apos;s email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="012345678" {...field} />
                  </FormControl>
                  <FormDescription>User&apos;s phone number.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button>{isLoading ? "Loading.." : "Submit"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
