import { getMembers } from "./actions";

export type UserResult = Awaited<ReturnType<typeof getMembers>>["data"][0];