"use client";

import { User, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function Header({ user }: HeaderProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left side - responsive welcome message */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">
            Welcome back, {user?.name || "User"}
          </h2>
          <p className="text-xs lg:text-sm text-gray-500">
            {user?.role === "ADMIN" ? "Administrator" : "Department Head"}
          </p>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 p-2 lg:px-3"
              >
                <div className="w-8 h-8 bg-[#134866] rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[120px]">
                    {user?.email}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
