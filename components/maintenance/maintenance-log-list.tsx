"use client";

import { format } from "date-fns";
import { Trash2, Calendar, DollarSign, FileText } from "lucide-react";
import { MaintenanceLog } from "@prisma/client";
import { useDeleteMaintenanceLog } from "@/hooks/use-maintenance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MaintenanceLogListProps {
  logs: MaintenanceLog[];
  totalCost: number;
  onLogDeleted?: () => void;
  className?: string;
}

export function MaintenanceLogList({
  logs,
  totalCost,
  onLogDeleted,
  className,
}: MaintenanceLogListProps) {
  const deleteMutation = useDeleteMaintenanceLog();

  const handleDelete = (id: string) => {
    // Find the equipment ID from the first log (they should all have the same equipmentId)
    const equipmentId = logs.find((log) => log.id === id)?.equipmentId;
    if (!equipmentId) return;

    deleteMutation.mutate(
      { id, equipmentId },
      {
        onSuccess: () => {
          onLogDeleted?.();
        },
      }
    );
  };

  if (logs.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No maintenance logs
        </h3>
        <p className="text-gray-500">
          No maintenance activities have been recorded for this equipment yet.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Total Cost Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Total Maintenance Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${totalCost.toFixed(2)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Across {logs.length} maintenance{" "}
            {logs.length === 1 ? "entry" : "entries"}
          </p>
        </CardContent>
      </Card>

      {/* Maintenance Logs */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Maintenance History</h4>
        {logs.map((log) => (
          <Card key={log.id} className="relative">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(log.date), "MMM dd, yyyy")}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />$
                      {Number(log.cost).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-gray-900">
                    <p className="text-sm leading-relaxed">{log.description}</p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete Maintenance Log
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this maintenance log?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(log.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
