"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useSoilWaterProjects, useDeleteSoilWaterProject, type SoilWaterProject } from "@/hooks/use-soil-water";
import { SoilWaterTable } from "@/components/soil-water/soil-water-table";
import { SoilWaterForm } from "@/components/soil-water/soil-water-form";
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

export default function SoilWaterDashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<SoilWaterProject | null>(null);

  // Fetch Soil Water projects
  const { data: projects, isLoading, error, refetch } = useSoilWaterProjects();

  // Delete mutation
  const deleteMutation = useDeleteSoilWaterProject();

  const handleEdit = (project: SoilWaterProject) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedProject(null);
  };

  const handleFormSuccess = () => {
    handleDialogClose();
  };

  // Calculate stats
  const totalProjects = projects?.length || 0;
  const availableCount = projects?.filter((p) => p.status === "AVAILABLE").length || 0;
  const inUseCount = projects?.filter((p) => p.status === "IN_USE").length || 0;
  const needsRepairCount = projects?.filter((p) => p.status === "NEEDS_REPAIR").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Soil & Water Testing Laboratory
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Manage Soil & Water Testing Laboratory projects and equipment
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
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

      {/* Project Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Inventory</CardTitle>
          <CardDescription>
            View and manage all Soil & Water Testing Laboratory projects. Use the search and filters to find specific items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState
            isLoading={isLoading}
            error={error}
            loadingText="Loading projects..."
            errorText="Failed to load projects"
            onRetry={() => refetch()}
          >
            {projects && (
              <SoilWaterTable
                data={projects}
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
            <DialogTitle>{selectedProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription>
              {selectedProject
                ? "Update the project details below."
                : "Fill in the details to add a new project."}
            </DialogDescription>
          </DialogHeader>
          <SoilWaterForm
            project={selectedProject}
            onSuccess={handleFormSuccess}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
