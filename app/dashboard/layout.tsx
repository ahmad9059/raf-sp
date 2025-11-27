import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/session-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <AuthProvider>
      <QueryProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Sidebar */}
          <Sidebar userRole={session.user.role} />

          {/* Main content area */}
          <div className="lg:pl-64">
            {/* Header */}
            <Header user={session.user} />

            {/* Page content */}
            <main className="p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </QueryProvider>
    </AuthProvider>
  );
}
