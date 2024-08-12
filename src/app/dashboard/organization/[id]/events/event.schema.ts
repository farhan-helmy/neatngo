import { eventTypeEnum } from "@/db/schema";
import { z } from "zod"

export const eventFormSchema = z
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


export const editEventFormSchema = z
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
        startDate: z.string({
            required_error: "Start date is required",

        }),
        endDate: z.string({
            required_error: "End date is required",

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
