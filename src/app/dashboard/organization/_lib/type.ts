import { getOrganization } from "./actions";

export type OrganizationResult = Awaited<ReturnType<typeof getOrganization>>["data"];
