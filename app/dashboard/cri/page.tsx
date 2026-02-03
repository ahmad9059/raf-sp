"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useCRIAssets, useDeleteCRIAsset, type CRIAsset } from "@/hooks/use-cri";
import { CRIAssetTable } from "@/components/cri/cri-asset-table";
import { CRIAssetForm } from "@/components/cri/cri-asset-form";
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

export default function CRIDashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CRIAsset | null>(null);

  // Fetch CRI assets
  const { data: assets, isLoading, error, refetch } = useCRIAssets();

  // Delete mutation
  const deleteMutation = useDeleteCRIAsset();

  const handleEdit = (asset: CRIAsset) => {
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
  const labEquipmentCount = assets?.filter((a) => a.type === "Laboratory Equipment").length || 0;
  const farmMachineryCount = assets?.filter((a) => a.type === "Farm Machinery").length || 0;
  const functionalCount = assets?.filter((a) => a.operationalStatus === "Functional").length || 0;
  const nonFunctionalCount = assets?.filter((a) => a.operationalStatus === "Non-Functional").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            CRI Department Assets
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Manage Cotton Research Institute Multan assets and inventory
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
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
            <CardTitle className="text-sm font-medium text-purple-600">Lab Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{labEquipmentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Farm Machinery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{farmMachineryCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Functional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{functionalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Non-Functional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{nonFunctionalCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Table */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Inventory</CardTitle>
          <CardDescription>
            View and manage all CRI department assets. Use the search and filters to find specific items.
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
              <CRIAssetTable
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
          <CRIAssetForm
            asset={selectedAsset}
            onSuccess={handleFormSuccess}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
