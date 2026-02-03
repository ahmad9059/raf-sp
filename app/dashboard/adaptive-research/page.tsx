"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AdaptiveResearchTable } from "@/components/adaptive-research/adaptive-research-table";
import { AdaptiveResearchForm } from "@/components/adaptive-research/adaptive-research-form";
import {
  AdaptiveResearchPosition,
  useAdaptiveResearchPositions,
  useDeleteAdaptiveResearchPosition,
} from "@/hooks/use-adaptive-research";
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
import { LoadingState } from "@/components/ui/loading-spinner";

export default function AdaptiveResearchDashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<AdaptiveResearchPosition | null>(null);

  const { data: positions, isLoading, error, refetch } = useAdaptiveResearchPositions();
  const deleteMutation = useDeleteAdaptiveResearchPosition();

  const stats = useMemo(() => {
    const base = {
      sanctioned: 0,
      filled: 0,
      vacant: 0,
      promotion: 0,
      initial: 0,
    };

    positions?.forEach((item) => {
      base.sanctioned += item.sanctionedPosts;
      base.filled += item.filledPosts;
      base.vacant += item.vacantPosts;
      base.promotion += item.promotionPosts;
      base.initial += item.initialRecruitmentPosts;
    });

    const vacancyRate = base.sanctioned ? Math.round((base.vacant / base.sanctioned) * 1000) / 10 : 0;

    return { ...base, vacancyRate };
  }, [positions]);

  const handleEdit = (position: AdaptiveResearchPosition) => {
    setSelectedPosition(position);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPosition(null);
  };

  const handleFormSuccess = () => {
    handleDialogClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Adaptive Research Center
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Manage monthly vacancy positions for the Adaptive Research Center.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Position
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Sanctioned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{stats.sanctioned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">Filled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">{stats.filled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Vacant Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">{stats.vacant}</div>
            <p className="text-xs text-red-600 mt-1">Vacancy rate {stats.vacancyRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Recruitment Pipeline</CardTitle>
            <CardDescription>Promotion vs initial quotas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Promotion</span>
              <span className="font-semibold text-amber-900">{stats.promotion}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Initial Recruitment</span>
              <span className="font-semibold text-amber-900">{stats.initial}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vacancy Register</CardTitle>
          <CardDescription>
            Review sanctioned strength, filled posts, and remaining vacancies for each role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState
            isLoading={isLoading}
            error={error}
            loadingText="Loading positions..."
            errorText="Failed to load positions"
            onRetry={() => refetch()}
          >
            {positions && (
              <AdaptiveResearchTable
                data={positions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </LoadingState>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPosition ? "Edit position" : "Add new position"}</DialogTitle>
            <DialogDescription>
              {selectedPosition
                ? "Update the vacancy details for this role."
                : "Provide vacancy details to add a new role to the register."}
            </DialogDescription>
          </DialogHeader>
          <AdaptiveResearchForm
            position={selectedPosition}
            onSuccess={handleFormSuccess}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
