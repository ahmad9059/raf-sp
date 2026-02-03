"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateFoodScienceEquipment, useUpdateFoodScienceEquipment, type FoodScienceEquipment } from "@/hooks/use-food-science";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  labSectionName: z.string().optional().nullable(),
  roomNumber: z.string().optional().nullable(),
  quantity: z.number().int().min(1),
  focalPerson: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]),
});

// Define FormData type explicitly to match expected input
interface FormData {
  name: string;
  type: string;
  labSectionName?: string | null;
  roomNumber?: string | null;
  quantity: number;
  focalPerson?: string | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
}

interface FoodScienceFormProps {
  equipment?: FoodScienceEquipment | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const typeOptions = [
  "Analytical Equipment",
  "Measuring Equipment",
  "Processing Equipment",
  "Storage Equipment",
  "Safety Equipment",
  "Glassware",
  "Instruments",
  "Other",
];

const labSectionOptions = [
  "Food Chemistry Lab",
  "Microbiology Lab",
  "Sensory Lab",
  "Processing Lab",
  "Quality Control Lab",
  "Research Lab",
  "General Lab",
  "Storage",
  "Other",
];

export function FoodScienceForm({ equipment, onSuccess, onCancel }: FoodScienceFormProps) {
  const createMutation = useCreateFoodScienceEquipment();
  const updateMutation = useUpdateFoodScienceEquipment();
  const isEditing = !!equipment;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: equipment?.name || "",
      type: equipment?.type || "",
      labSectionName: equipment?.labSectionName || "",
      roomNumber: equipment?.roomNumber || "",
      quantity: equipment?.quantity ?? 1,
      focalPerson: equipment?.focalPerson || "",
      status: equipment?.status || "AVAILABLE",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && equipment) {
        await updateMutation.mutateAsync({ id: equipment.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess?.();
    } catch {
      // Error is handled by the mutation
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter equipment name" {...field} />
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
                <FormLabel>Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {typeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="labSectionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lab Section</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lab section" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {labSectionOptions.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
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
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter room number" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="focalPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Focal Person</FormLabel>
                <FormControl>
                  <Input placeholder="Enter focal person name" {...field} value={field.value || ""} />
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
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="IN_USE">In Use</SelectItem>
                    <SelectItem value="NEEDS_REPAIR">Needs Repair</SelectItem>
                    <SelectItem value="DISCARDED">Discarded</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Equipment" : "Create Equipment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
