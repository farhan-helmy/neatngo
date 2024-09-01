"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, PieChart, Wallet } from "lucide-react"
import { AllocationTabContent } from "./AllocationTabContent"
import { TransactionTabContent } from "./TransactionTabContent"
import { SelectGrantAllocation, SelectTransactions } from "@/db/schema"

export function GrantView({allocation, transactions, totalGrant}: {allocation: SelectGrantAllocation[], transactions: SelectTransactions[], totalGrant: number}) {
    
    const totalSpent = transactions.reduce((sum, item) => sum + item.amount, 0);
    const remainingAmount = totalGrant - totalSpent;
    const percentageRemaining = (remainingAmount / totalGrant) * 100;
    const totalAllocated = allocation.reduce((sum, item) => sum + item.amount, 0);
    const percentageAllocated = (totalAllocated / totalGrant) * 100;

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Grant</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalGrant.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' })}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Remaining Amount</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{remainingAmount.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' })}</div>
                        <Progress value={percentageRemaining} className="mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Allocated Budget</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAllocated.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' })}</div>
                        <Progress value={percentageAllocated} className="mt-2" />
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="allocation" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="allocation">Allocation</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="allocation">
                    <AllocationTabContent allocation={allocation} />
                </TabsContent>
                <TabsContent value="transactions">
                    <TransactionTabContent transactions={transactions} allocations={allocation} />
                </TabsContent>
            </Tabs>
        </div>
    )
}