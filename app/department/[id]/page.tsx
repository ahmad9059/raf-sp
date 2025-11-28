"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Eye,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "@/components/ui/loading-spinner";
import { DepartmentDashboard } from "@/components/department/department-dashboard";
import { DepartmentEquipmentTable } from "@/components/department/department-equipment-table";

// Profile Picture Component
interface ProfilePictureProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
}

function ProfilePicture({ src, alt, size = "md" }: ProfilePictureProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  // Generate initials from the name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-200 shadow-sm`}
      >
        <Image
          src={src}
          alt={alt}
          width={size === "lg" ? 96 : size === "md" ? 64 : 48}
          height={size === "lg" ? 96 : size === "md" ? 64 : 48}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Default avatar with initials when no image is provided
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#2678E7] to-[#1e5bb8] flex items-center justify-center border-2 border-gray-200 shadow-sm`}
    >
      <span className={`${textSizeClasses[size]} font-semibold text-white`}>
        {getInitials(alt)}
      </span>
    </div>
  );
}

// Department data (in a real app, this would come from an API)
const departmentData = {
  "food-science-technology": {
    id: "food-science-technology",
    name: "Food Science and Technology",
    location: "MNS University of Agriculture, Multan",
    description:
      "Focuses on the science of food, from production to consumption, including food safety, nutrition, and processing technologies.",
    focalPerson: "Dr. Shabbir Ahmad",
    designation: "Professor & Head",
    phone: "+92-61-9210071",
    email: "shabbir.ahmad@mnsuam.edu.pk",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80", // Sample profile image
    hasData: true,
    tableType: "FoodAnalysisLabEquipment",
  },
  agronomy: {
    id: "agronomy",
    name: "Agronomy Department",
    location: "MNS University of Agriculture, Multan",
    description:
      "Specializes in crop production, soil management, and sustainable farming practices for improved agricultural productivity.",
    focalPerson: "Dr. Mahmood Alam",
    designation: "Professor",
    phone: "+92-61-9210072",
    email: "mahmood.alam@mnsuam.edu.pk",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    hasData: true,
    tableType: "AgronomyLabEquipment",
  },
  "bhawalpur-agri": {
    id: "bhawalpur-agri",
    name: "Regional Agricultural Research Institute (RARI), Bahawalpur",
    location: "IUB - The Islamia University of Bahawalpur",
    description:
      "Research and development in ornamental plants, landscaping, and floriculture production techniques.",
    focalPerson: "Dr. Asif Ali",
    designation: "Research Officer",
    phone: "+92-61-9210073",
    email: "asif.ali@mnsuam.edu.pk",
    profileImage: null,
    hasData: true,
    tableType: "RARIBahawalpurAssets",
  },
  "mango-research": {
    id: "mango-research",
    name: "Mango Research Institute",
    location: "Multan, Punjab",
    description:
      "Dedicated research facility for mango cultivation, varieties development, and post-harvest technologies.",
    focalPerson: "Dr. Muhammad Tauseef",
    designation: "Senior Scientist (Agronomy)",
    phone: "+923340072357",
    email: "tauseef@mri.gov.pk",
    profileImage: null,
    hasData: true,
    tableType: "MRIAssets",
  },
  "agricultural-mechanization": {
    id: "agricultural-mechanization",
    name: "Agricultural Mechanization Research Institute",
    location: "Multan, Punjab",
    description:
      "Research and development in farm machinery, mechanization technologies, and agricultural engineering.",
    focalPerson: "Dr. Khalid Mahmood",
    designation: "Director",
    phone: "+92-61-9210076",
    email: "khalid.mahmood@amri.gov.pk",
    profileImage: null,
    hasData: true,
    tableType: "AMRIInventory",
  },
  "floriculture-research": {
    id: "floriculture-research",
    name: "Floriculture Research Sub-station",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research and development in ornamental plants, landscaping, and floriculture production techniques.",
    focalPerson: "Dr. Asif Ali",
    designation: "Research Officer",
    phone: "+92-61-9210073",
    email: "asif.ali@mnsuam.edu.pk",
    profileImage: null,
    hasData: true,
    tableType: "FloricultureStationAssets",
  },
  "soil-water-testing": {
    id: "soil-water-testing",
    name: "Soil & Water Testing Laboratory",
    location: "MNS University of Agriculture, Multan",
    description:
      "Comprehensive soil and water analysis services for agricultural research and farmer support.",
    focalPerson: "Dr. Muhammad Tariq",
    designation: "Lab Director",
    phone: "+92-61-9210074",
    email: "tariq@mnsuam.edu.pk",
    profileImage: null,
    hasData: true,
    tableType: "SoilWaterTestingProject",
  },
  "entomology-research": {
    id: "entomology-research",
    name: "Entomology Research Sub-Station",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research on insect pests, beneficial insects, and integrated pest management strategies.",
    focalPerson: "Dr. Sohail Ahmad",
    designation: "Senior Entomologist",
    phone: "+92-61-9210075",
    email: "sohail.ahmad@mnsuam.edu.pk",
    profileImage: null,
    hasData: true,
    tableType: "ERSSStockRegister",
  },
  "mnsuam-estate": {
    id: "mnsuam-estate",
    name: "MNSUAM Estate & Facilities",
    location: "MNS University of Agriculture, Multan",
    description:
      "Management of university infrastructure, facilities, and estate operations.",
    focalPerson: "Engr. Ahmad Hassan",
    designation: "Estate Manager",
    phone: "+92-61-9210077",
    email: "ahmad.hassan@mnsuam.edu.pk",
    profileImage: null,
    hasData: true,
    tableType: "MNSUAMEstateFacilities",
  },
  horticulture: {
    id: "horticulture",
    name: "Horticulture",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research and education in fruit and vegetable production, post-harvest handling, and horticultural sciences.",
    focalPerson: "Dr. Rashid Ali",
    designation: "Professor",
    phone: "+92-61-9210078",
    email: "rashid.ali@mnsuam.edu.pk",
    profileImage: null,
    hasData: false,
    tableType: "",
  },
  "plant-breeding": {
    id: "plant-breeding",
    name: "Plant Breeding and Genetics",
    location: "MNS University of Agriculture, Multan",
    description:
      "Development of improved crop varieties through conventional and modern breeding techniques.",
    focalPerson: "Dr. Saeed Ahmad",
    designation: "Professor & Head",
    phone: "+92-61-9210079",
    email: "saeed.ahmad@mnsuam.edu.pk",
    profileImage: null,
    hasData: false,
    tableType: "",
  },
  biotechnology: {
    id: "biotechnology",
    name: "Biotechnology",
    location: "MNS University of Agriculture, Multan",
    description:
      "Modern biotechnological approaches for crop improvement and agricultural innovation.",
    focalPerson: "Dr. Farah Naz",
    designation: "Associate Professor",
    phone: "+92-61-9210083",
    email: "farah.naz@mnsuam.edu.pk",
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    hasData: false,
    tableType: "",
  },
};

export default function DepartmentPage() {
  const params = useParams();
  const departmentId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);

  const department =
    departmentData[departmentId as keyof typeof departmentData];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingState
          isLoading={true}
          loadingText="Loading department information..."
        >
          <div></div>
        </LoadingState>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Department Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested department could not be found.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!department.hasData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Badge
                variant="secondary"
                className="ml-auto bg-yellow-100 text-yellow-800"
              >
                Coming Soon
              </Badge>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2678E7] to-[#1e5bb8] rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {department.name}
                </h1>
                <p className="text-gray-600 mb-4">{department.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{department.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-yellow-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Equipment Data Coming Soon
              </h2>

              <p className="text-gray-600 mb-6">
                We're currently working on collecting and organizing the
                equipment inventory data for {department.name}. This information
                will be available soon.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">
                  Department Contact
                </h3>
                <div className="flex flex-col items-center space-y-3">
                  <ProfilePicture
                    src={department.profileImage}
                    alt={department.focalPerson}
                    size="md"
                  />
                  <div className="text-center space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">
                        {department.focalPerson}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {department.designation}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{department.phone}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{department.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Button disabled>
                  <Eye className="w-4 h-4 mr-2" />
                  View Equipment (Coming Soon)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Badge variant="secondary" className="ml-auto">
              <Eye className="w-3 h-3 mr-1" />
              Data Available
            </Badge>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2678E7] to-[#1e5bb8] rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {department.name}
              </h1>
              <p className="text-gray-600 mb-4">{department.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{department.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Department Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-[#2678E7]" />
              <h2 className="text-xl font-semibold text-gray-900">
                Department Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Department Name
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {department.name}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Focal Person
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <ProfilePicture
                      src={department.profileImage}
                      alt={department.focalPerson}
                      size="sm"
                    />
                    <div>
                      <p className="text-gray-900 font-medium">
                        {department.focalPerson}
                      </p>
                      <p className="text-sm text-gray-500">
                        {department.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Address
                  </label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-900">{department.location}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Telephone
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 font-medium">
                      {department.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 font-medium">
                      {department.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Department Dashboard */}
          <DepartmentDashboard departmentId={departmentId} />

          <Separator />

          {/* Equipment Table */}
          <DepartmentEquipmentTable
            departmentId={departmentId}
            tableType={department.tableType}
          />
        </div>
      </div>
    </div>
  );
}
