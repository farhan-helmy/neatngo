"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import register from "./register";
import { checkEmail } from "./check-email";

const registrationFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }).max(60),
  lastName: z.string().min(2, { message: "Last name is required" }).max(60),
  email: z
    .string()
    .email({ message: "Email must be a valid email" })
    .min(1, { message: "Email is required." })
    // .refine(async (email) => await checkEmail(email), {
    //   message: "This email is already in use",
    // })
    ,
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registrationFormSchema>) {
    setIsLoading(true);

    try {
      const result = await register(values);
      if (result?.success) {
        console.log("registration successful");
        setIsLoading(false);

        // show success notification here later
        
      } else {
        console.error("registration failed:", result?.error);
      }
    } catch (error) {
      console.error("an error occurred:", error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Register now and manage an NGO.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Khairin" {...field} />
                  </FormControl>
                  <FormDescription>Enter your first name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chan" {...field} />
                  </FormControl>
                  <FormDescription>Enter your last name.</FormDescription>
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
                    <Input placeholder="syafiq@example.com" {...field} />
                  </FormControl>
                  <FormDescription>Enter your email address.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormDescription>Enter your password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>{" "}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
