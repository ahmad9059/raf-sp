"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMNSUAMFacilities, useDeleteMNSUAMFacility, type MNSUAMFacility } from "@/hooks/use-mnsuam";
import { MNSUAMFacilityTable } from "@/components/mnsuam/mnsuam-facility-table";
import { MNSUAMFacilityForm } from "@/components/mnsuam/mnsuam-facility-form";
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

export default function MNSUAMDashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<MNSUAMFacility | null>(null);

  // Fetch MNSUAM facilities
  const { data: facilities, isLoading, error, refetch } = useMNSUAMFacilities();

  // Delete mutation
  const deleteMutation = useDeleteMNSUAMFacility();

  const handleEdit = (facility: MNSUAMFacility) => {
    setSelectedFacility(facility);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedFacility(null);
  };

  const handleFormSuccess = () => {
    handleDialogClose();
  };

  // Calculate stats
  const totalFacilities = facilities?.length || 0;
  const availableCount = facilities?.filter((f) => f.status === "AVAILABLE").length || 0;
  const inUseCount = facilities?.filter((f) => f.status === "IN_USE").length || 0;
  const needsRepairCount = facilities?.filter((f) => f.status === "NEEDS_REPAIR").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            MNSUAM Estate & Facilities
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Manage MNS University of Agriculture Multan estate and facilities
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Facility
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFacilities}</div>
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

      {/* Facility Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Inventory</CardTitle>
          <CardDescription>
            View and manage all MNSUAM estate facilities. Use the search and filters to find specific items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState
            isLoading={isLoading}
            error={error}
            loadingText="Loading facilities..."
            errorText="Failed to load facilities"
            onRetry={() => refetch()}
          >
            {facilities && (
              <MNSUAMFacilityTable
                data={facilities}
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
            <DialogTitle>{selectedFacility ? "Edit Facility" : "Add New Facility"}</DialogTitle>
            <DialogDescription>
              {selectedFacility
                ? "Update the facility details below."
                : "Fill in the details to add a new facility."}
            </DialogDescription>
          </DialogHeader>
          <MNSUAMFacilityForm
            facility={selectedFacility}
            onSuccess={handleFormSuccess}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
