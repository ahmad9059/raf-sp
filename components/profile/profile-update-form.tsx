"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/actions/profile";
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/validations/profile";

interface ProfileUpdateFormProps {
  initialData: {
    name: string;
    email: string;
  };
  onSuccess?: () => void;
}

export function ProfileUpdateForm({
  initialData,
  onSuccess,
}: ProfileUpdateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
    },
  });

  const onSubmit = async (data: ProfileUpdateInput) => {
    setIsLoading(true);

    try {
      const result = await updateUserProfile(data);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        onSuccess?.();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });

        // Handle field-specific errors
        if (result.data) {
          Object.entries(result.data).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              form.setError(field as keyof ProfileUpdateInput, {
                message: messages[0],
              });
            }
          });
        }
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
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your full name"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
          Update Profile
        </Button>
      </form>
    </Form>
  );
}
