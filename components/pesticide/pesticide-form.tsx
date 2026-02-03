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
import { useCreatePesticideData, useUpdatePesticideData, type PesticideData } from "@/hooks/use-pesticide";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  sectionCategory: z.string().optional(),
  bpsScale: z.number().int().nullable().optional(),
  quantityOrSanctioned: z.number().int().nullable().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]),
});

type FormData = z.infer<typeof formSchema>;

interface PesticideFormProps {
  record?: PesticideData | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const sectionCategoryOptions = [
  "Pesticide Analysis",
  "Quality Control",
  "Research & Development",
  "Laboratory Equipment",
  "Field Equipment",
  "Office Equipment",
  "IT Equipment",
  "Furniture",
  "Vehicles",
  "Other",
];

const typeOptions = [
  "Laboratory Equipment",
  "Analytical Instrument",
  "Testing Equipment",
  "Sampling Equipment",
  "Safety Equipment",
  "Furniture",
  "Vehicle",
  "Electronics",
  "Tools",
  "Other",
];

export function PesticideForm({ record, onSuccess, onCancel }: PesticideFormProps) {
  const createMutation = useCreatePesticideData();
  const updateMutation = useUpdatePesticideData();
  const isEditing = !!record;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: record?.name || "",
      type: record?.type || "",
      sectionCategory: record?.sectionCategory || "",
      bpsScale: record?.bpsScale ?? null,
      quantityOrSanctioned: record?.quantityOrSanctioned ?? null,
      status: record?.status || "AVAILABLE",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && record) {
        await updateMutation.mutateAsync({ id: record.id, data });
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
                  <Input placeholder="Enter name" {...field} />
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
            name="sectionCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section/Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section/category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sectionCategoryOptions.map((cat) => (
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
            name="bpsScale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BPS Scale</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="BPS Scale"
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
            name="quantityOrSanctioned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity/Sanctioned</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Quantity or Sanctioned"
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

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Record" : "Create Record"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
