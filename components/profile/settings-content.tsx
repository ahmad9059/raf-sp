"use client";

import { useState } from "react";
import { User, Lock, Building2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProfileImageUpload } from "./profile-image-upload";
import { ProfileUpdateForm } from "./profile-update-form";
import { PasswordChangeForm } from "./password-change-form";

interface SettingsContentProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
    department?: {
      id: string;
      name: string;
      location: string;
      logo?: string | null;
    } | null;
  };
}

export function SettingsContent({ user }: SettingsContentProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProfileUpdate = () => {
    // Force a re-render to show updated data
    setRefreshKey((prev) => prev + 1);
    // In a real app, you might want to refetch the user data or use a state management solution
    window.location.reload();
  };

  return (
    <div className="space-y-8" key={refreshKey}>
      {/* Profile Image Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileImageUpload
            currentImage={user.image}
            userName={user.name}
            onSuccess={handleProfileUpdate}
          />
        </CardContent>
      </Card>

      {/* Profile Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileUpdateForm
            initialData={{
              name: user.name,
              email: user.email,
            }}
            onSuccess={handleProfileUpdate}
          />
        </CardContent>
      </Card>

      {/* Account Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>

      {/* Department Information Section (for DEPT_HEAD users) */}
      {user.role === "DEPT_HEAD" && user.department && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Department Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {user.department.logo && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={user.department.logo}
                      alt={`${user.department.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.department.name}
                  </h3>
                  <p className="text-gray-600">{user.department.location}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">
                    Department ID:
                  </span>
                  <p className="text-gray-600 font-mono">
                    {user.department.id}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Your Role:</span>
                  <div className="mt-1">
                    <Badge variant="secondary">Department Head</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> As a Department Head, you can manage
                  equipment and maintenance logs for your department. Contact an
                  administrator if you need to update your department
                  information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Information Section (for ADMIN users) */}
      {user.role === "ADMIN" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Administrator Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-[#134866]">
                  System Administrator
                </Badge>
              </div>

              <Separator />

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Administrator Privileges:</strong> You have full
                  access to manage all departments, users, and equipment across
                  the entire RAF-SP platform. Use these privileges responsibly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">
                    Access Level:
                  </span>
                  <p className="text-gray-600">Full System Access</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">User ID:</span>
                  <p className="text-gray-600 font-mono">{user.id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
