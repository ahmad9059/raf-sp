"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DepartmentTable } from "@/components/department/department-table";
import { DepartmentForm } from "@/components/department/department-form";
import { useDepartments, useDeleteDepartment } from "@/hooks/use-departments";

interface Department {
  id: string;
  name: string;
  location: string;
  logo?: string | null;
  _count: {
    equipment: number;
    users: number;
  };
}

export default function DepartmentsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(
    null
  );

  // Fetch departments
  const { data: departments = [], isLoading } = useDepartments();

  // Delete mutation
  const deleteMutation = useDeleteDepartment();

  function handleEdit(department: Department) {
    setSelectedDepartment(department);
    setIsEditDialogOpen(true);
  }

  function handleDelete(id: string) {
    setDepartmentToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  function confirmDelete() {
    if (!departmentToDelete) return;

    deleteMutation.mutate(departmentToDelete, {
      onSettled: () => {
        setIsDeleteDialogOpen(false);
        setDepartmentToDelete(null);
      },
    });
  }

  function handleSuccess() {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedDepartment(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading departments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Department Management
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Manage departments and their organizational structure
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] mx-4 sm:mx-0">
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
            </DialogHeader>
            <DepartmentForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <DepartmentTable
        data={departments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {selectedDepartment && (
            <DepartmentForm
              department={selectedDepartment}
              onSuccess={handleSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              department and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
