"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateOrganization } from "../../_lib/actions";
import { organizationFormSchema } from "../../_lib/schema";
import { OrganizationResult } from "../../_lib/type";
import { updateOrganizationSchema } from "../../_lib/validations";

interface UpdateOrganizationPageProps {
  organization: {
    id: string;
    name: string;
    fullName: string | null;
    about: string | null;
  };
}
export function GeneralForm({ organization }: UpdateOrganizationPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<updateOrganizationSchema>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: organization?.name,
      fullName: organization?.fullName || "default full name",
      about: organization?.about || "default about",
    },
    mode: "onChange",
  });

  async function onSubmit(input: updateOrganizationSchema) {
    setIsLoading(true);
    try {
      await updateOrganization({
        id: organization.id,
        ...input,
      });

      toast.success("Organization updated successfully");
    } catch (error) {
      console.error("Failed to update organization:", error);
      toast.error("Failed to update organization. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              <FormDescription>Your NGO&apos;s short name.</FormDescription>
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
                <Input
                  placeholder="Malaysian Rare Disease Society"
                  {...field}
                />
              </FormControl>
              <FormDescription>Your NGO&apos;s full name.</FormDescription>
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
              <FormDescription>Tell us a bit about your NGO.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update profile"}
        </Button>
      </form>
    </Form>
  );
}
