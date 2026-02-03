"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAMRIAssets, useDeleteAMRIAsset, type AMRIAsset } from "@/hooks/use-amri";
import { AMRIAssetTable } from "@/components/amri/amri-asset-table";
import { AMRIAssetForm } from "@/components/amri/amri-asset-form";
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

export default function AMRIDashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AMRIAsset | null>(null);

  // Fetch AMRI assets
  const { data: assets, isLoading, error, refetch } = useAMRIAssets();

  // Delete mutation
  const deleteMutation = useDeleteAMRIAsset();

  const handleEdit = (asset: AMRIAsset) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedAsset(null);
  };

  const handleFormSuccess = () => {
    handleDialogClose();
  };

  // Calculate stats
  const totalAssets = assets?.length || 0;
  const availableCount = assets?.filter((a) => a.status === "AVAILABLE").length || 0;
  const inUseCount = assets?.filter((a) => a.status === "IN_USE").length || 0;
  const needsRepairCount = assets?.filter((a) => a.status === "NEEDS_REPAIR").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            AMRI Department Assets
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Manage Agricultural Mechanization Research Institute assets and inventory
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
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

      {/* Asset Table */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Inventory</CardTitle>
          <CardDescription>
            View and manage all AMRI department assets. Use the search and filters to find specific items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState
            isLoading={isLoading}
            error={error}
            loadingText="Loading assets..."
            errorText="Failed to load assets"
            onRetry={() => refetch()}
          >
            {assets && (
              <AMRIAssetTable
                data={assets}
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
            <DialogTitle>{selectedAsset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
            <DialogDescription>
              {selectedAsset
                ? "Update the asset details below."
                : "Fill in the details to add a new asset."}
            </DialogDescription>
          </DialogHeader>
          <AMRIAssetForm
            asset={selectedAsset}
            onSuccess={handleFormSuccess}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
