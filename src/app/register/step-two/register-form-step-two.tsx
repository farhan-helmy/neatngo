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
import Link from "next/link";
import { Stepper } from "../stepper";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { findPostcode } from "malaysia-postcodes";
import { useState } from "react";
import { toast } from "sonner";

const userRegisterFormStepTwoSchema = z.object({
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

export function RegisterStepTwoForm() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const form = useForm<z.infer<typeof userRegisterFormStepTwoSchema>>({
    resolver: zodResolver(userRegisterFormStepTwoSchema),
    defaultValues: {
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
    },
  });

  function handleFindPostcode(postcode: string) {
    const result = findPostcode(postcode);
    console.log(result);
    if (result.found) {
      form.setValue("city", result.city!);
      form.setValue("state", result.state!);
      setCity(result.city!);
      setState(result.state!);
    } else {
      toast.error("Postcode not found");
    }
  }

  function onSubmit(values: z.infer<typeof userRegisterFormStepTwoSchema>) {
    console.log(values);
  }

  console.log(form.getValues("city"));
  return (
    <>
      <div className="pb-2">
        <Stepper step="two" />
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
                name="postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Postcode</FormLabel>
                    <FormControl>
                      <div className="flex flex-row items-center justify-center gap-1">
                        <Input placeholder="43000" {...field} />
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleFindPostcode(field.value);
                          }}
                        >
                          <MagnifyingGlassIcon height={30} width={25} />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter your postcode and click search icon.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {city ? (
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Selangor"
                          {...field}
                          value={city}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              {state ? (
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Selangor"
                          {...field}
                          value={state}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <FormField
                control={form.control}
                name="address_1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="No.1 Jalan 5/3" {...field} />
                    </FormControl>
                    <FormDescription>Enter first address line.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="43500, Selangor" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter second address line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-1 items-end justify-end">
                <Link href={"/register"}>
                  <Button variant="secondary">Back</Button>
                </Link>

                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
