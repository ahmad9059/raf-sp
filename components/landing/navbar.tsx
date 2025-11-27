"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          {/* Desktop Navigation Links */}
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-brand hover:bg-brand/90 text-white">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="#about"
                className="block px-3 py-2 text-gray-700 hover:text-brand transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#features"
                className="block px-3 py-2 text-gray-700 hover:text-brand transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 text-gray-700 hover:text-brand transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" asChild className="justify-start">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-brand hover:bg-brand/90 text-white"
                  >
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
