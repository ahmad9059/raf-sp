"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Pencil, Trash2, Package, Plus } from "lucide-react";
import { EquipmentStatus } from "@prisma/client";
import { useEquipmentById, useDeleteEquipment } from "@/hooks/use-equipment";
import { useMaintenanceLogs } from "@/hooks/use-maintenance";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { MaintenanceLogList } from "@/components/maintenance/maintenance-log-list";
import { AddMaintenanceLogForm } from "@/components/maintenance/add-maintenance-log-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusLabels: Record<EquipmentStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  NEEDS_REPAIR: "Needs Repair",
  DISCARDED: "Discarded",
};

const statusColors: Record<EquipmentStatus, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  IN_USE: "bg-blue-100 text-blue-800",
  NEEDS_REPAIR: "bg-yellow-100 text-yellow-800",
  DISCARDED: "bg-gray-100 text-gray-800",
};

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddMaintenanceDialogOpen, setIsAddMaintenanceDialogOpen] =
    useState(false);

  const equipmentId = params.id as string;

  // Fetch equipment details
  const { data: equipmentResult, isLoading } = useEquipmentById(equipmentId);

  // Fetch maintenance logs
  const { data: maintenanceResult, isLoading: isLoadingMaintenance } =
    useMaintenanceLogs(equipmentId);

  // Delete mutation
  const deleteMutation = useDeleteEquipment();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this equipment?")) {
      deleteMutation.mutate(equipmentId, {
        onSuccess: () => {
          router.push("/dashboard/inventory");
        },
      });
    }
  };

  const handleFormSuccess = () => {
    setIsEditDialogOpen(false);
  };

  const handleMaintenanceSuccess = () => {
    setIsAddMaintenanceDialogOpen(false);
  };

  const handleMaintenanceDeleted = () => {
    // The hook handles cache invalidation automatically
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading equipment details...</div>
      </div>
    );
  }

  if (!equipmentResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-500 mb-4">Equipment not found</p>
        <Button onClick={() => router.push("/dashboard/inventory")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
      </div>
    );
  }

  const equipment = equipmentResult;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/inventory")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {equipment.name}
            </h1>
            <p className="text-gray-600 mt-1">{equipment.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2 text-red-600" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Image */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Equipment Image</CardTitle>
          </CardHeader>
          <CardContent>
            {equipment.imageUrl ? (
              <img
                src={equipment.imageUrl}
                alt={equipment.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Equipment Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Equipment Information</CardTitle>
            <CardDescription>
              Detailed information about this equipment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1",
                    statusColors[equipment.status as EquipmentStatus]
                  )}
                >
                  {statusLabels[equipment.status as EquipmentStatus]}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Purchase Date
                </p>
                <p className="text-base text-gray-900 mt-1">
                  {format(new Date(equipment.purchaseDate), "MMMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="text-base text-gray-900 mt-1">
                  {equipment.department.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-base text-gray-900 mt-1">
                  {equipment.department.location}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Equipment ID
                </p>
                <p className="text-sm text-gray-900 mt-1 font-mono">
                  {equipment.id}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Last Updated
                </p>
                <p className="text-base text-gray-900 mt-1">
                  {format(new Date(equipment.updatedAt), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Log Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Maintenance History</CardTitle>
              <CardDescription>
                Track all maintenance and repair activities for this equipment
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddMaintenanceDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Maintenance Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingMaintenance ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading maintenance logs...</div>
            </div>
          ) : maintenanceResult ? (
            <MaintenanceLogList
              logs={maintenanceResult.logs}
              totalCost={maintenanceResult.totalCost}
              onLogDeleted={handleMaintenanceDeleted}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No maintenance records found for this equipment
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>
              Update the equipment information below.
            </DialogDescription>
          </DialogHeader>
          <EquipmentForm
            equipment={{
              id: equipment.id,
              name: equipment.name,
              type: equipment.type,
              status: equipment.status,
              purchaseDate: equipment.purchaseDate,
              imageUrl: equipment.imageUrl,
              departmentId: equipment.departmentId,
            }}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Add Maintenance Log Dialog */}
      <Dialog
        open={isAddMaintenanceDialogOpen}
        onOpenChange={setIsAddMaintenanceDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Maintenance Log</DialogTitle>
            <DialogDescription>
              Record maintenance work performed on {equipment.name}.
            </DialogDescription>
          </DialogHeader>
          <AddMaintenanceLogForm
            equipmentId={equipmentId}
            onSuccess={handleMaintenanceSuccess}
            onCancel={() => setIsAddMaintenanceDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
