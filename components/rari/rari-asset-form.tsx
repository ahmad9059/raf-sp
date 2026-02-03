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
import { useCreateRARIAsset, useUpdateRARIAsset, type RARIAsset } from "@/hooks/use-rari";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional(),
  makeModelYear: z.string().nullable().optional(),
  quantity: z.number().int().nullable().optional(),
  conditionStatus: z.string().nullable().optional(),
  useApplication: z.string().nullable().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]),
});

type FormData = z.infer<typeof formSchema>;

interface RARIAssetFormProps {
  asset?: RARIAsset | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categoryOptions = [
  "Laboratory Equipment",
  "Office Equipment",
  "Field Equipment",
  "Research Equipment",
  "Furniture",
  "IT Equipment",
  "Vehicles",
  "Agricultural Machinery",
  "Irrigation Equipment",
  "Other",
];

const typeOptions = [
  "Machinery",
  "Equipment",
  "Furniture",
  "Vehicle",
  "Electronics",
  "Instruments",
  "Tools",
  "Tractor",
  "Harvester",
  "Sprayer",
  "Other",
];

const conditionOptions = [
  "Excellent",
  "Good",
  "Fair",
  "Poor",
  "Needs Repair",
  "Non-Functional",
];

export function RARIAssetForm({ asset, onSuccess, onCancel }: RARIAssetFormProps) {
  const createMutation = useCreateRARIAsset();
  const updateMutation = useUpdateRARIAsset();
  const isEditing = !!asset;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: asset?.name || "",
      type: asset?.type || "",
      category: asset?.category || "",
      makeModelYear: asset?.makeModelYear ?? null,
      quantity: asset?.quantity ?? null,
      conditionStatus: asset?.conditionStatus ?? null,
      useApplication: asset?.useApplication ?? null,
      status: asset?.status || "AVAILABLE",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && asset) {
        await updateMutation.mutateAsync({ id: asset.id, data });
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
                  <Input placeholder="Enter asset name" {...field} />
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
            name="makeModelYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make/Model/Year</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., John Deere 5055E 2020"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
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
                <FormLabel>Quantity</FormLabel>
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
            name="conditionStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {conditionOptions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
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
          name="useApplication"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Use/Application</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the use or application of this asset"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
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
            {isPending ? "Saving..." : isEditing ? "Update Asset" : "Create Asset"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
