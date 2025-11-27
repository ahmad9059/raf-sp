"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  departmentSchema,
  type DepartmentInput,
} from "@/lib/validations/department";
import { createDepartment, updateDepartment } from "@/actions/department";
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
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/equipment/image-upload";

interface DepartmentFormProps {
  department?: {
    id: string;
    name: string;
    location: string;
    logo?: string | null;
  };
  onSuccess?: () => void;
}

export function DepartmentForm({ department, onSuccess }: DepartmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<DepartmentInput>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name || "",
      location: department?.location || "",
      logo: department?.logo || "",
    },
  });

  async function onSubmit(data: DepartmentInput) {
    setIsLoading(true);

    try {
      const result = department
        ? await updateDepartment(department.id, data)
        : await createDepartment(data);

      if (result.success) {
        toast({
          title: "Success",
          description:
            result.message ||
            `Department ${department ? "updated" : "created"} successfully`,
        });
        onSuccess?.();
      } else {
        toast({
          title: "Error",
          description: result.message || "Operation failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 lg:space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter department name"
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter department location"
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
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Logo (Optional)</FormLabel>
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

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 h-12 lg:h-10"
            disabled={isLoading}
          >
            {isLoading
              ? department
                ? "Updating..."
                : "Creating..."
              : department
              ? "Update Department"
              : "Create Department"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
