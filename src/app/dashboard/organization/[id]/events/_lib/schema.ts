import { events, eventTypeEnum } from "@/db/schema";
import { z } from "zod"

export const searchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    name: z.string().optional(),
    eventType: z.enum(events.eventType.enumValues).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    location: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    operator: z.enum(["and", "or"]).optional(),
    orgId: z.string().optional(),
})

export const getEventsSchema = searchParamsSchema

export type GetEventsSchema = z.infer<typeof getEventsSchema>

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
        startDate: z.string(),
        endDate: z.string(),
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
