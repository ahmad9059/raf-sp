"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#departments", label: "Departments" },
    { href: "#about", label: "About" },
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md border-border/40"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container py-1 mx-auto px-4 sm:px-6 lg:px-3">
        <div className="flex items-center justify-between h-16 md:h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center group">
            <div className=" transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/mainLogo.png"
                alt="RAF-SP Logo"
                width={90}
                height={90}
                className="object-cover"
                priority
              />
            </div>
            <div className="ml-[-8px] flex flex-col">
              <span className="text-primary font-bold text-xl leading-none tracking-wide">
                RAF
              </span>
              <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline-block tracking-wide">
                South Punjab
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              asChild
              className="font-medium hover:text-primary hover:bg-primary/5"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="font-medium shadow-sm hover:shadow-md transition-all"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-primary/5 hover:text-primary"
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
          <div className="md:hidden absolute top-full left-0 right-0 border-b bg-background/95 backdrop-blur-lg shadow-lg animate-in slide-in-from-top-5">
            <div className="px-4 py-6 space-y-4">
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-center"
                >
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full justify-center">
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
        )}
      </div>
    </nav>
  );
}
