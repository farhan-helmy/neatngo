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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { registerStepFour } from "./actions";
import { useSearchParams } from "next/navigation";

const diseases = [
  { label: "Cystic Fibrosis", value: "Cystic Fibrosis" },
  { label: "Huntington's Disease", value: "Huntington's Disease" },
  {
    label: "Duchenne Muscular Dystrophy",
    value: "Duchenne Muscular Dystrophy",
  },
  {
    label: "Amyotrophic Lateral Sclerosis (ALS)",
    value: "Amyotrophic Lateral Sclerosis (ALS)",
  },
  { label: "Hemophilia", value: "Hemophilia" },
  { label: "Sickle Cell Anemia", value: "Sickle Cell Anemia" },
  { label: "Thalassemia", value: "Thalassemia" },
  { label: "Gaucher's Disease", value: "Gaucher's Disease" },
  { label: "Fabry Disease", value: "Fabry Disease" },
  { label: "Pompe Disease", value: "Pompe Disease" },
  { label: "Marfan Syndrome", value: "Marfan Syndrome" },
  { label: "Epidermolysis Bullosa", value: "Epidermolysis Bullosa" },
  { label: "Fragile X Syndrome", value: "Fragile X Syndrome" },
  { label: "Niemann-Pick Disease", value: "Niemann-Pick Disease" },
  {
    label: "Mucopolysaccharidosis (MPS)",
    value: "Mucopolysaccharidosis (MPS)",
  },
  { label: "Phenylketonuria (PKU)", value: "Phenylketonuria (PKU)" },
  { label: "Hereditary Angioedema", value: "Hereditary Angioedema" },
  {
    label: "Familial Hypercholesterolemia",
    value: "Familial Hypercholesterolemia",
  },
  { label: "Prader-Willi Syndrome", value: "Prader-Willi Syndrome" },
  { label: "Cushing's Syndrome", value: "Cushing's Syndrome" },
  { label: "Cystinosis", value: "Cystinosis" },
  { label: "Aplastic Anemia", value: "Aplastic Anemia" },
  {
    label: "Maple Syrup Urine Disease (MSUD)",
    value: "Maple Syrup Urine Disease (MSUD)",
  },
  {
    label: "Langerhans Cell Histiocytosis",
    value: "Langerhans Cell Histiocytosis",
  },
  {
    label: "Tuberous Sclerosis Complex (TSC)",
    value: "Tuberous Sclerosis Complex (TSC)",
  },
  { label: "Alkaptonuria", value: "Alkaptonuria" },
  {
    label: "Fibrodysplasia Ossificans Progressiva (FOP)",
    value: "Fibrodysplasia Ossificans Progressiva (FOP)",
  },
  { label: "Wilson's Disease", value: "Wilson's Disease" },
  { label: "Ataxia-Telangiectasia", value: "Ataxia-Telangiectasia" },
  {
    label: "Lambert-Eaton Myasthenic Syndrome (LEMS)",
    value: "Lambert-Eaton Myasthenic Syndrome (LEMS)",
  },
];

const userRegisterFormStepFourSchema = z.object({
  nameOfDisorder: z
    .string()
    .min(1, { message: "Name of disorder is required" }),
  membershipType: z.enum(["MONTHLY", "ANNUAL", "LIFETIME"], {
    required_error: "You need to select membership type.",
  }),
});

export function RegisterStepFourForm() {
  const searchParams = useSearchParams();

  const [memberType, setMemberType] = useState("MONTHLY");
  const form = useForm<z.infer<typeof userRegisterFormStepFourSchema>>({
    resolver: zodResolver(userRegisterFormStepFourSchema),
    defaultValues: {
      nameOfDisorder: "",
      membershipType: "MONTHLY",
    },
  });

  async function onSubmit(
    values: z.infer<typeof userRegisterFormStepFourSchema>
  ) {
    await registerStepFour({
      id: searchParams.get("id")!,
      ...values,
    });
  }

  return (
    <>
      <div className="pb-2">
        <Stepper step="three" />
      </div>
      <Card>
        <CardContent className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Repeat this FormField block for each field in your form */}
              <FormField
                control={form.control}
                name="nameOfDisorder"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Disorder</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? diseases.find(
                                  (disease) => disease.value === field.value
                                )?.label
                              : "Select Disorder"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search for disorder..." />
                          <ScrollArea className="h-96">
                            <CommandEmpty>No disorder found.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {diseases.map((disease) => (
                                  <CommandItem
                                    value={disease.label}
                                    key={disease.value}
                                    onSelect={() => {
                                      form.setValue(
                                        "nameOfDisorder",
                                        disease.value
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        disease.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {disease.label}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </ScrollArea>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Select your disease</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="membershipType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select membership type</FormLabel>
                    <FormControl>
                      <FormItem>
                        <Card
                          className={`${
                            memberType === "MONTHLY" ? "outline" : ""
                          } hover:cursor-pointer`}
                          onClick={() => {
                            setMemberType("MONTHLY");
                            form.setValue("membershipType", "MONTHLY");
                          }}
                        >
                          <CardHeader>
                            <CardTitle>Monthly</CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-row justify-between items-center">
                            <div className="font-semibold text-sm">RM 30</div>
                            {memberType === "MONTHLY" && (
                              <CheckIcon className="rounded-full bg-black text-white h-8 w-8" />
                            )}
                          </CardContent>
                        </Card>
                      </FormItem>
                    </FormControl>
                    <FormControl>
                      <FormItem>
                        <Card
                          className={`${
                            memberType === "ANNUAL" ? "outline" : ""
                          } hover:cursor-pointer`}
                          onClick={() => {
                            setMemberType("ANNUAL");
                            form.setValue("membershipType", "ANNUAL");
                          }}
                        >
                          <CardHeader>
                            <CardTitle>Annual</CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-row justify-between items-center">
                            <div className="font-semibold text-sm">RM 360</div>
                            {memberType === "ANNUAL" && (
                              <CheckIcon className="rounded-full bg-black text-white h-8 w-8" />
                            )}
                          </CardContent>
                        </Card>
                      </FormItem>
                    </FormControl>
                    <FormControl>
                      <FormItem>
                        <Card
                          className={`${
                            memberType === "LIFETIME" ? "outline" : ""
                          } hover:cursor-pointer`}
                          onClick={() => {
                            setMemberType("LIFETIME");
                            form.setValue("membershipType", "LIFETIME");
                          }}
                        >
                          <CardHeader>
                            <CardTitle>Lifetime</CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-row justify-between items-center">
                            <div className="font-semibold text-sm">RM 999</div>
                            {memberType === "LIFETIME" && (
                              <CheckIcon className="rounded-full bg-black text-white h-8 w-8" />
                            )}
                          </CardContent>
                        </Card>
                      </FormItem>
                    </FormControl>
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
