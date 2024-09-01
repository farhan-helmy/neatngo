"use client";

import * as React from "react";
import { SelectEvent, SelectGrant, type SelectUsers } from "@/db/schema";
import { TrashIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Icons } from "@/components/icons";

import { deleteGrants } from "../_lib/actions";
import { useParams } from "next/navigation";

interface DeleteGrantDialogProps
    extends React.ComponentPropsWithoutRef<typeof Dialog> {
    grants: Row<SelectGrant>["original"][];
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function DeleteGrantDialog({
    grants,
    showTrigger = true,
    onSuccess,
    ...props
}: DeleteGrantDialogProps) {
    const [isDeletePending, startDeleteTransition] = React.useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");
    const params = useParams<{ id: string }>();

    function onDelete() {
        startDeleteTransition(async () => {
            const { error } = await deleteGrants({
                grantId: grants.map((grant) => grant.id),
                orgId: params.id,
            });

            if (error) {
                toast.error(error);
                return;
            }

            props.onOpenChange?.(false);
            toast.success("Event deleted");
            onSuccess?.();
        });
    }

    if (isDesktop) {
        return (
            <Dialog {...props}>
                {showTrigger ? (
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
                            Delete ({grants.length})
                        </Button>
                    </DialogTrigger>
                ) : null}
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your{" "}
                            <span className="font-medium">{grants.length}</span>
                            {grants.length === 1 ? " grant" : " grants"} from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:space-x-0">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            aria-label="Delete selected rows"
                            variant="destructive"
                            onClick={onDelete}
                            disabled={isDeletePending}
                        >
                            {isDeletePending && (
                                <Icons.spinner
                                    className="mr-2 size-4 animate-spin"
                                    aria-hidden="true"
                                />
                            )}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer {...props}>
            {showTrigger ? (
                <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">
                        <TrashIcon className="mr-2 size-4" aria-hidden="true" />
                        Delete ({grants.length})
                    </Button>
                </DrawerTrigger>
            ) : null}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>
                        This action cannot be undone. This will permanently delete your{" "}
                        <span className="font-medium">{grants.length}</span>
                        {grants.length === 1 ? " user" : " users"} from our servers.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                    <Button
                        aria-label="Delete selected rows"
                        variant="destructive"
                        onClick={onDelete}
                        disabled={isDeletePending}
                    >
                        {isDeletePending && (
                            <Icons.spinner
                                className="mr-2 size-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        Delete
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
