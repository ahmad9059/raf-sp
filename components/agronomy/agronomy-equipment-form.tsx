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
import {
  useCreateAgronomyEquipment,
  useUpdateAgronomyEquipment,
  type AgronomyEquipment,
} from "@/hooks/use-agronomy";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  quantity: z.number().int().min(1),
  focalPerson1: z.string().optional().nullable(),
  displayOrder: z.number().int().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]),
});

// Define FormData type explicitly to match expected input
interface FormData {
  name: string;
  type: string;
  quantity: number;
  focalPerson1?: string | null;
  displayOrder?: number | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
}

interface AgronomyEquipmentFormProps {
  equipment?: AgronomyEquipment | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const typeOptions = [
  "Analytical Instruments",
  "Balances & Scales",
  "Incubation",
  "Measurement Tools",
  "Meters & Sensors",
  "Microscopy",
  "Processing Equipment",
  "Separation",
  "Sterilization",
  "Support Equipment",
  "Water Systems",
  "Other",
];

export function AgronomyEquipmentForm({ equipment, onSuccess, onCancel }: AgronomyEquipmentFormProps) {
  const createMutation = useCreateAgronomyEquipment();
  const updateMutation = useUpdateAgronomyEquipment();
  const isEditing = !!equipment;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: equipment?.name || "",
      type: equipment?.type || "",
      quantity: equipment?.quantity ?? 1,
      focalPerson1: equipment?.focalPerson1 || "",
      displayOrder: equipment?.displayOrder ?? null,
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="focalPerson1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Focal Person</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter focal person name"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter display order"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? null : parseInt(val));
                    }}
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

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Equipment" : "Add Equipment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
