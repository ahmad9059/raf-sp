"use client";

import React from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmationDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  disabled?: boolean;
}

export function ConfirmationDialog({
  children,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  disabled = false,
}: ConfirmationDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {variant === "destructive" && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            )}
            <div>
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              variant === "destructive"
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                : undefined
            }
          >
            {variant === "destructive" && <Trash2 className="mr-2 h-4 w-4" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for programmatic confirmation dialogs
export function useConfirmationDialog() {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    variant: "default" | "destructive";
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default",
    onConfirm: () => {},
  });

  const confirm = React.useCallback(
    (options: {
      title: string;
      description: string;
      confirmText?: string;
      cancelText?: string;
      variant?: "default" | "destructive";
    }) => {
      return new Promise<boolean>((resolve) => {
        setDialogState({
          open: true,
          title: options.title,
          description: options.description,
          confirmText: options.confirmText || "Confirm",
          cancelText: options.cancelText || "Cancel",
          variant: options.variant || "default",
          onConfirm: () => {
            setDialogState((prev) => ({ ...prev, open: false }));
            resolve(true);
          },
        });
      });
    },
    []
  );

  const handleCancel = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  const ConfirmationDialogComponent = () => (
    <AlertDialog
      open={dialogState.open}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {dialogState.variant === "destructive" && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            )}
            <div>
              <AlertDialogTitle>{dialogState.title}</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="mt-2">
            {dialogState.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {dialogState.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={dialogState.onConfirm}
            className={
              dialogState.variant === "destructive"
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                : undefined
            }
          >
            {dialogState.variant === "destructive" && (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            {dialogState.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, ConfirmationDialogComponent };
}
