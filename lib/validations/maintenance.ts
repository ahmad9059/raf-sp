import { z } from "zod";

export const maintenanceLogSchema = z.object({
  equipmentId: z.string().min(1, "Equipment ID is required"),
  date: z
    .date({
      message: "Invalid date",
    })
    .refine((date) => date <= new Date(), {
      message: "Maintenance date cannot be in the future",
    }),
  cost: z
    .number({
      message: "Cost must be a valid number",
    })
    .min(0, "Cost cannot be negative")
    .max(999999.99, "Cost is too large"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
});

export type MaintenanceLogInput = z.infer<typeof maintenanceLogSchema>;
