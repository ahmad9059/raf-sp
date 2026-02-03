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
import { useCreateFloricultureAsset, useUpdateFloricultureAsset, type FloricultureAsset } from "@/hooks/use-floriculture";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional(),
  itemNameOrPost: z.string().optional(),
  bpsScale: z.string().nullable().optional(),
  sanctionedQty: z.number().int().nullable().optional(),
  inPositionQty: z.number().int().nullable().optional(),
  detailsOrArea: z.string().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]),
});

type FormData = z.infer<typeof formSchema>;

interface FloricultureFormProps {
  asset?: FloricultureAsset | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categoryOptions = [
  "Plants & Flowers",
  "Nursery Equipment",
  "Greenhouse Equipment",
  "Irrigation Equipment",
  "Laboratory Equipment",
  "Office Equipment",
  "Field Equipment",
  "Furniture",
  "IT Equipment",
  "Vehicles",
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
  "Plants",
  "Infrastructure",
  "Other",
];

export function FloricultureForm({ asset, onSuccess, onCancel }: FloricultureFormProps) {
  const createMutation = useCreateFloricultureAsset();
  const updateMutation = useUpdateFloricultureAsset();
  const isEditing = !!asset;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: asset?.name || "",
      type: asset?.type || "",
      category: asset?.category || "",
      itemNameOrPost: asset?.itemNameOrPost || "",
      bpsScale: asset?.bpsScale ?? null,
      sanctionedQty: asset?.sanctionedQty ?? null,
      inPositionQty: asset?.inPositionQty ?? null,
      detailsOrArea: asset?.detailsOrArea || "",
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
            name="itemNameOrPost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name/Post</FormLabel>
                <FormControl>
                  <Input placeholder="Item name or post" {...field} />
                </FormControl>
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
                    placeholder="BPS Scale"
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
            name="sanctionedQty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sanctioned Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Sanctioned"
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
            name="inPositionQty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>In Position Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="In Position"
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
          name="detailsOrArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details/Area</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter details or area information"
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
            {isPending ? "Saving..." : isEditing ? "Update Asset" : "Create Asset"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
