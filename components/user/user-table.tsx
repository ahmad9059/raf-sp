"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Search, User, Shield, Building2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";
import { updateUserDepartment, updateUserRole } from "@/actions/user";

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

interface UserTableProps {
  data: User[];
  departments: Department[];
  onSuccess: () => void;
}

export function UserTable({ data, departments, onSuccess }: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter data based on role and department
  const filteredData = useMemo(() => {
    let filtered = data;

    if (roleFilter !== "all") {
      filtered = filtered.filter((item) => item.role === roleFilter);
    }

    if (departmentFilter !== "all") {
      if (departmentFilter === "unassigned") {
        filtered = filtered.filter((item) => !item.departmentId);
      } else {
        filtered = filtered.filter(
          (item) => item.departmentId === departmentFilter
        );
      }
    }

    return filtered;
  }, [data, roleFilter, departmentFilter]);

  async function handleDepartmentChange(userId: string, departmentId: string) {
    setIsUpdating(userId);
    try {
      const result = await updateUserDepartment(
        userId,
        departmentId === "unassigned" ? null : departmentId
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "User department updated successfully",
        });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update user department",
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
      setIsUpdating(null);
    }
  }

  async function handleRoleChange(userId: string, role: "ADMIN" | "DEPT_HEAD") {
    setIsUpdating(userId);
    try {
      const result = await updateUserRole(userId, role);

      if (result.success) {
        toast({
          title: "Success",
          description: "User role updated successfully",
        });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update user role",
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
      setIsUpdating(null);
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        const isUpdatingThis = isUpdating === user.id;

        return (
          <Select
            value={user.role}
            onValueChange={(value) =>
              handleRoleChange(user.id, value as "ADMIN" | "DEPT_HEAD")
            }
            disabled={isUpdatingThis}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </div>
              </SelectItem>
              <SelectItem value="DEPT_HEAD">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dept Head
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
        const user = row.original;
        const isUpdatingThis = isUpdating === user.id;

        return (
          <Select
            value={user.departmentId || "unassigned"}
            onValueChange={(value) => handleDepartmentChange(user.id, value)}
            disabled={isUpdatingThis}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">
                <span className="text-muted-foreground">Unassigned</span>
              </SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {dept.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "department.location",
      header: "Location",
      cell: ({ row }) => {
        const location = row.original.department?.location;
        return (
          <div className="text-sm">
            {location || <span className="text-muted-foreground">-</span>}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="DEPT_HEAD">Department Head</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              filteredData.length
            )}{" "}
            of {filteredData.length} results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
