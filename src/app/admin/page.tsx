import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { db } from "@/db";
import { users } from "@/db/schema";
import { UserData } from "./types";

async function getData(): Promise<UserData[]> {
  const data = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      nameOfDisorder: users.nameOfDisorder,
      isPaid: users.isPaid,
      membershipStart: users.membershipStart,
      membershipExpiry: users.membershipExpiry,
    })
    .from(users);

  const formattedData = data.map((user) => ({
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    phone: user.phone,
    nameOfDisorder: user.nameOfDisorder,
    isPaid: user.isPaid,
    membershipStart: user.membershipStart,
    membershipExpiry: user.membershipExpiry,
  }));

  return formattedData;
}

export default async function AdminPage() {
  const data = await getData();
  return (
    <Layout>
      <LayoutHeader>Dashboard</LayoutHeader>
      <LayoutBody>
        <DataTable columns={columns} data={data} />
      </LayoutBody>
    </Layout>
  );
}
