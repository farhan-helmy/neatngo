import { getGrants } from "./actions";

export type GrantResults = Awaited<ReturnType<typeof getGrants>>["data"][0];