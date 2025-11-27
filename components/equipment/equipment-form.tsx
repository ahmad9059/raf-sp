"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { EquipmentStatus } from "@prisma/client";
import {
  equipmentSchema,
  type EquipmentInput,
} from "@/lib/validations/equipment";
import { useCreateEquipment, useUpdateEquipment } from "@/hooks/use-equipment";
import { useDepartments } from "@/hooks/use-departments";
import { getDepartments } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./image-upload";

interface EquipmentFormProps {
  equipment?: {
    id: string;
    name: string;
    type: string;
    status: EquipmentStatus;
    purchaseDate: Date;
    imageUrl?: string | null;
    departmentId: string;
  };
  onSuccess?: () => void;
  userRole?: string;
  userDepartmentId?: string;
}

const statusLabels: Record<EquipmentStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  NEEDS_REPAIR: "Needs Repair",
  DISCARDED: "Discarded",
};

const statusColors: Record<EquipmentStatus, string> = {
  AVAILABLE: "text-green-600",
  IN_USE: "text-blue-600",
  NEEDS_REPAIR: "text-yellow-600",
  DISCARDED: "text-gray-600",
};

export function EquipmentForm({
  equipment,
  onSuccess,
  userRole,
  userDepartmentId,
}: EquipmentFormProps) {
  const [departments, setDepartments] = useState<
    Array<{ id: string; name: string; location: string }>
  >([]);

  // Use the custom hooks
  const createMutation = useCreateEquipment();
  const updateMutation = useUpdateEquipment();
  const { data: departmentsData } = useDepartments();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const form = useForm<EquipmentInput>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: equipment?.name || "",
      type: equipment?.type || "",
      status: equipment?.status || EquipmentStatus.AVAILABLE,
      purchaseDate: equipment?.purchaseDate || new Date(),
      imageUrl: equipment?.imageUrl || "",
      departmentId: equipment?.departmentId || userDepartmentId || "",
    },
  });

  useEffect(() => {
    if (departmentsData) {
      setDepartments(departmentsData);
    } else {
      // Fallback to the old method if the hook doesn't work
      async function loadDepartments() {
        const result = await getDepartments();
        if (result.success && result.data) {
          setDepartments(result.data);
        }
      }
      loadDepartments();
    }
  }, [departmentsData]);

  async function onSubmit(data: EquipmentInput) {
    if (equipment) {
      updateMutation.mutate(
        { id: equipment.id, data },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onSuccess?.();
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter equipment name"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Tractor, Harvester, Sprayer"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      <span className={statusColors[value as EquipmentStatus]}>
                        {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchaseDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Purchase Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {(!equipment || userRole === "ADMIN") && departments.length > 0 && (
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={
                    isLoading || (userRole === "DEPT_HEAD" && !!equipment)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} - {dept.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Image (Optional)</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading
              ? equipment
                ? "Updating..."
                : "Creating..."
              : equipment
              ? "Update Equipment"
              : "Create Equipment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
