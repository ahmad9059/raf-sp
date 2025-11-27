"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
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
import { EquipmentStatus } from "@prisma/client";
import { format } from "date-fns";
import { Pencil, Trash2, Search, Building2, Eye } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  purchaseDate: Date;
  departmentId: string;
  department: {
    id: string;
    name: string;
  };
}

interface EquipmentByDepartmentProps {
  data: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
}

const statusLabels: Record<EquipmentStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  NEEDS_REPAIR: "Needs Repair",
  DISCARDED: "Discarded",
};

const statusColors: Record<EquipmentStatus, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  IN_USE: "bg-blue-100 text-blue-800",
  NEEDS_REPAIR: "bg-yellow-100 text-yellow-800",
  DISCARDED: "bg-gray-100 text-gray-800",
};

export function EquipmentByDepartment({
  data,
  onEdit,
  onDelete,
}: EquipmentByDepartmentProps) {
  const { data: session } = useSession();
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(
    new Set()
  );

  const userDepartmentId = session?.user?.departmentId;
  const userRole = session?.user?.role;

  // Get unique types for filter
  const uniqueTypes = useMemo(() => {
    const types = new Set(data.map((item) => item.type));
    return Array.from(types).sort();
  }, [data]);

  // Group equipment by department
  const equipmentByDepartment = useMemo(() => {
    let filtered = data;

    // Apply filters
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    if (globalFilter) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
          item.type.toLowerCase().includes(globalFilter.toLowerCase()) ||
          item.department.name
            .toLowerCase()
            .includes(globalFilter.toLowerCase())
      );
    }

    // Group by department
    const grouped = filtered.reduce((acc, equipment) => {
      const deptId = equipment.department.id;
      if (!acc[deptId]) {
        acc[deptId] = {
          department: equipment.department,
          equipment: [],
        };
      }
      acc[deptId].equipment.push(equipment);
      return acc;
    }, {} as Record<string, { department: { id: string; name: string }; equipment: Equipment[] }>);

    return Object.values(grouped).sort((a, b) =>
      a.department.name.localeCompare(b.department.name)
    );
  }, [data, statusFilter, typeFilter, globalFilter]);

  const toggleDepartment = (departmentId: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedDepartments(newExpanded);
  };

  const canEdit = (equipment: Equipment) => {
    return userRole === "ADMIN" || equipment.departmentId === userDepartmentId;
  };

  const columns: ColumnDef<Equipment>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as EquipmentStatus;
        return (
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              statusColors[status]
            )}
          >
            {statusLabels[status]}
          </span>
        );
      },
    },
    {
      accessorKey: "purchaseDate",
      header: "Purchase Date",
      cell: ({ row }) => {
        const date = row.getValue("purchaseDate") as Date;
        return <div>{format(new Date(date), "MMM dd, yyyy")}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const equipment = row.original;
        const canEditEquipment = canEdit(equipment);

        return (
          <div className="flex gap-2">
            {canEditEquipment ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(equipment)}
                  title="Edit equipment"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmationDialog
                  title="Delete Equipment"
                  description={`Are you sure you want to delete "${equipment.name}"? This action cannot be undone and will also delete all associated maintenance logs.`}
                  confirmText="Delete"
                  variant="destructive"
                  onConfirm={() => onDelete(equipment.id)}
                >
                  <Button variant="ghost" size="sm" title="Delete equipment">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </ConfirmationDialog>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                disabled
                title="View only - you can only edit equipment from your department"
              >
                <Eye className="h-4 w-4 text-gray-400" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search equipment or departments..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Department Tables */}
      <div className="space-y-6">
        {equipmentByDepartment.length > 0 ? (
          equipmentByDepartment.map(({ department, equipment }) => (
            <div key={department.id} className="bg-white rounded-lg border">
              {/* Department Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleDepartment(department.id)}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {department.name}
                  </h3>
                  <Badge variant="secondary" className="ml-2">
                    {equipment.length}{" "}
                    {equipment.length === 1 ? "item" : "items"}
                  </Badge>
                  {department.id === userDepartmentId && (
                    <Badge variant="default" className="ml-1">
                      Your Department
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedDepartments.has(department.id)
                    ? "Collapse"
                    : "Expand"}
                </Button>
              </div>

              {/* Equipment Table */}
              {expandedDepartments.has(department.id) && (
                <>
                  <Separator />
                  <div className="p-4">
                    <DepartmentEquipmentTable
                      equipment={equipment}
                      columns={columns}
                      canEdit={canEdit}
                    />
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No equipment found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your filters or add some equipment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface DepartmentEquipmentTableProps {
  equipment: Equipment[];
  columns: ColumnDef<Equipment>[];
  canEdit: (equipment: Equipment) => boolean;
}

function DepartmentEquipmentTable({
  equipment,
  columns,
}: DepartmentEquipmentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: equipment,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 5, // Smaller page size for department tables
      },
    },
  });

  return (
    <div className="space-y-4">
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
                  className="h-24 text-center text-gray-500"
                >
                  No equipment in this department.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination for individual department table */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              equipment.length
            )}{" "}
            of {equipment.length} items
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
