"use client";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addOrganization } from "./actions";
import { toast } from "sonner";
import { useLoading } from "@/hooks/useLoading";
import { useState, useEffect } from "react";


const formSchema = z.object({
  organizationName: z
    .string({
      required_error: "Organization name is required",
      message: "Organization name is required and must be a string",
    })
    .min(1, {
      message: "Organization name is required",
    })
    .max(50, {
      message: "Organization name must be less than 50 characters",
    }),
});

export function AddOrganizationDialog() {
  const { isLoading, withLoading } = useLoading();
  const [open, setOpen] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
    },
  });

  const onSubmit = withLoading(async (values: z.infer<typeof formSchema>) => {
    const response = await addOrganization({
      name: values.organizationName,
    });

    if (response.error) {
      toast.error(response.error);
    } else if (response.data) {
      toast.success("Organization added successfully");
      setOpen(false);
    }
  });


  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="add-organization-button">
            <Button>
              <PlusCircleIcon className="w-6 h-6 mr-2" />
              Organization
            </Button>
          </div>

        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Organization</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Example NGO" {...field} />
                    </FormControl>
                    <FormDescription>This is your NGO name.</FormDescription>
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
    </>
  );
}
