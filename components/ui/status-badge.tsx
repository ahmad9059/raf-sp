import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type EquipmentStatus =
  | "AVAILABLE"
  | "IN_USE"
  | "NEEDS_REPAIR"
  | "DISCARDED";

interface StatusBadgeProps {
  status: EquipmentStatus;
  className?: string;
}

const statusConfig = {
  AVAILABLE: {
    label: "Available",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  IN_USE: {
    label: "In Use",
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  NEEDS_REPAIR: {
    label: "Needs Repair",
    variant: "destructive" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  DISCARDED: {
    label: "Discarded",
    variant: "outline" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
