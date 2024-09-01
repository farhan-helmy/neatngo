import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout"
import NeatCrumb from "@/components/custom/NeatCrumb";
import { db } from "@/db";
import { grantAllocations, grants, grantTransactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GrantView } from "./_components/GrantView";

export default async function ViewGrantPage({
    params
}: {
    params: {
        grantId: string
    }
}) {

    const [grant, allocation, transactions, totalGrant] = await db.transaction(async (tx) => {
        const grant = await tx.query.grants.findFirst({
            where: eq(grants.id, params.grantId),
            with: {
                organization: true
            }
        });

        const allocation = await tx.query.grantAllocations.findMany({
            where: eq(grantAllocations.grantId, params.grantId)
        });

        const transactions = await tx.query.grantTransactions.findMany({
            where: eq(grantTransactions.grantId, params.grantId),
            orderBy: (grantTransactions, { desc }) => [desc(grantTransactions.transactionDate)]
        });

        const totalGrant = await tx.query.grants.findFirst({
            where: eq(grants.id, params.grantId),
            columns: {
                totalAmount: true
            }
        });

        return [grant, allocation, transactions, totalGrant];
    });

    if (!grant) {
        return <div>Grant not found</div>
    }

    return (
        <Layout>
            <LayoutHeader className="flex justify-between items-center">
                <NeatCrumb
                    items={[
                        {
                            label: "Organization",
                            href: `/dashboard/organization/${grant.organization.id}`,
                        },
                        {
                            label: "Grants",
                            href: `/dashboard/organization/${grant.organization.id}/grant`,
                        },
                        {
                            label: grant.name,
                            href: `/dashboard/organization/${grant.organization.id}/grant/${grant.id}`,
                        },
                    ]}
                />

            </LayoutHeader>
            <LayoutBody>
                <GrantView transactions={transactions} allocation={allocation} totalGrant={totalGrant?.totalAmount || 0} />
            </LayoutBody>
        </Layout>
    )
}