"use client";

import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import {
  useAllEquipment,
  useDeleteEquipment,
  useBulkImportEquipment,
} from "@/hooks/use-equipment";
import { EquipmentByDepartment } from "@/components/equipment/equipment-by-department";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { BulkImportDialog } from "@/components/equipment/bulk-import-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EquipmentStatus } from "@prisma/client";
import { LoadingState } from "@/components/ui/loading-spinner";

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  purchaseDate: Date;
  imageUrl?: string | null;
  departmentId: string;
  department: {
    id: string;
    name: string;
  };
}

export default function AllEquipmentPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );

  // Fetch all equipment across departments
  const {
    data: equipmentResult,
    isLoading,
    error,
    refetch,
  } = useAllEquipment();

  // Delete mutation
  const deleteMutation = useDeleteEquipment();

  // Bulk import mutation
  const bulkImportMutation = useBulkImportEquipment();

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedEquipment(null);
  };

  const handleFormSuccess = () => {
    handleDialogClose();
  };

  const handleBulkImportSuccess = () => {
    setIsBulkImportOpen(false);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            All Equipment by Department
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            View equipment across all departments. You can only edit equipment
            from your own department.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsBulkImportOpen(true)}
            className="w-full sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Bulk Import</span>
            <span className="sm:hidden">Import</span>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setSelectedEquipment(null)}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Equipment</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
              <DialogHeader>
                <DialogTitle>
                  {selectedEquipment ? "Edit Equipment" : "Add New Equipment"}
                </DialogTitle>
                <DialogDescription>
                  {selectedEquipment
                    ? "Update the equipment information below."
                    : "Fill in the details to add new equipment to your inventory."}
                </DialogDescription>
              </DialogHeader>
              <EquipmentForm
                equipment={
                  selectedEquipment
                    ? {
                        id: selectedEquipment.id,
                        name: selectedEquipment.name,
                        type: selectedEquipment.type,
                        status: selectedEquipment.status,
                        purchaseDate: selectedEquipment.purchaseDate,
                        imageUrl: selectedEquipment.imageUrl,
                        departmentId: selectedEquipment.departmentId,
                      }
                    : undefined
                }
                onSuccess={handleFormSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Equipment by Department */}
      <LoadingState
        isLoading={isLoading}
        error={error}
        loadingText="Loading equipment from all departments..."
        errorText="Failed to load equipment"
        onRetry={() => refetch()}
      >
        {equipmentResult && equipmentResult.length > 0 ? (
          <EquipmentByDepartment
            data={equipmentResult}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500 mb-4">
              No equipment found across all departments
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </div>
        )}
      </LoadingState>

      {/* Bulk Import Dialog */}
      <BulkImportDialog
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        onSuccess={handleBulkImportSuccess}
      />
    </div>
  );
}
