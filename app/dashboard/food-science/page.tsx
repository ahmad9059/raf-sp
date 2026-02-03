"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useFoodScienceEquipment, useDeleteFoodScienceEquipment, type FoodScienceEquipment } from "@/hooks/use-food-science";
import { FoodScienceTable } from "@/components/food-science/food-science-table";
import { FoodScienceForm } from "@/components/food-science/food-science-form";
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

export default function FoodScienceDashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<FoodScienceEquipment | null>(null);

  // Fetch Food Science equipment
  const { data: equipment, isLoading, error, refetch } = useFoodScienceEquipment();

  // Delete mutation
  const deleteMutation = useDeleteFoodScienceEquipment();

  const handleEdit = (item: FoodScienceEquipment) => {
    setSelectedEquipment(item);
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

  // Calculate stats
  const totalEquipment = equipment?.length || 0;
  const availableCount = equipment?.filter((e) => e.status === "AVAILABLE").length || 0;
  const inUseCount = equipment?.filter((e) => e.status === "IN_USE").length || 0;
  const needsRepairCount = equipment?.filter((e) => e.status === "NEEDS_REPAIR").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Food Science Department Equipment
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Manage Food Analysis Lab equipment and inventory
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEquipment}</div>
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

      {/* Equipment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
          <CardDescription>
            View and manage all Food Science department equipment. Use the search and filters to find specific items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState
            isLoading={isLoading}
            error={error}
            loadingText="Loading equipment..."
            errorText="Failed to load equipment"
            onRetry={() => refetch()}
          >
            {equipment && (
              <FoodScienceTable
                data={equipment}
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
            <DialogTitle>{selectedEquipment ? "Edit Equipment" : "Add New Equipment"}</DialogTitle>
            <DialogDescription>
              {selectedEquipment
                ? "Update the equipment details below."
                : "Fill in the details to add new equipment."}
            </DialogDescription>
          </DialogHeader>
          <FoodScienceForm
            equipment={selectedEquipment}
            onSuccess={handleFormSuccess}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
