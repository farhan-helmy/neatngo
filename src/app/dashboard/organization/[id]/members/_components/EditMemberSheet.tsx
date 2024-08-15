"use client";

import * as React from "react";
import { users, type UserWithMemberships } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { updateUser } from "../_lib/actions";
import { updateUserSchema, type UpdateUserSchema } from "../_lib/validations";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { UserResult } from "../_lib/type";

interface UpdateUserSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  user: UserResult;
}

export function UpdateMemberSheet({ user, ...props }: UpdateUserSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition();

  const params = useParams<{ id: string }>();

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user.email ?? "",
      phone: user.phone ?? "",
    },
  });

  React.useEffect(() => {
    form.reset({
      email: user.email ?? "",
      phone: user.phone ?? "",
    });
  }, [user, form]);

  function onSubmit(input: UpdateUserSchema) {
    startUpdateTransition(async () => {
      const { error } = await updateUser({
        id: user.id,
        orgId: params.id,
        ...input,
      });

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      props.onOpenChange?.(false);
      toast.success("Task updated");
    });
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update member</SheetTitle>
          <SheetDescription>
            Update the member details and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="fr@gmail.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="+6012345678" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isUpdatePending}>
              {isUpdatePending ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
