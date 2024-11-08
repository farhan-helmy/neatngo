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
  FormMessage,
} from "@/components/ui/form";
import { useLoading } from "@/hooks/useLoading";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, PlusCircleIcon, PlusIcon, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addEvent } from "../_lib/actions";
import { useParams } from "next/navigation";
import { eventTypeEnum } from "@/db/schema";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isBefore, set, parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { eventFormSchema } from "../_lib/schema";

export function AddEventForm() {
  const { isLoading, withLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const eventTypeLabels = {
    WORKSHOP: "Workshop",
    FUNDRAISER: "Fundraiser",
    VOLUNTEERING: "Volunteering",
    MEETING: "Meeting",
    OTHER: "Other",
  };

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      maxAttendees: 1,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
  });

  const onSubmit = withLoading(
    async (values: z.infer<typeof eventFormSchema>) => {
      const response = await addEvent({
        name: values.name,
        description: values.description,
        eventType: values.eventType,
        startDate: parseISO(values.startDate),
        endDate: parseISO(values.endDate),
        location: values.location,
        maxAttendees: values.maxAttendees,
        organizationId: params.id as string,
      });

      if (response.error) {
        toast.error(response.error);
      } else if (response.data) {
        form.reset();
        toast.success("Event added successfully");
        setOpen(false);
      }
    }
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          New Event
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
                    <FormLabel>Start Date and Time</FormLabel>
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
                              format(parseISO(new Date(field.value).toISOString()), "PPP HH:mm")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? parseISO(new Date(field.value).toISOString()) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = field.value ? parseISO(new Date(field.value).toISOString()) : new Date();
                              const newDate = set(date, {
                                hours: currentTime.getHours(),
                                minutes: currentTime.getMinutes(),
                              });
                              field.onChange(newDate.toISOString());
                            }
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t">
                          <Input
                            type="time"
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = set(parseISO(new Date(field.value).toISOString()), {
                                hours: parseInt(hours),
                                minutes: parseInt(minutes),
                              });
                              field.onChange(newDate.toISOString());
                            }}
                            value={field.value ? format(parseISO(new Date(field.value).toISOString()), 'HH:mm') : ''}
                          />
                        </div>
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
                    <FormLabel>End Date and Time</FormLabel>
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
                              format(parseISO(new Date(field.value).toISOString()), "PPP HH:mm")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? parseISO(new Date(field.value).toISOString()) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = field.value ? parseISO(new Date(field.value).toISOString()) : new Date();
                              const newDate = set(date, {
                                hours: currentTime.getHours(),
                                minutes: currentTime.getMinutes(),
                              });
                              field.onChange(newDate.toISOString());
                            }
                          }}

                          initialFocus
                        />
                        <div className="p-3 border-t">
                          <Input
                            type="time"
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = set(parseISO(new Date(field.value).toISOString()), {
                                hours: parseInt(hours),
                                minutes: parseInt(minutes),
                              });
                              field.onChange(newDate.toISOString());
                            }}
                            value={field.value ? format(parseISO(new Date(field.value).toISOString()), 'HH:mm') : ''}
                          />
                        </div>
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
