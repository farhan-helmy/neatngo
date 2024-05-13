"use client";

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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stepper } from "./stepper";

const userRegisterFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Email must be a valid email" }),
  icNumber: z.string().min(1, { message: "IC number is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address_1: z.string().min(1, { message: "Address 1 is required" }),
  address_2: z.string().min(1, { message: "Address 2 is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  occupation: z.string().min(1, { message: "Occupation is required" }),
  nameOfDisorder: z
    .string()
    .min(1, { message: "Name of disorder is required" }),
  membershipType: z.string().min(1, { message: "Membership type is required" }),
  isPaid: z.boolean(),
  membershipStart: z.date(),
  membershipExpiry: z.date(),
  role: z.string().min(1, { message: "Role is required" }),
});

export function RegisterForm() {
  const form = useForm<z.infer<typeof userRegisterFormSchema>>({
    resolver: zodResolver(userRegisterFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      icNumber: "",
      phone: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      occupation: "",
      nameOfDisorder: "",
      membershipType: "",
      isPaid: false,
      membershipStart: new Date(),
      membershipExpiry: new Date(),
      role: "",
    },
  });

  function onSubmit(values: z.infer<typeof userRegisterFormSchema>) {
    console.log(values);
  }
  return (
    <>
      <div className="pb-2">
        <Stepper step="one" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Register as member for our society</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Repeat this FormField block for each field in your form */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Syafiq" {...field} />
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
                      <Input placeholder="Zulkarnain" {...field} />
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IC No.</FormLabel>
                    <FormControl>
                      <Input placeholder="970101-51-5123" {...field} />
                    </FormControl>
                    <FormDescription>Enter your IC number.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="60123456789" {...field} />
                    </FormControl>
                    <FormDescription>Enter your phone number.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-end">
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
