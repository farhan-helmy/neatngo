import { getEvent } from "./actions";

export type GetEventResult = Awaited<ReturnType<typeof getEvent>>["data"];