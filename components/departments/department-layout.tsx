import { ReactNode } from "react";
import Image from "next/image";
import { Mail, Phone, User, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DepartmentLayoutProps {
  name: string;
  description: string;
  image: string;
  focalPerson?: {
    name: string;
    designation: string;
    phone?: string;
    email?: string;
  };
  children: ReactNode;
}

export function DepartmentLayout({
  name,
  description,
  image,
  focalPerson,
  children,
}: DepartmentLayoutProps) {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative gradient-agriculture text-primary-foreground py-12 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {/* Logo Badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                  <Image
                    src="/icons/logo.png.png"
                    alt="Department Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <Building2 className="w-4 h-4" />
                  <span>Research Institute</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {name}
              </h1>
              <p className="text-lg opacity-90 mb-6">{description}</p>

              {focalPerson && (
                <Card className="p-4 bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div className="space-y-1">
                      <div className="font-semibold">{focalPerson.name}</div>
                      <div className="text-sm opacity-90">
                        {focalPerson.designation}
                      </div>
                      {focalPerson.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3" />
                          {focalPerson.phone}
                        </div>
                      )}
                      {focalPerson.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3" />
                          {focalPerson.email}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-xl">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">{children}</div>
    </div>
  );
}
