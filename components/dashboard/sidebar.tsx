"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Building2,
  Settings,
  Menu,
  X,
  Users,
  Eye,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

interface SidebarProps {
  userRole?: string;
  departmentId?: string | null;
}

// Map department IDs to their dashboard routes and display names
const departmentInfo: Record<string, { route: string; name: string }> = {
  "mri": { route: "/dashboard/mri", name: "MRI Dashboard" },
  "amri": { route: "/dashboard/amri", name: "AMRI Dashboard" },
  "food-science": { route: "/dashboard/food-science", name: "Food Science" },
  "cri": { route: "/dashboard/cri", name: "CRI Dashboard" },
  "flori": { route: "/dashboard/floriculture", name: "Floriculture" },
  "rari": { route: "/dashboard/rari", name: "RARI Dashboard" },
  "mnsuam": { route: "/dashboard/mnsuam", name: "MNSUAM Dashboard" },
  "soil-water": { route: "/dashboard/soil-water", name: "Soil & Water" },
  "pest": { route: "/dashboard/pesticide", name: "Pesticide QC" },
  "agri-eng": { route: "/dashboard/agri-engineering", name: "Agri Engineering" },
  "cmj65lx040000f4txnzu2lssv": { route: "/dashboard/agri-engineering", name: "Agri Engineering" },
  "raedc": { route: "/dashboard/raedc", name: "RAEDC Dashboard" },
  "cmj65nmep0000e0txy17pplhy": { route: "/dashboard/raedc", name: "RAEDC Dashboard" },
  "agri-ext": { route: "/dashboard/agri-extension", name: "Agri Extension" },
  "erss": { route: "/dashboard/entomology", name: "Entomology" },
  "arc": { route: "/dashboard/adaptive-research", name: "Adaptive Research" },
  "adp": { route: "/dashboard/adaptive-research", name: "Adaptive Research" },
};

const adminNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Departments",
    href: "/dashboard/admin/departments",
    icon: Building2,
  },
  {
    name: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({ userRole = "DEPT_HEAD", departmentId }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Generate navigation based on user role and department
  const navigation = useMemo(() => {
    if (userRole === "ADMIN") {
      return adminNavigation;
    }

    // For department heads, show their specific department dashboard
    const deptInfo = departmentId ? departmentInfo[departmentId] : null;
    
    const deptNavigation = [
      {
        name: deptInfo?.name || "My Dashboard",
        href: deptInfo?.route || "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ];

    return deptNavigation;
  }, [userRole, departmentId]);

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-[#2678E7] text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-105"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-sm transition-transform lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
            <div className="w-8 h-8 bg-[#2678E7] rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">RAF-SP</h1>
              <p className="text-xs text-gray-500">Asset Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <NavLinks />
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2024 RAF-SP Platform
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
