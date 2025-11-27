"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserTable } from "@/components/user/user-table";
import { getUsers } from "@/actions/user";
import { getDepartments } from "@/actions/department";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DEPT_HEAD";
  departmentId?: string | null;
  department?: {
    id: string;
    name: string;
    location: string;
  } | null;
}

interface Department {
  id: string;
  name: string;
  location: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [usersResult, departmentsResult] = await Promise.all([
        getUsers(),
        getDepartments(),
      ]);

      if (usersResult.success && usersResult.data) {
        setUsers(usersResult.data);
      } else {
        toast({
          title: "Error",
          description: usersResult.message || "Failed to load users",
          variant: "destructive",
        });
      }

      if (departmentsResult.success && departmentsResult.data) {
        setDepartments(departmentsResult.data);
      } else {
        toast({
          title: "Error",
          description:
            departmentsResult.message || "Failed to load departments",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSuccess() {
    loadData();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and department assignments
          </p>
        </div>
      </div>

      <UserTable
        data={users}
        departments={departments}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
