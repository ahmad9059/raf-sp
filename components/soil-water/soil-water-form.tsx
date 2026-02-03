"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useCreateSoilWaterProject, useUpdateSoilWaterProject, type SoilWaterProject } from "@/hooks/use-soil-water";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional(),
  bps: z.number().int().nullable().optional(),
  quantityRequired: z.number().int().nullable().optional(),
  budgetAllocationTotalMillion: z.number().nullable().optional(),
  justificationOrYear: z.string().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]),
});

type FormData = z.infer<typeof formSchema>;

interface SoilWaterFormProps {
  project?: SoilWaterProject | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categoryOptions = [
  "Soil Testing Equipment",
  "Water Analysis Equipment",
  "Laboratory Instruments",
  "Field Equipment",
  "Sampling Equipment",
  "Analytical Instruments",
  "Quality Control Equipment",
  "Other",
];

const typeOptions = [
  "Testing Equipment",
  "Laboratory Instrument",
  "Field Device",
  "Sampling Tool",
  "Analyzer",
  "Meter",
  "Sensor",
  "Other",
];

export function SoilWaterForm({ project, onSuccess, onCancel }: SoilWaterFormProps) {
  const createMutation = useCreateSoilWaterProject();
  const updateMutation = useUpdateSoilWaterProject();
  const isEditing = !!project;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name || "",
      type: project?.type || "",
      category: project?.category || "",
      bps: project?.bps ?? null,
      quantityRequired: project?.quantityRequired ?? null,
      budgetAllocationTotalMillion: project?.budgetAllocationTotalMillion ?? null,
      justificationOrYear: project?.justificationOrYear || "",
      status: project?.status || "AVAILABLE",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && project) {
        await updateMutation.mutateAsync({ id: project.id, data });
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
                  <Input placeholder="Enter project name" {...field} />
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
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
            name="bps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BPS</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="BPS"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantityRequired"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity Required</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budgetAllocationTotalMillion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (Million)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="Budget in millions"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
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

        <FormField
          control={form.control}
          name="justificationOrYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Justification/Year</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter justification or year details"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
