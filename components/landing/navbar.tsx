"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div className="flex flex-col">
              <span className="text-brand font-bold text-lg leading-tight">
                RAF-SP
              </span>
              <span className="text-xs text-gray-600 leading-tight">
                Smart Platform
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#about"
              className="text-gray-700 hover:text-brand transition-colors"
            >
              About
            </Link>
            <Link
              href="#features"
              className="text-gray-700 hover:text-brand transition-colors"
            >
              Features
            </Link>
            <Link
              href="#contact"
              className="text-gray-700 hover:text-brand transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-brand hover:bg-brand/90 text-white">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
