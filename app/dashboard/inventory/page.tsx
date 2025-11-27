"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";
import { Plus, Upload } from "lucide-react";
import {
  useEquipment,
  useDeleteEquipment,
  useBulkImportEquipment,
} from "@/hooks/use-equipment";
import { EquipmentTable } from "@/components/equipment/equipment-table";
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

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  purchaseDate: Date;
  imageUrl?: string | null;
  departmentId: string;
  department: {
    name: string;
  };
}

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );

  // Fetch equipment
  const { data: equipmentResult, isLoading } = useEquipment();

  // Delete mutation
  const deleteMutation = useDeleteEquipment();

  // Bulk import mutation
  const bulkImportMutation = useBulkImportEquipment();

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this equipment?")) {
      deleteMutation.mutate(id);
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading equipment...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Equipment Inventory
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your department's equipment and assets
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBulkImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedEquipment(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

      {/* Equipment Table */}
      {equipmentResult && equipmentResult.length > 0 ? (
        <EquipmentTable
          data={equipmentResult}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500 mb-4">No equipment found</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Equipment
          </Button>
        </div>
      )}

      {/* Bulk Import Dialog */}
      <BulkImportDialog
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        onSuccess={handleBulkImportSuccess}
      />
    </div>
  );
}
