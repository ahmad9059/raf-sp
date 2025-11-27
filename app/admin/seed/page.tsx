"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createFoodScienceEquipment } from "@/actions/food-science-equipment";
import { useToast } from "@/hooks/use-toast";

const foodScienceEquipmentData = [
  // Value Addition and Food Analysis Lab - Room # 127 Academic Block
  {
    name: "Kjeldhal Apparatus Digestion unit and Distillation unit",
    type: "Analytical Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Value Addition and Food Analysis Lab",
    roomNumber: "127",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Water Activity meter",
    type: "Analytical Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Value Addition and Food Analysis Lab",
    roomNumber: "127",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Soxhlet Apparatus",
    type: "Analytical Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Value Addition and Food Analysis Lab",
    roomNumber: "127",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Analytical Weighing Balance",
    type: "Analytical Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Value Addition and Food Analysis Lab",
    roomNumber: "127",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Autoclave",
    type: "Sterilization Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Value Addition and Food Analysis Lab",
    roomNumber: "127",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Texture Analyzer",
    type: "Testing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Value Addition and Food Analysis Lab",
    roomNumber: "127",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Freeze Dryer",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Value Addition and Food Analysis Lab",
    roomNumber: "127",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Pulse Electric Field",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Value Addition and Food Analysis Lab",
    roomNumber: "127",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Ozonation chamber",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Value Addition and Food Analysis Lab",
    roomNumber: "127",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Pasteurizer",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Value Addition and Food Analysis Lab",
    roomNumber: "127",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Fermenter",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Value Addition and Food Analysis Lab",
    roomNumber: "127",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  // Nutrient Analytical & Food Processing Lab - Room # 114-115 Postgraduate Block
  {
    name: "Kjeldhal Apparatus",
    type: "Analytical Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Digestion unit and Distillation unit",
    type: "Analytical Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Moisture Analyzer",
    type: "Analytical Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Soxhlet Apparatus",
    type: "Analytical Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Analytical Weighing Balance",
    type: "Analytical Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Muffle Furnace",
    type: "Heating Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Viscometer",
    type: "Testing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Farinograph",
    type: "Testing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Fume Hood",
    type: "Safety Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Desiccator",
    type: "Storage Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Gerber machine",
    type: "Testing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Rose head machine",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Abrasive peeler",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Refrigerator",
    type: "Storage Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "China Chakki",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Grinder",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Cheese press",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Cheese vat",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
  {
    name: "Cream separator",
    type: "Processing Equipment",
    status: "FUNCTIONAL",
    imageUrl: null,
    labSectionName: "Nutrient Analytical & Food Processing Lab",
    roomNumber: "114-115",
    quantity: 1,
    focalPerson: "Dr. Shabbir Ahmad",
  },
];

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const handleSeedFoodScience = async () => {
    setIsLoading(true);
    try {
      const result = await createFoodScienceEquipment(foodScienceEquipmentData);

      if (result.success) {
        success(
          result.message || "Food Science equipment seeded successfully!"
        );
      } else {
        error(result.message || "Failed to seed equipment");
      }
    } catch (err) {
      error("An error occurred while seeding equipment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Database Seeding
        </h1>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">
            Food Science & Technology Equipment
          </h2>
          <p className="text-gray-600 mb-6">
            This will add {foodScienceEquipmentData.length} equipment items to
            the Food Science & Technology department.
          </p>

          <Button
            onClick={handleSeedFoodScience}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Seeding..." : "Seed Food Science Equipment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
