import { getEvents } from "./actions";

export type EventResults = Awaited<ReturnType<typeof getEvents>>["data"][0];