import { getOrganizations } from "./actions";

type GetOrganizationsReturn = Awaited<ReturnType<typeof getOrganizations>>;

export type OrganizationResults = NonNullable<
  GetOrganizationsReturn["data"]
>[number]; // use number to get the type of an individual item in the array
