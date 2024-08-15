"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";
import { UserWithMemberships } from "@/db/schema";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { editUser } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
});

export function EditMemberForm({ user }: { user: UserWithMemberships }) {
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const action = searchParams.get("action");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (action === "edit") {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, [searchParams, action]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      phone: user?.memberships[0].phone || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await editUser({
      data: values,
      userId: user.id,
      orgId: params.id,
    });

    if (res.error) {
      toast.error("Failed to update user");
      return;
    } else {
      toast.success("User updated successfully");
      setIsEdit(false);
      router.push(`/dashboard/organization/${params.id}/members/${user.id}`);
      return;
    }
  }

  if (!isEdit) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <Mail className="text-muted-foreground" size={18} />
          <span>{user?.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="text-muted-foreground" size={18} />
          <span>{user?.memberships[0].phone}</span>
        </div>
      </div>
    );
  }

  return (
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
