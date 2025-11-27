import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/actions/profile";
import { SettingsContent } from "@/components/profile/settings-content";

export default async function SettingsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  // Get current user profile data
  const profileResult = await getCurrentUserProfile();

  if (!profileResult.success || !profileResult.data) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <SettingsContent user={profileResult.data} />
    </div>
  );
}
