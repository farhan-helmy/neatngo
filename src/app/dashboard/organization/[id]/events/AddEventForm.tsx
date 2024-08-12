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
import { CalendarIcon, PlusCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addEvent } from "./actions";
import { useParams } from "next/navigation";
import { eventTypeEnum } from "@/db/schema";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isBefore } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(1, {
        message: "Name is required",
      })
      .max(50, {
        message: "Name must be less than 50 characters",
      }),
    description: z.string().max(1000, {
      message: "Description must be less than 1000 characters",
    }),
    eventType: z.enum(eventTypeEnum["enumValues"]),
    startDate: z.date({
      required_error: "Start date is required",
      invalid_type_error: "That's not a valid date",
    }),
    endDate: z.date({
      required_error: "End date is required",
      invalid_type_error: "That's not a valid date",
    }),
    location: z.string({
      required_error: "Location is required",
    }),
    maxAttendees: z.coerce
      .number({
        required_error: "Max attendees is required",
      })
      .min(1, {
        message: "Max attendees must be at least 1",
      }),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true; 
    },
    {
      message: "End date must not be earlier than start date",
      path: ["endDate"], 
    }
  );

export function AddEventForm() {
  const { isLoading, withLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const eventTypeLabels = {
    WORKSHOP: "Workshop",
    FUNDRAISER: "Fundraiser",
    VOLUNTEER_ACTIVITY: "Volunteer Activity",
    MEETING: "Meeting",
    OTHER: "Other",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      maxAttendees: 1,
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const onSubmit = withLoading(async (values: z.infer<typeof formSchema>) => {
    const response = await addEvent({
      name: values.name,
      description: values.description,
      eventType: values.eventType,
      startDate: values.startDate,
      endDate: values.endDate,
      location: values.location,
      maxAttendees: values.maxAttendees,
      organizationId: params.id as string,
    });

    if (response.error) {
      toast.error(response.error);
    } else if (response.data) {
      toast.success("Event added successfully");
      setOpen(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="w-6 h-6 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Description" {...field} />
                  </FormControl>
                  <FormDescription>Event&apos;s description.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventTypeEnum.enumValues.map((value) => (
                          <SelectItem key={value} value={value}>
                            {eventTypeLabels[value] || value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxAttendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Attendees</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues("startDate");
                            return (
                              date < new Date("1900-01-01") ||
                              (startDate && isBefore(date, startDate))
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                {isLoading ? "Loading.." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
