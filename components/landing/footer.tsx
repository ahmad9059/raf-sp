"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight">
                  RAF-SP
                </span>
                <span className="text-xs text-gray-400 leading-tight">
                  Smart Platform
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Modernizing agriculture asset management for government
              departments across the nation.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-brand rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-brand rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-brand rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#about"
                  className="text-sm hover:text-brand transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-sm hover:text-brand transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm hover:text-brand transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm hover:text-brand transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Government Links Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Government Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.gov.example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-brand transition-colors"
                >
                  Ministry of Agriculture
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-brand transition-colors"
                >
                  MNSUAM University
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-brand transition-colors"
                >
                  Digital Government Portal
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-brand transition-colors"
                >
                  National Data Center
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Ministry of Agriculture
                  <br />
                  Government Complex, Capital City
                  <br />
                  Postal Code 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand flex-shrink-0" />
                <a
                  href="mailto:support@raf-sp.gov"
                  className="text-sm hover:text-brand transition-colors"
                >
                  support@raf-sp.gov
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400 text-center md:text-left">
              <p>
                © {new Date().getFullYear()} RAF-SP Platform. All rights
                reserved.
              </p>
              <p className="text-xs mt-1">
                A Government of [Country] Initiative
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="hover:text-brand transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-brand transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/accessibility"
                className="hover:text-brand transition-colors"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
