"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useERSSStockItems, useDeleteERSSStockItem, type ERSSStockItem } from "@/hooks/use-entomology";
import { EntomologyTable } from "@/components/entomology/entomology-table";
import { EntomologyForm } from "@/components/entomology/entomology-form";
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

export default function EntomologyDashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ERSSStockItem | null>(null);

  // Fetch ERSS stock items
  const { data: items, isLoading, error, refetch } = useERSSStockItems();

  // Delete mutation
  const deleteMutation = useDeleteERSSStockItem();

  const handleEdit = (item: ERSSStockItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  const handleFormSuccess = () => {
    handleDialogClose();
  };

  // Calculate stats
  const totalItems = items?.length || 0;
  const availableCount = items?.filter((a) => a.status === "AVAILABLE").length || 0;
  const inUseCount = items?.filter((a) => a.status === "IN_USE").length || 0;
  const needsRepairCount = items?.filter((a) => a.status === "NEEDS_REPAIR").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Entomology Research Sub-Station
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Manage ERSS stock register and inventory
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
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

      {/* Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Register</CardTitle>
          <CardDescription>
            View and manage all Entomology Research Sub-Station stock items. Use the search and filters to find specific items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState
            isLoading={isLoading}
            error={error}
            loadingText="Loading stock items..."
            errorText="Failed to load stock items"
            onRetry={() => refetch()}
          >
            {items && (
              <EntomologyTable
                data={items}
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
            <DialogTitle>{selectedItem ? "Edit Stock Item" : "Add New Stock Item"}</DialogTitle>
            <DialogDescription>
              {selectedItem
                ? "Update the stock item details below."
                : "Fill in the details to add a new stock item."}
            </DialogDescription>
          </DialogHeader>
          <EntomologyForm
            item={selectedItem}
            onSuccess={handleFormSuccess}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
