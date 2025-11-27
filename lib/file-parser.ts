import Papa from "papaparse";
import { EquipmentStatus } from "@prisma/client";
import { equipmentSchema } from "./validations/equipment";

export interface ParsedEquipmentRow {
  name: string;
  type: string;
  status: EquipmentStatus;
  purchaseDate: Date;
  imageUrl?: string;
}

export interface ParseError {
  row: number;
  field?: string;
  message: string;
  rawData?: any;
}

export interface ParseResult {
  success: boolean;
  data: ParsedEquipmentRow[];
  errors: ParseError[];
  totalRows: number;
  validRows: number;
}

/**
 * Parse CSV file containing equipment data
 */
export async function parseCSVFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const errors: ParseError[] = [];
    const validData: ParsedEquipmentRow[] = [];
    let totalRows = 0;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        // Normalize header names to match our schema
        const normalized = header.toLowerCase().trim();
        switch (normalized) {
          case "equipment name":
          case "name":
            return "name";
          case "equipment type":
          case "type":
            return "type";
          case "status":
          case "equipment status":
            return "status";
          case "purchase date":
          case "purchasedate":
          case "date purchased":
            return "purchaseDate";
          case "image url":
          case "imageurl":
          case "image":
            return "imageUrl";
          default:
            return normalized;
        }
      },
      complete: (results) => {
        totalRows = results.data.length;

        results.data.forEach((row: any, index: number) => {
          try {
            const parsedRow = parseEquipmentRow(row, index + 1);
            if (parsedRow.success && parsedRow.data) {
              validData.push(parsedRow.data);
            } else {
              errors.push(...parsedRow.errors);
            }
          } catch (error) {
            errors.push({
              row: index + 1,
              message: `Unexpected error parsing row: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
              rawData: row,
            });
          }
        });

        resolve({
          success: errors.length === 0,
          data: validData,
          errors,
          totalRows,
          validRows: validData.length,
        });
      },
      error: (error) => {
        resolve({
          success: false,
          data: [],
          errors: [
            {
              row: 0,
              message: `CSV parsing failed: ${error.message}`,
            },
          ],
          totalRows: 0,
          validRows: 0,
        });
      },
    });
  });
}

/**
 * Parse a single equipment row and validate it
 */
function parseEquipmentRow(
  row: any,
  rowNumber: number
): { success: boolean; data?: ParsedEquipmentRow; errors: ParseError[] } {
  const errors: ParseError[] = [];

  try {
    // Clean and prepare the data
    const cleanedRow = {
      name: String(row.name || "").trim(),
      type: String(row.type || "").trim(),
      status: normalizeStatus(String(row.status || "").trim()),
      purchaseDate: parseDate(row.purchaseDate),
      imageUrl: row.imageUrl ? String(row.imageUrl).trim() : undefined,
    };

    // Validate using Zod schema (excluding departmentId as it will be added later)
    const validationSchema = equipmentSchema.omit({ departmentId: true });
    const result = validationSchema.safeParse(cleanedRow);

    if (!result.success) {
      result.error.issues.forEach((error) => {
        errors.push({
          row: rowNumber,
          field: error.path.join("."),
          message: error.message,
          rawData: row,
        });
      });
      return { success: false, errors };
    }

    return {
      success: true,
      data: result.data as ParsedEquipmentRow,
      errors: [],
    };
  } catch (error) {
    errors.push({
      row: rowNumber,
      message: `Row validation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      rawData: row,
    });
    return { success: false, errors };
  }
}

/**
 * Normalize status string to EquipmentStatus enum
 */
function normalizeStatus(status: string): EquipmentStatus {
  const normalized = status.toLowerCase().replace(/[^a-z]/g, "");

  switch (normalized) {
    case "available":
    case "active":
    case "ready":
      return EquipmentStatus.AVAILABLE;
    case "inuse":
    case "used":
    case "occupied":
    case "busy":
      return EquipmentStatus.IN_USE;
    case "needsrepair":
    case "repair":
    case "broken":
    case "maintenance":
      return EquipmentStatus.NEEDS_REPAIR;
    case "discarded":
    case "disposed":
    case "retired":
    case "scrapped":
      return EquipmentStatus.DISCARDED;
    default:
      throw new Error(`Invalid status: ${status}`);
  }
}

/**
 * Parse date from various formats
 */
function parseDate(dateValue: any): Date {
  if (!dateValue) {
    throw new Error("Purchase date is required");
  }

  // If already a Date object
  if (dateValue instanceof Date) {
    return dateValue;
  }

  // Try parsing string dates
  const dateString = String(dateValue).trim();

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }

  // Check if date is reasonable (not in future, not too old)
  const now = new Date();
  const minDate = new Date("1900-01-01");

  if (date > now) {
    throw new Error("Purchase date cannot be in the future");
  }

  if (date < minDate) {
    throw new Error("Purchase date is too old");
  }

  return date;
}

/**
 * Generate a CSV template for equipment import
 */
export function generateCSVTemplate(): string {
  const headers = ["name", "type", "status", "purchaseDate", "imageUrl"];
  const sampleData = [
    "Tractor Model X",
    "Heavy Machinery",
    "AVAILABLE",
    "2023-01-15",
    "https://example.com/tractor.jpg",
    "Irrigation Pump",
    "Water Equipment",
    "IN_USE",
    "2022-06-20",
    "",
    "Harvester Combine",
    "Heavy Machinery",
    "NEEDS_REPAIR",
    "2021-03-10",
    "https://example.com/harvester.jpg",
  ];

  let csv = headers.join(",") + "\n";

  // Add sample rows
  for (let i = 0; i < sampleData.length; i += headers.length) {
    const row = sampleData.slice(i, i + headers.length);
    csv += row.map((field) => `"${field}"`).join(",") + "\n";
  }

  return csv;
}
