"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Home, Building2, ExternalLink, FileText, Shield, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
             
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">
                  Agriculture Complex
                </span>
                <span className="text-xs opacity-80 leading-tight">
                  South Punjab
                </span>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4">
              Showcasing agricultural research facilities, equipment inventories, and resources across departments in South Punjab, Pakistan.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-primary-foreground/10 hover:bg-secondary rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-primary-foreground/10 hover:bg-secondary rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-primary-foreground/10 hover:bg-secondary rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm opacity-90 hover:text-secondary transition-colors flex items-center gap-2"
                >
                  <Home className="w-3 h-3" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm opacity-90 hover:text-secondary transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-3 h-3" />
                  Departments
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm opacity-90 hover:text-secondary transition-colors flex items-center gap-2"
                >
                  <Shield className="w-3 h-3" />
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm opacity-90 hover:text-secondary transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3 h-3" />
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* External Resources Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              External Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://mnsuam.edu.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm opacity-90 hover:text-secondary transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  MNSUAM University
                </a>
              </li>
              <li>
                <a
                  href="https://hec.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm opacity-90 hover:text-secondary transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  HEC Pakistan
                </a>
              </li>
              <li>
                <a
                  href="https://agriculture.punjab.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm opacity-90 hover:text-secondary transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  Punjab Agriculture Dept
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm opacity-90 hover:text-secondary transition-colors flex items-center gap-2"
                >
                  <Globe className="w-3 h-3" />
                  Government of Pakistan
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm opacity-90">
                  Agriculture Complex Multan
                  <br />
                  South Punjab
                  <br />
                  Pakistan
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <span className="text-sm opacity-90">+92 61 XXXXXXX</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <a
                  href="mailto:info@mnsuam.edu.pk"
                  className="text-sm opacity-90 hover:text-secondary transition-colors"
                >
                  info@mnsuam.edu.pk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm opacity-80 text-center md:text-left">
              <p>
                © {new Date().getFullYear()} Agriculture Complex Multan. All rights reserved.
              </p>
              <p className="text-xs mt-1">
                MNS University of Agriculture, Multan
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm opacity-80">
              <Link
                href="/privacy"
                className="hover:text-secondary transition-colors flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-secondary transition-colors flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                Terms of Service
              </Link>
              <Link
                href="/accessibility"
                className="hover:text-secondary transition-colors flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
