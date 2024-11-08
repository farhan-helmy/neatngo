import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash, GitBranch } from "lucide-react"
import { AllocationChart } from "./AllocationChart"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SelectGrantAllocation } from "@/db/schema"
import { allocateGrant } from "../../_lib/actions"
import { editAllocation, deleteAllocation } from "../_lib/actions"
import { useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { useLoading } from "@/hooks/useLoading"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function AddAllocationDialog() {
    const [category, setCategory] = useState("")
    const [amount, setAmount] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const params = useParams<{ id: string, grantId: string }>()

    const { isLoading, withLoading } = useLoading()

    const handleAllocateGrant = withLoading(async () => {
        const res = await allocateGrant({
            name: category,
            amount: amount ?? 0,
            grantId: params.grantId
        })

        if (res.error) {
            toast.error(res.error)
            return
        }

        toast.success(`Grant ${category} allocated successfully`)
        setOpen(false)
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Allocation
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Allocation</DialogTitle>
                    <DialogDescription>Enter the details of the new allocation below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                    <div>
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Input
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />

                    </div>

                    <div>
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount ?? ""}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>


                </div>
                <DialogFooter>
                    <Button onClick={handleAllocateGrant}>{isLoading ? "Allocating..." : "Add Allocation"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EditAllocationDialog({ allocation }: { allocation: SelectGrantAllocation }) {
    const [name, setName] = useState(allocation.name)
    const [amount, setAmount] = useState(allocation.amount)
    const [open, setOpen] = useState(false)
    const params = useParams<{ id: string, grantId: string }>()

    const { isLoading, withLoading } = useLoading()

    const handleEditAllocation = withLoading(async () => {
        const res = await editAllocation({
            allocation: {
                name,
                amount,
                grantId: params.grantId
            },
            allocationId: allocation.id
        })

        if (res.error) {
            toast.error(res.error)
            return
        }

        toast.success(`Allocation updated successfully`)
        setOpen(false)
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Allocation</DialogTitle>
                    <DialogDescription>Update the details of the allocation.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="edit-name">Category</Label>
                        <Input
                            id="edit-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-amount">Amount</Label>
                        <Input
                            id="edit-amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleEditAllocation}>{isLoading ? "Updating..." : "Update Allocation"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteAllocationDialog({ allocation }: { allocation: SelectGrantAllocation }) {
    const [open, setOpen] = useState(false)
    const params = useParams<{ id: string, grantId: string }>()

    const { isLoading, withLoading } = useLoading()

    const handleDeleteAllocation = withLoading(async () => {
        const res = await deleteAllocation({
            allocationId: allocation.id,
            grantId: params.grantId
        })

        if (res.error) {
            toast.error(res.error)
            return
        }

        toast.success(`Allocation deleted successfully`)
        setOpen(false)
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
                    <DialogTitle>Delete Allocation</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this allocation? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <p className="text-destructive">Warning: Deleting this allocation will remove all associated transactions.</p>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteAllocation} disabled={isLoading}>
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


function CreateSubAllocationDialog({ allocationId, name }: { allocationId: string, name: string }) {
    const [category, setCategory] = useState("")
    const [amount, setAmount] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const params = useParams<{ id: string, grantId: string }>()

    const { isLoading, withLoading } = useLoading()

    const handleCreateSubAllocation = withLoading(async () => {
        const res = await allocateGrant({
            parentAllocationId: allocationId,
            name: category,
            amount: amount ?? 0,
            grantId: params.grantId
        })

        if (res.error) {
            toast.error(res.error)
            return
        }

        toast.success(`Sub-allocation created successfully`)
        setOpen(false)
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>

                            <Button variant="ghost">
                                <GitBranch className="h-4 w-4" />
                            </Button>

                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Create Sub-Allocation</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Sub-Allocation for {name}</DialogTitle>
                    <DialogDescription>Enter the details of the new sub-allocation below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                    <div>
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Input
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />

                    </div>

                    <div>
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount ?? ""}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>


                </div>
                <DialogFooter>
                    <Button onClick={handleCreateSubAllocation}>{isLoading ? "Allocating Sub..." : "Sub Allocate"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function AllocationTabContent({ allocation }: { allocation: SelectGrantAllocation[] }) {
    const renderAllocationRow = (alloc: SelectGrantAllocation, level: number = 0): React.ReactNode => (
        <>
            <TableRow key={alloc.id}>
                <TableCell>
                    <div style={{ paddingLeft: `${level * 20}px` }}>
                        {level > 0 && <span className="text-muted-foreground mr-2">└─</span>}
                        {alloc.name}
                    </div>
                </TableCell>
                <TableCell className="text-right">{alloc.amount.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' })}</TableCell>
                <TableCell className="text-right">
                    <EditAllocationDialog allocation={alloc} />
                    <CreateSubAllocationDialog allocationId={alloc.id} name={alloc.name} />
                    <DeleteAllocationDialog allocation={alloc} />
                </TableCell>
            </TableRow>
            {allocation
                .filter(subAlloc => subAlloc.parentAllocationId === alloc.id)
                .map(subAlloc => renderAllocationRow(subAlloc, level + 1))
            }
        </>
    );

    const topLevelAllocations = allocation.filter(alloc => !alloc.parentAllocationId);
    const totalAllocation = allocation.reduce((sum, alloc) => sum + alloc.amount, 0);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle>Grant Allocation</CardTitle>
                    <CardDescription>Breakdown of fund allocation by category</CardDescription>
                </div>
                <AddAllocationDialog />
            </CardHeader>
            <CardContent>
                {allocation.length > 0 ? (
                    <>
                        <AllocationChart allocation={allocation} />
                        <ScrollArea className="max-h-[400px] rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topLevelAllocations.map(alloc => renderAllocationRow(alloc))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell className="font-bold">Total</TableCell>
                                        <TableCell className="text-right font-bold">
                                            {totalAllocation.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' })}
                                        </TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </ScrollArea>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No allocations yet. Click &apos;Add Allocation&apos; to get started.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}