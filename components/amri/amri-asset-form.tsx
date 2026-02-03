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
import { useCreateAMRIAsset, useUpdateAMRIAsset, type AMRIAsset } from "@/hooks/use-amri";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  assetCategory: z.string().optional().nullable(),
  itemDescription: z.string().optional().nullable(),
  quantityOrArea: z.string().optional().nullable(),
  functionalStatus: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]),
});

type FormData = z.infer<typeof formSchema>;

interface AMRIAssetFormProps {
  asset?: AMRIAsset | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categoryOptions = [
  "Agricultural Machinery",
  "Farm Equipment",
  "Tractors",
  "Harvesters",
  "Irrigation Equipment",
  "Processing Equipment",
  "Laboratory Equipment",
  "Office Equipment",
  "Vehicles",
  "Tools",
  "Other",
];

const typeOptions = [
  "Machinery",
  "Equipment",
  "Vehicle",
  "Instrument",
  "Tool",
  "Tractor",
  "Harvester",
  "Pump",
  "Sprayer",
  "Other",
];

const functionalStatusOptions = [
  "Operational",
  "Non-Operational",
  "Under Repair",
  "Requires Maintenance",
  "New",
  "Good Condition",
  "Fair Condition",
  "Poor Condition",
];

export function AMRIAssetForm({ asset, onSuccess, onCancel }: AMRIAssetFormProps) {
  const createMutation = useCreateAMRIAsset();
  const updateMutation = useUpdateAMRIAsset();
  const isEditing = !!asset;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: asset?.name || "",
      type: asset?.type || "",
      assetCategory: asset?.assetCategory || "",
      itemDescription: asset?.itemDescription || "",
      quantityOrArea: asset?.quantityOrArea || "",
      functionalStatus: asset?.functionalStatus || "",
      remarks: asset?.remarks || "",
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
            name="assetCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
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
            name="quantityOrArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity/Area</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 5 units, 10 acres" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="functionalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Functional Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select functional status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {functionalStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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
          name="itemDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter detailed description of the asset"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional remarks or notes"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
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
