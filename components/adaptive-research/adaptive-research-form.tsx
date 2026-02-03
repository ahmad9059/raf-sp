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
  AdaptiveResearchPosition,
  useCreateAdaptiveResearchPosition,
  useUpdateAdaptiveResearchPosition,
} from "@/hooks/use-adaptive-research";

const formSchema = z.object({
  attachedDepartment: z.string().optional(),
  postName: z.string().min(1, "Post name is required"),
  bpsScale: z.string().min(1, "BPS scale is required"),
  sanctionedPosts: z.number().int().min(0, "Sanctioned posts is required"),
  filledPosts: z.number().int().min(0, "Filled posts is required"),
  vacantPosts: z.number().int().min(0, "Vacant posts is required"),
  promotionPosts: z.number().int().min(0, "Promotion quota is required"),
  initialRecruitmentPosts: z.number().int().min(0, "Initial recruitment quota is required"),
  remarks: z.string().optional(),
  orderNumber: z.number().int().min(0).nullable().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AdaptiveResearchFormProps {
  position?: AdaptiveResearchPosition | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AdaptiveResearchForm({ position, onSuccess, onCancel }: AdaptiveResearchFormProps) {
  const createMutation = useCreateAdaptiveResearchPosition();
  const updateMutation = useUpdateAdaptiveResearchPosition();
  const isEditing = !!position;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attachedDepartment: position?.attachedDepartment || "",
      postName: position?.postName || "",
      bpsScale: position?.bpsScale || "",
      sanctionedPosts: position?.sanctionedPosts ?? 0,
      filledPosts: position?.filledPosts ?? 0,
      vacantPosts: position?.vacantPosts ?? 0,
      promotionPosts: position?.promotionPosts ?? 0,
      initialRecruitmentPosts: position?.initialRecruitmentPosts ?? 0,
      remarks: position?.remarks || "",
      orderNumber: position?.orderNumber ?? null,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && position) {
        await updateMutation.mutateAsync({ id: position.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess?.();
    } catch {
      // handled in mutation
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="postName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Assistant Director (Farm)" {...field} />
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
                <FormLabel>BPS Scale *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. BPS-18" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attachedDepartment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attached Department</FormLabel>
                <FormControl>
                  <Input placeholder="Office / Autonomous body" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orderNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Optional"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? null : Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sanctionedPosts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sanctioned Posts *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="filledPosts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filled Posts *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vacantPosts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vacant Posts *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="promotionPosts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promotion Quota *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="initialRecruitmentPosts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Recruitment *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes, e.g. 'One vacant post is on LPR'"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create position"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
