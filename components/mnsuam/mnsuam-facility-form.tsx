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
import { useCreateMNSUAMFacility, useUpdateMNSUAMFacility, type MNSUAMFacility } from "@/hooks/use-mnsuam";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  blockName: z.string().optional().nullable(),
  facilityType: z.string().optional().nullable(),
  capacityPersons: z.number().int().nullable().optional(),
  capacityLabel: z.string().optional().nullable(),
  displayOrder: z.number().int().nullable().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]),
});

type FormData = z.infer<typeof formSchema>;

interface MNSUAMFacilityFormProps {
  facility?: MNSUAMFacility | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const facilityTypeOptions = [
  "Conference Room",
  "Lecture Hall",
  "Laboratory",
  "Office",
  "Auditorium",
  "Library",
  "Cafeteria",
  "Sports Facility",
  "Hostel",
  "Guest House",
  "Parking",
  "Other",
];

const typeOptions = [
  "Building",
  "Room",
  "Hall",
  "Ground",
  "Facility",
  "Infrastructure",
  "Other",
];

const blockOptions = [
  "Block A",
  "Block B",
  "Block C",
  "Block D",
  "Main Building",
  "Admin Block",
  "Academic Block",
  "Research Block",
  "Other",
];

export function MNSUAMFacilityForm({ facility, onSuccess, onCancel }: MNSUAMFacilityFormProps) {
  const createMutation = useCreateMNSUAMFacility();
  const updateMutation = useUpdateMNSUAMFacility();
  const isEditing = !!facility;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: facility?.name || "",
      type: facility?.type || "",
      blockName: facility?.blockName || "",
      facilityType: facility?.facilityType || "",
      capacityPersons: facility?.capacityPersons ?? null,
      capacityLabel: facility?.capacityLabel || "",
      displayOrder: facility?.displayOrder ?? null,
      status: facility?.status || "AVAILABLE",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && facility) {
        await updateMutation.mutateAsync({ id: facility.id, data });
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
                  <Input placeholder="Enter facility name" {...field} />
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
            name="blockName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Block Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select block" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {blockOptions.map((block) => (
                      <SelectItem key={block} value={block}>
                        {block}
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
            name="facilityType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {facilityTypeOptions.map((type) => (
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
            name="capacityPersons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity (Persons)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter capacity"
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
            name="capacityLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity Label</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., seats, persons, vehicles"
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
            name="displayOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Order for display"
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
            {isPending ? "Saving..." : isEditing ? "Update Facility" : "Create Facility"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
