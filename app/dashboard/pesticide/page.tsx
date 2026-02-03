"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { usePesticideData, useDeletePesticideData, type PesticideData } from "@/hooks/use-pesticide";
import { PesticideTable } from "@/components/pesticide/pesticide-table";
import { PesticideForm } from "@/components/pesticide/pesticide-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingState } from "@/components/ui/loading-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PesticideDashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PesticideData | null>(null);

  // Fetch Pesticide QC Lab data
  const { data: records, isLoading, error, refetch } = usePesticideData();

  // Delete mutation
  const deleteMutation = useDeletePesticideData();

  const handleEdit = (record: PesticideData) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleFormSuccess = () => {
    handleDialogClose();
  };

  // Calculate stats
  const totalRecords = records?.length || 0;
  const availableCount = records?.filter((r) => r.status === "AVAILABLE").length || 0;
  const inUseCount = records?.filter((r) => r.status === "IN_USE").length || 0;
  const needsRepairCount = records?.filter((r) => r.status === "NEEDS_REPAIR").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Pesticide QC Laboratory
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Manage Pesticide Quality Control Laboratory assets and inventory
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">In Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inUseCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Needs Repair</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{needsRepairCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Records</CardTitle>
          <CardDescription>
            View and manage all Pesticide QC Laboratory records. Use the search and filters to find specific items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState
            isLoading={isLoading}
            error={error}
            loadingText="Loading records..."
            errorText="Failed to load records"
            onRetry={() => refetch()}
          >
            {records && (
              <PesticideTable
                data={records}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </LoadingState>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRecord ? "Edit Record" : "Add New Record"}</DialogTitle>
            <DialogDescription>
              {selectedRecord
                ? "Update the record details below."
                : "Fill in the details to add a new record."}
            </DialogDescription>
          </DialogHeader>
          <PesticideForm
            record={selectedRecord}
            onSuccess={handleFormSuccess}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
