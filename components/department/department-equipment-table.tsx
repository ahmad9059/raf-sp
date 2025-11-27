"use client";

import { useState, useEffect } from "react";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, EquipmentStatus } from "@/components/ui/status-badge";
import {
  getDepartmentEquipment,
  getDepartmentBySlug,
} from "@/actions/department-equipment";

interface DepartmentEquipmentTableProps {
  departmentId: string;
  tableType: string;
}

const getTableColumns = (tableType: string) => {
  switch (tableType) {
    case "FoodAnalysisLabEquipment":
      return [
        { key: "name", label: "Equipment Name" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
        { key: "labSectionName", label: "Lab Section" },
        { key: "roomNumber", label: "Room" },
        { key: "quantity", label: "Quantity" },
        { key: "focalPerson", label: "Focal Person" },
      ];
    case "AgronomyLabEquipment":
      return [
        { key: "name", label: "Equipment Name" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
        { key: "quantity", label: "Quantity" },
        { key: "focalPerson1", label: "Focal Person 1" },
        { key: "focalPerson2", label: "Focal Person 2" },
      ];
    case "MRIAssets":
      return [
        { key: "name", label: "Asset Name" },
        { key: "type", label: "Category" },
        { key: "status", label: "Status" },
        { key: "totalQuantityOrPosts", label: "Total Qty" },
        { key: "filledOrFunctional", label: "Functional" },
        { key: "vacantOrNonFunctional", label: "Non-Functional" },
        { key: "remarksOrLocation", label: "Location" },
      ];
    case "AMRIInventory":
      return [
        { key: "name", label: "Item Name" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
        { key: "assetCategory", label: "Category" },
        { key: "quantityOrArea", label: "Quantity/Area" },
        { key: "functionalStatus", label: "Functional Status" },
        { key: "remarks", label: "Remarks" },
      ];
    case "FloricultureStationAssets":
      return [
        { key: "name", label: "Asset Name" },
        { key: "type", label: "Category" },
        { key: "status", label: "Status" },
        { key: "sanctionedQty", label: "Sanctioned" },
        { key: "inPositionQty", label: "In Position" },
        { key: "detailsOrArea", label: "Details/Area" },
      ];
    case "SoilWaterTestingProject":
      return [
        { key: "name", label: "Item Description" },
        { key: "type", label: "Category" },
        { key: "status", label: "Status" },
        { key: "quantityRequired", label: "Qty Required" },
        { key: "budgetAllocationTotalMillion", label: "Budget (Million)" },
        { key: "justificationOrYear", label: "Year" },
      ];
    case "ERSSStockRegister":
      return [
        { key: "name", label: "Item Name" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
        { key: "quantityStr", label: "Quantity" },
        { key: "dateReceived", label: "Date Received" },
        { key: "currentStatusRemarks", label: "Remarks" },
      ];
    case "MNSUAMEstateFacilities":
      return [
        { key: "name", label: "Facility Name" },
        { key: "type", label: "Facility Type" },
        { key: "status", label: "Status" },
        { key: "blockName", label: "Block" },
        { key: "capacityPersons", label: "Capacity" },
      ];
    case "CRIMultanAssets":
      return [
        { key: "name", label: "Item Name" },
        { key: "type", label: "Asset Type" },
        { key: "status", label: "Status" },
        { key: "specificationModel", label: "Specification" },
        { key: "labSectionLocation", label: "Location" },
        { key: "quantity", label: "Quantity" },
        { key: "purposeFunction", label: "Purpose" },
      ];
    case "RARIBahawalpurAssets":
      return [
        { key: "name", label: "Item Name" },
        { key: "type", label: "Category" },
        { key: "status", label: "Status" },
        { key: "makeModelYear", label: "Make/Model/Year" },
        { key: "quantity", label: "Quantity" },
        { key: "conditionStatus", label: "Condition" },
        { key: "useApplication", label: "Application" },
      ];
    default:
      return [
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
      ];
  }
};

const normalizeStatus = (status: string): EquipmentStatus => {
  const upperStatus = status.toUpperCase();
  switch (upperStatus) {
    case "FUNCTIONAL":
    case "WORKING":
      return "AVAILABLE";
    case "NON_FUNCTIONAL":
    case "NOT_WORKING":
    case "OUT_OF_ORDER":
      return "NEEDS_REPAIR";
    case "PLANNED":
      return "IN_USE";
    case "AVAILABLE":
    case "IN_USE":
    case "NEEDS_REPAIR":
    case "DISCARDED":
      return upperStatus as EquipmentStatus;
    default:
      return "AVAILABLE";
  }
};

export function DepartmentEquipmentTable({
  departmentId,
  tableType,
}: DepartmentEquipmentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentData, setEquipmentData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualDepartmentId, setActualDepartmentId] = useState<string>("");

  // Fetch department ID and equipment data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First get the actual department ID from the database
        const deptResult = await getDepartmentBySlug(departmentId);

        if (!deptResult.success || !deptResult.data) {
          setError("Department not found");
          return;
        }

        const actualDeptId = deptResult.data.id;
        setActualDepartmentId(actualDeptId);

        // Then fetch equipment data
        const equipmentResult = await getDepartmentEquipment(
          actualDeptId,
          tableType
        );

        if (equipmentResult.success && equipmentResult.data) {
          setEquipmentData(equipmentResult.data);
        } else {
          setEquipmentData([]);
        }
      } catch (err) {
        console.error("Failed to fetch equipment:", err);
        setError("Failed to load equipment data");
        setEquipmentData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [departmentId, tableType]);

  const columns = getTableColumns(tableType);
  const filteredData = equipmentData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-6 h-6 text-[#2678E7]" />
          <h2 className="text-xl font-semibold text-gray-900">
            Equipment Details
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500">Loading equipment data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-6 h-6 text-[#2678E7]" />
          <h2 className="text-xl font-semibold text-gray-900">
            Equipment Details
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Package className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-[#2678E7]" />
        <h2 className="text-xl font-semibold text-gray-900">
          Equipment Details
        </h2>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className="whitespace-nowrap">
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className="whitespace-nowrap">
                        {column.key === "status" ? (
                          <StatusBadge
                            status={normalizeStatus(
                              item[column.key as keyof typeof item] as string
                            )}
                          />
                        ) : column.key === "dateReceived" &&
                          item[column.key] ? (
                          <span>
                            {new Date(item[column.key]).toLocaleDateString()}
                          </span>
                        ) : (
                          <span>
                            {item[column.key as keyof typeof item] || "N/A"}
                          </span>
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
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">No equipment found</p>
                      {searchTerm && (
                        <p className="text-sm text-gray-400">
                          Try adjusting your search terms
                        </p>
                      )}
                      {!searchTerm && (
                        <p className="text-sm text-gray-400">
                          Equipment data will appear here once added to the
                          database
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Table Info */}
      {filteredData.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredData.length} of {equipmentData.length} equipment
          items
        </div>
      )}
    </div>
  );
}
