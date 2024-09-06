"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Delete, Download, Edit, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SelectGrantAllocation, SelectTransactions } from "@/db/schema";
import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";
import { addTransaction, deleteTransaction, editTransaction } from "../_lib/actions";
import { useParams } from "next/navigation";

function AddTransactionDialog({ allocations }: { allocations: SelectGrantAllocation[] }) {
    const [open, setOpen] = useState(false)
    const [selectedAllocation, setSelectedAllocation] = useState<SelectGrantAllocation | null>(null)
    const [amount, setAmount] = useState<number | null>(null)
    const [description, setDescription] = useState<string | null>(null)
    const [date, setDate] = useState(new Date().toDateString())
    const { isLoading, withLoading } = useLoading()

    const params = useParams<{ id: string, grantId: string }>()

    const handleAddTransaction = withLoading(async () => {
        if (!selectedAllocation || !amount || !description || !date) {
            toast.error("Please fill in all fields")
            return
        }

        const res = await addTransaction({
            transactionDate: new Date(date),
            description: description,
            amount: amount,
            allocationId: selectedAllocation.id,
            grantId: params.grantId
        })

        if (res.error) {
            toast.error(res.error)
            return
        }

        toast.success("Transaction added successfully")
        setSelectedAllocation(null)
        setAmount(null)
        setDescription(null)
        setDate(new Date().toDateString())
        setOpen(false)
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <DialogDescription>Enter the details of the new transaction below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input
                            id="description"
                            value={description ?? ""}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount ?? ""}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Allocation</Label>
                        <Select
                            value={selectedAllocation?.id ?? ""}
                            onValueChange={(value) => {
                                const allocation = allocations.find(a => a.id === value);
                                setSelectedAllocation(allocation || null);
                            }}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select allocation" />
                            </SelectTrigger>
                            <SelectContent>
                                {allocations.map(a => (
                                    <SelectItem key={a.id} value={a.id}>{a.name} ({a.amount.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' })})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAddTransaction}>{isLoading ? "Adding..." : "Add Transaction"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EditTransactionDialog({ transaction, allocations }: { transaction: SelectTransactions, allocations: SelectGrantAllocation[] }) {
    const [open, setOpen] = useState(false)
    const [selectedAllocation, setSelectedAllocation] = useState<SelectGrantAllocation | null>(
        allocations.find(a => a.id === transaction.allocationId) || null
    )
    const [amount, setAmount] = useState<number>(transaction.amount)
    const [description, setDescription] = useState<string>(transaction.description)
    const [date, setDate] = useState(transaction.transactionDate.toISOString().split('T')[0])
    const { isLoading, withLoading } = useLoading()

    const params = useParams<{ id: string, grantId: string }>()

    const handleEditTransaction = withLoading(async () => {
        if (!selectedAllocation || !amount || !description || !date) {
            toast.error("Please fill in all fields")
            return
        }

        const res = await editTransaction({
            transactionId: transaction.id,
            transaction: {
                transactionDate: new Date(date),
                description: description,
                amount: amount,
                allocationId: selectedAllocation.id,
                grantId: params.grantId
            }
        })

        if (res.error) {
            toast.error(res.error)
            return
        }

        toast.success("Transaction edited successfully")
        setOpen(false)
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                    <DialogDescription>Edit the details of the transaction below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-date" className="text-right">Date</Label>
                        <Input
                            id="edit-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-description" className="text-right">Description</Label>
                        <Input
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-amount" className="text-right">Amount</Label>
                        <Input
                            id="edit-amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-allocation" className="text-right">Allocation</Label>
                        <Select
                            value={selectedAllocation?.id ?? ""}
                            onValueChange={(value) => {
                                const allocation = allocations.find(a => a.id === value);
                                setSelectedAllocation(allocation || null);
                            }}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select allocation" />
                            </SelectTrigger>
                            <SelectContent>
                                {allocations.map(a => (
                                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleEditTransaction}>{isLoading ? "Saving..." : "Save Changes"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteTransactionDialog({ transaction, onDelete }: { transaction: SelectTransactions, onDelete: () => void }) {
    const [open, setOpen] = useState(false)
    const { isLoading, withLoading } = useLoading()
    const params = useParams<{ id: string, grantId: string }>()

    const handleDeleteTransaction = withLoading(async () => {
        const res = await deleteTransaction({
            transactionId: transaction.id,
            grantId: params.grantId
        })

        if (res.error) {
            toast.error(res.error)
            return
        }

        toast.success("Transaction deleted successfully")
        setOpen(false)
        onDelete()
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Transaction</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this transaction? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteTransaction} disabled={isLoading}>
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function GrantTransactionTable({ transactions, allocations }: { transactions: SelectTransactions[], allocations: SelectGrantAllocation[] }) {
    const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedAllocation, setSelectedAllocation] = useState<string | null>(null)

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAllocation = selectedAllocation === "All" || !selectedAllocation || transaction.allocationId === selectedAllocation;
        return matchesSearch && matchesAllocation;
    });

    const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const pageCount = Math.ceil(filteredTransactions.length / pageSize);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Grant Transactions</CardTitle>
                <CardDescription>List of all grant-related transactions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[200px]">
                        <Label htmlFor="search" className="sr-only">Search</Label>
                        <Input
                            id="search"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={selectedAllocation || ""} onValueChange={setSelectedAllocation}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by allocation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Allocations</SelectItem>
                            {allocations.map(allocation => (
                                <SelectItem key={allocation.id} value={allocation.id}>{allocation.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={new Date()}
                                selected={{
                                    from: dateRange.from,
                                    to: dateRange.to
                                }}
                                onSelect={(range) => {
                                    if (range) {
                                        setDateRange({
                                            from: range.from || new Date(),
                                            to: range.to || new Date()
                                        });
                                    }
                                }}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button onClick={() => console.log("export")}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <AddTransactionDialog allocations={allocations} />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Allocation</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{format(transaction.transactionDate, "LLL dd, y")}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{allocations.find(allocation => allocation.id === transaction.allocationId)?.name || 'Unknown'}</TableCell>
                                <TableCell className="text-right">{transaction.amount.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' })}</TableCell>

                                <TableCell className="text-right">
                                    <EditTransactionDialog transaction={transaction} allocations={allocations} />
                                    <DeleteTransactionDialog transaction={transaction} onDelete={() => {
                                        setCurrentPage(1);
                                        setSearchTerm("");
                                        setSelectedAllocation(null);
                                        setDateRange({ from: new Date(), to: new Date() });
                                    }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-between space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {pageCount}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                        disabled={currentPage === pageCount}
                    >
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}