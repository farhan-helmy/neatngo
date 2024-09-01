import { SelectGrantAllocation, SelectTransactions } from "@/db/schema";
import { GrantTransactionTable } from "./GrantTransactionTable";

export function TransactionTabContent({transactions, allocations}: {transactions: SelectTransactions[], allocations: SelectGrantAllocation[]}) {
    return (
        <GrantTransactionTable transactions={transactions} allocations={allocations} />
    )
}