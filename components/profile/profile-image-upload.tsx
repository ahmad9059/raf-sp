"use client";

import { useState } from "react";
import { User, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/equipment/image-upload";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfileImage } from "@/actions/profile";
import { cn } from "@/lib/utils";

interface ProfileImageUploadProps {
  currentImage?: string | null;
  userName: string;
  onSuccess?: () => void;
}

export function ProfileImageUpload({
  currentImage,
  userName,
  onSuccess,
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (imageUrl: string) => {
    setIsUploading(true);

    try {
      const result = await updateUserProfileImage(imageUrl);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setShowUpload(false);
        onSuccess?.();
      } else {
        toast({
          title: "Error",
          description: result.message,
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
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    setIsUploading(true);

    try {
      const result = await updateUserProfileImage("");

      if (result.success) {
        toast({
          title: "Success",
          description: "Profile image removed successfully",
        });
        setShowUpload(false);
        onSuccess?.();
      } else {
        toast({
          title: "Error",
          description: result.message,
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
      setIsUploading(false);
    }
  };

  if (showUpload) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Update Profile Image</h3>
          <Button
            variant="outline"
            onClick={() => setShowUpload(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
        <ImageUpload
          value={currentImage || ""}
          onChange={handleImageUpload}
          disabled={isUploading}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Profile Image Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
          {currentImage ? (
            <img
              src={currentImage}
              alt={`${userName}'s profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#134866] text-white">
              <User className="w-16 h-16" />
            </div>
          )}
        </div>

        {/* Camera Icon Overlay */}
        <Button
          size="icon"
          className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-[#134866] hover:bg-[#134866]/90"
          onClick={() => setShowUpload(true)}
          disabled={isUploading}
        >
          <Camera className="w-5 h-5" />
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowUpload(true)}
          disabled={isUploading}
        >
          {currentImage ? "Change Image" : "Upload Image"}
        </Button>

        {currentImage && (
          <Button
            variant="destructive"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            Remove Image
          </Button>
        )}
      </div>
    </div>
  );
}
