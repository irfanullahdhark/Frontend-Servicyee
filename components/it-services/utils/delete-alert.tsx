import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import React from "react";

interface DeleteAlertProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: () => void;
    trigger?: React.ReactNode;
    count?: number;
}

export function DeleteAlert({
                                open,
                                onOpenChange,
                                onDelete,
                                trigger,
                                count,
                            }: DeleteAlertProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                {trigger || (
                    <Button variant="destructive" className="ml-2">
                        Delete Selected ({count})
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete{" "}
                        {count ? `${count} selected items` : "this item"}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

interface DeleteSelectedAlertProps {
    selectedCount: number
    open: boolean
    onOpenChange: (open: boolean) => void
    onDelete: () => void
}

export function DeleteSelectedAlert({
                                        selectedCount,
                                        open,
                                        onOpenChange,
                                        onDelete,
                                    }: DeleteSelectedAlertProps) {
    return (
        <DeleteAlert
            open={open}
            onOpenChange={onOpenChange}
            onDelete={onDelete}
            count={selectedCount}
        />
    )
}