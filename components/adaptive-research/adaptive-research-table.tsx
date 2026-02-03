"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Search, Trash2 } from "lucide-react";
import { AdaptiveResearchPosition } from "@/hooks/use-adaptive-research";
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
import { Badge } from "@/components/ui/badge";

interface AdaptiveResearchTableProps {
  data: AdaptiveResearchPosition[];
  onEdit: (position: AdaptiveResearchPosition) => void;
  onDelete: (id: string) => void;
}

export function AdaptiveResearchTable({ data, onEdit, onDelete }: AdaptiveResearchTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    const term = globalFilter.toLowerCase();
    return data.filter((item) => {
      return (
        item.postName.toLowerCase().includes(term) ||
        item.bpsScale.toLowerCase().includes(term) ||
        (item.attachedDepartment?.toLowerCase() || "").includes(term)
      );
    });
  }, [data, globalFilter]);

  const columns: ColumnDef<AdaptiveResearchPosition>[] = [
    {
      header: "#",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.orderNumber ?? row.index + 1}
        </span>
      ),
      size: 40,
    },
    {
      accessorKey: "postName",
      header: "Post",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium text-slate-900">{row.original.postName}</div>
          {row.original.attachedDepartment && (
            <div className="text-xs text-muted-foreground">
              {row.original.attachedDepartment}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "bpsScale",
      header: "BPS",
      cell: ({ row }) => <Badge variant="outline">{row.original.bpsScale}</Badge>,
    },
    {
      accessorKey: "sanctionedPosts",
      header: "Sanctioned",
      cell: ({ row }) => <span className="font-semibold">{row.original.sanctionedPosts}</span>,
    },
    {
      accessorKey: "filledPosts",
      header: "Filled",
      cell: ({ row }) => (
        <span className="text-green-700 font-semibold">{row.original.filledPosts}</span>
      ),
    },
    {
      accessorKey: "vacantPosts",
      header: "Vacant",
      cell: ({ row }) => (
        <span
          className={
            row.original.vacantPosts > 0
              ? "text-red-600 font-semibold"
              : "text-muted-foreground font-semibold"
          }
        >
          {row.original.vacantPosts}
        </span>
      ),
    },
    {
      accessorKey: "promotionPosts",
      header: "Promotion",
      cell: ({ row }) => row.original.promotionPosts,
    },
    {
      accessorKey: "initialRecruitmentPosts",
      header: "Initial Recruitment",
      cell: ({ row }) => row.original.initialRecruitmentPosts,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
            aria-label="Edit position"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <ConfirmationDialog
            title="Delete position"
            description={`Are you sure you want to delete "${row.original.postName}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={() => onDelete(row.original.id)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              aria-label="Delete position"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </ConfirmationDialog>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts or BPS..."
            className="pl-9"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length} records
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50/70">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No positions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
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

    </div>
  );
}
