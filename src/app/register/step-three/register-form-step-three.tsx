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

const userRegisterFormStepThreeSchema = z.object({
  occupation: z.string().min(1, { message: "Occupation is required" }),
});

export function RegisterStepThreeForm() {
  const form = useForm<z.infer<typeof userRegisterFormStepThreeSchema>>({
    resolver: zodResolver(userRegisterFormStepThreeSchema),
    defaultValues: {
      occupation: "",
    },
  });

  function onSubmit(values: z.infer<typeof userRegisterFormStepThreeSchema>) {
    console.log(values);
  }

  return (
    <>
      <div className="pb-2">
        <Stepper step="three" />
      </div>
      <Card >
        <CardContent className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Repeat this FormField block for each field in your form */}

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="Information Technology" {...field} />
                    </FormControl>
                    <FormDescription>Enter your occupation.</FormDescription>
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
