# AgriData Hub - Complete Frontend Specification

> **Version:** 1.0.0  
> **Last Updated:** November 27, 2025  
> **Purpose:** This document provides a comprehensive guide for AI assistants and developers to understand and implement the frontend of the AgriData Hub website.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Structure](#3-project-structure)
4. [Design System](#4-design-system)
5. [Component Architecture](#5-component-architecture)
6. [Page Implementations](#6-page-implementations)
7. [Data Models](#7-data-models)
8. [Styling Guidelines](#8-styling-guidelines)
9. [Animation & Interaction Patterns](#9-animation--interaction-patterns)
10. [Responsive Design](#10-responsive-design)
11. [Implementation Guidelines](#11-implementation-guidelines)

---

## 1. Project Overview

### 1.1 Application Purpose
**AgriData Hub** is a digital platform showcasing agricultural research facilities, equipment inventories, and resources across departments and institutes in South Punjab, Pakistan. It serves the **Agriculture Complex Multan** and **MNS University of Agriculture**.

### 1.2 Core Features
- **Department Data Display:** Information about 18+ departments with facilities, lab equipment, and contact details
- **Lab Equipment Inventory:** Detailed inventories with quantities and functional status
- **Facility Overview:** Halls, meeting rooms, labs with capacities and amenities
- **Dashboard Generation:** Department dashboards with tables, charts, and graphs
- **Landing Page:** Visual representation of all departments linking to individual dashboards
- **Institute Directory:** Research institutes listing with details

### 1.3 Target Audience
- Agricultural researchers
- University staff and administrators
- Government officials (Punjab Agriculture Department)
- Students and academics

---

## 2. Tech Stack & Dependencies

### 2.1 Core Framework
```json
{
  "framework": "Next.js 15.3.3",
  "language": "TypeScript 5.x",
  "runtime": "React 18.3.1",
  "bundler": "Turbopack"
}
```

### 2.2 Styling
```json
{
  "css": "Tailwind CSS 3.4.1",
  "animations": "tailwindcss-animate 1.0.7",
  "utility": "tailwind-merge 3.0.1",
  "classNames": "clsx 2.1.1",
  "variants": "class-variance-authority 0.7.1"
}
```

### 2.3 UI Component Library
All UI components are from **shadcn/ui** (Radix UI primitives):
- Accordion, Alert, AlertDialog, Avatar, Badge
- Button, Calendar, Card, Carousel, Chart
- Checkbox, Collapsible, Dialog, DropdownMenu
- Form, Input, Label, Menubar, Popover
- Progress, RadioGroup, ScrollArea, Select
- Separator, Sheet, Sidebar, Skeleton, Slider
- Switch, Table, Tabs, Textarea, Toast, Tooltip

### 2.4 Charts & Visualization
```json
{
  "library": "Recharts 2.15.1",
  "components": ["BarChart", "PieChart", "ResponsiveContainer", "Tooltip", "Legend"]
}
```

### 2.5 Icons
```json
{
  "library": "lucide-react 0.475.0",
  "usage": "Line-based icons for navigation and visual cues"
}
```

### 2.6 Forms & Validation
```json
{
  "forms": "react-hook-form 7.54.2",
  "validation": "zod 3.24.2",
  "resolvers": "@hookform/resolvers 4.1.3"
}
```

### 2.7 Additional Libraries
- **date-fns:** Date manipulation
- **embla-carousel-react:** Carousel functionality
- **react-day-picker:** Date picker component
- **firebase:** Backend services (if applicable)

---

## 3. Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css               # Global styles & CSS variables
│   ├── layout.tsx                # Root layout with Header/Footer
│   ├── page.tsx                  # Home page (landing)
│   ├── not-found.tsx             # 404 page
│   ├── departments/
│   │   └── [slug]/
│   │       └── page.tsx          # Dynamic department pages
│   └── institutes/
│       ├── page.tsx              # Institutes listing
│       └── [slug]/
│           └── page.tsx          # Dynamic institute pages
├── components/
│   ├── layout/
│   │   ├── header.tsx            # Site header with navigation
│   │   └── footer.tsx            # Site footer
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── badge.tsx
│       └── ... (40+ components)
├── data/
│   ├── departments.ts            # Department data array
│   └── institutes.ts             # Institute data array
├── hooks/
│   ├── use-mobile.tsx            # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
└── lib/
    ├── types.ts                  # TypeScript type definitions
    ├── utils.ts                  # Utility functions (cn())
    ├── placeholder-images.ts     # Image helper
    └── placeholder-images.json   # Image data
```

---

## 4. Design System

### 4.1 Color Palette (Agriculture Theme)

#### Light Mode CSS Variables (HSL)
```css
:root {
  /* Base Colors */
  --background: 60 30% 96%;           /* Warm off-white cream */
  --foreground: 150 30% 10%;          /* Deep forest green-black */
  
  /* Primary - Forest Green */
  --primary: 142 45% 28%;             /* Deep agricultural green */
  --primary-foreground: 60 30% 96%;   /* Light text on primary */
  
  /* Secondary - Wheat Gold */
  --secondary: 45 70% 50%;            /* Golden wheat color */
  --secondary-foreground: 150 30% 10%;
  
  /* Accent - Bright Gold */
  --accent: 45 85% 55%;               /* Bright golden accent */
  --accent-foreground: 150 30% 10%;
  
  /* UI Elements */
  --card: 0 0% 100%;                  /* Pure white cards */
  --card-foreground: 150 30% 10%;
  --popover: 0 0% 100%;
  --popover-foreground: 150 30% 10%;
  --muted: 60 20% 90%;                /* Soft cream muted */
  --muted-foreground: 150 15% 40%;    /* Subtle text */
  --border: 142 20% 85%;              /* Light green-gray border */
  --input: 142 20% 85%;
  --ring: 142 45% 28%;                /* Focus ring = primary */
  
  /* Destructive */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 60 30% 96%;
  
  /* Chart Colors - Agriculture Themed */
  --chart-1: 142 45% 35%;   /* Green */
  --chart-2: 45 85% 55%;    /* Gold */
  --chart-3: 25 80% 50%;    /* Orange */
  --chart-4: 180 40% 40%;   /* Teal */
  --chart-5: 90 40% 45%;    /* Light green */
  
  /* Sidebar */
  --sidebar-background: 142 30% 20%;  /* Dark forest green */
  --sidebar-foreground: 60 30% 96%;   /* Light text */
  --sidebar-primary: 45 85% 55%;      /* Gold highlights */
  --sidebar-accent: 142 40% 30%;
  --sidebar-border: 142 30% 30%;
  
  /* Radius */
  --radius: 0.5rem;
}
```

#### Dark Mode CSS Variables
```css
.dark {
  --background: 150 30% 8%;           /* Very dark green-black */
  --foreground: 60 30% 96%;           /* Light cream text */
  --primary: 142 50% 45%;             /* Brighter green for dark */
  --secondary: 45 70% 50%;
  --accent: 45 85% 55%;
  --card: 150 25% 12%;                /* Dark cards */
  --muted: 150 20% 18%;
  --border: 150 20% 25%;
  /* ... other dark mode values */
}
```

### 4.2 Semantic Color Usage

| Purpose | Light Mode | Usage |
|---------|------------|-------|
| Primary actions | Forest green (#2d5a3d) | Buttons, links, active states |
| Secondary actions | Wheat gold (#c9a227) | Highlight badges, secondary buttons |
| Accent | Bright gold (#d4a72c) | Interactive highlights, key data |
| Background | Cream white (#f8f6f0) | Page background |
| Cards | Pure white (#ffffff) | Card backgrounds |
| Borders | Light green-gray | Card borders, dividers |
| Text primary | Dark green-black | Headlines, body text |
| Text muted | Medium gray-green | Secondary text, descriptions |

### 4.3 Typography

```typescript
// Font Configuration (tailwind.config.ts)
fontFamily: {
  body: ['Inter', 'sans-serif'],
  headline: ['Inter', 'sans-serif'],
  code: ['monospace'],
}
```

#### Typography Scale
| Element | Classes | Usage |
|---------|---------|-------|
| H1 (Hero) | `text-4xl md:text-6xl lg:text-7xl font-bold font-headline` | Main hero titles |
| H2 (Section) | `text-3xl md:text-4xl font-bold font-headline` | Section headings |
| H3 (Card Title) | `text-xl md:text-2xl font-semibold` | Card titles |
| Body Large | `text-lg md:text-xl` | Lead paragraphs |
| Body | `text-base` (16px) | Regular text |
| Small/Caption | `text-sm` or `text-xs` | Labels, captions |

### 4.4 Spacing System (Tailwind)
- Container max-width: `1400px` (2xl)
- Container padding: `2rem`
- Section padding: `py-16`
- Card padding: `p-6`
- Component gaps: `gap-4`, `gap-6`, `gap-8`

### 4.5 Border Radius
```css
--radius: 0.5rem;
/* Computed values */
border-radius-lg: 0.5rem;
border-radius-md: calc(0.5rem - 2px);
border-radius-sm: calc(0.5rem - 4px);
```

---

## 5. Component Architecture

### 5.1 Layout Components

#### Header (`src/components/layout/header.tsx`)
```tsx
// Structure
- Sticky header with backdrop blur
- Logo + Site name (Agriculture Complex | South Punjab • Multan)
- Desktop navigation: Home, Departments, Institutes
- Mobile: Sheet-based hamburger menu
- External link to MNSUAM Portal

// Key Classes
className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"

// Icons Used
- Wheat (logo)
- Home, Building2, Microscope (nav)
- Menu (mobile toggle)
```

#### Footer (`src/components/layout/footer.tsx`)
```tsx
// Structure
- 4-column grid layout
- Brand section with logo + description + social icons
- Contact information (address, phone, email)
- Quick links (internal navigation)
- External resources (MNSUAM, HEC, Punjab Gov)
- Bottom bar with copyright

// Background
className="bg-primary text-primary-foreground"
```

### 5.2 UI Component Patterns

#### Button Variants
```typescript
const buttonVariants = cva({
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  }
});
```

#### Card Component
```typescript
// Base card styling
className="rounded-lg border bg-card text-card-foreground shadow-sm"

// Card with hover effect (custom utility)
className="card-hover" // Adds: transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30

// Stat card (custom utility)
className="stat-card" // Adds: relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm + gradient overlay
```

#### Badge Usage
```tsx
// Standard badge
<Badge>Label</Badge>

// Outline variant
<Badge variant="outline">Outline Label</Badge>

// Colored badges for status
<Badge className="bg-secondary text-secondary-foreground">Gold Badge</Badge>
<Badge className="bg-green-600">Functional</Badge>
<Badge className="bg-amber-500">Needs Repair</Badge>
<Badge className="bg-red-500">Not Repairable</Badge>
```

### 5.3 Custom Utility Classes

```css
/* Defined in globals.css */

/* Green gradient background */
.gradient-agriculture {
  @apply bg-gradient-to-r from-primary via-primary/90 to-primary/80;
}

/* Gold gradient background */
.gradient-gold {
  @apply bg-gradient-to-r from-secondary via-accent to-secondary;
}

/* Gradient text effect */
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent;
}

/* Card hover animation */
.card-hover {
  @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30;
}

/* Statistic card with gradient overlay */
.stat-card {
  @apply relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm;
}
.stat-card::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent;
}
```

---

## 6. Page Implementations

### 6.1 Home Page (`src/app/page.tsx`)

#### Section Structure
1. **Hero Section**
   - Gradient background (`gradient-agriculture`)
   - University logos/icons (Wheat, TreeDeciduous)
   - Main title: "Agriculture Complex Multan"
   - Subtitle: "South Punjab Regional Agriculture Forum"
   - Search bar (decorative/functional)
   - CTA buttons: View Departments, View Institutes
   - Decorative emoji pattern (🌾🌿)
   - Wave SVG divider at bottom

2. **Statistics Section**
   - 6 stat cards in responsive grid (2→3→6 columns)
   - Stats: Departments, Institutes, Equipment, Machinery, Staff, Data Coverage
   - Each card has colored icon in circular bg

3. **Feature Section**
   - 2-column layout (image + content)
   - Large feature image with overlay
   - About text with feature grid (4 features)
   - CTA button to departments

4. **Departments & Institutes Section**
   - Tabs component (Departments | Institutes)
   - Card grid (1→2→3→4 columns)
   - Each card: Image with gradient overlay, title, location badge, description, CTA button

5. **Call to Action Section**
   - Green gradient background
   - Centered text with two CTA buttons

#### Key Implementation Details
```tsx
// Statistics calculation
const stats = {
  totalDepartments: departments.length,
  totalInstitutes: institutes.length,
  departmentsWithData: departments.filter(d => d.equipmentList?.length || d.humanResources?.length || d.facilitiesList?.length).length,
  totalEquipment: departments.reduce((sum, d) => sum + (d.equipmentList?.reduce((s, e) => s + e.quantity, 0) || 0), 0),
  totalMachinery: departments.reduce((sum, d) => sum + (d.farmMachinery?.reduce((s, e) => s + e.quantity, 0) || 0), 0),
  totalStaff: departments.reduce((sum, d) => sum + (d.humanResources?.reduce((s, hr) => s + hr.filled, 0) || 0), 0),
};
```

### 6.2 Department Detail Page (`src/app/departments/[slug]/page.tsx`)

#### Client Component
```tsx
'use client';
// Uses useParams() for dynamic routing
// Uses useMemo() for department lookup
```

#### Section Structure
1. **Hero Section**
   - Gradient background
   - Breadcrumb (Back to Departments)
   - Department badge, name, university, address
   - Description text
   - Contact card (focal person, email, phone)
   - Department image (desktop only)
   - Wave SVG divider

2. **Quick Stats Bar**
   - Horizontal cards showing: Equipment count, Functional %, Staff count, Facilities count, Land area, Machinery count
   - Conditionally rendered based on available data

3. **Tabbed Content**
   - **Equipment Tab:**
     - Equipment inventory table (Name, Location, Qty, Status)
     - Status distribution pie chart
     - Equipment by location bar chart
     - Farm machinery section (if available)
   
   - **Facilities Tab:**
     - Facilities list with icons
     - Land resources (if available)
   
   - **Staff Tab:**
     - Human resources table (Position, BPS, Sanctioned, Filled, Vacant)
     - Staffing bar chart (Filled vs Vacant)
     - Vacancy analysis pie chart
   
   - **Analytics Tab:**
     - Summary overview
     - Combined charts and visualizations

#### Chart Configuration
```typescript
// MNSUAM theme colors for charts
const CHART_COLORS = [
  'hsl(142, 45%, 35%)',  // Primary green
  'hsl(45, 85%, 55%)',   // Gold/wheat
  'hsl(25, 80%, 50%)',   // Orange
  'hsl(180, 40%, 40%)',  // Teal
  'hsl(90, 40%, 45%)',   // Light green
  'hsl(0, 70%, 50%)',    // Red for vacant/issues
];

// Status badge colors
const getStatusColor = (status?: string) => {
  const s = status?.toLowerCase();
  if (s === 'functional') return 'bg-green-600';
  if (s === 'needs repair') return 'bg-amber-500';
  if (s === 'required') return 'bg-blue-500';
  if (s === 'not repairable') return 'bg-red-500';
  return 'bg-gray-500';
};
```

### 6.3 Institutes Page (`src/app/institutes/page.tsx`)

#### Structure
1. **Hero Section**
   - Similar to home hero but for institutes
   - Stats badges: Institute count, Location
   - Decorative emojis (🔬🌱)

2. **Institutes Grid**
   - Card grid layout (1→2→3→4 columns)
   - Each card: Image, badge, title, location, CTA button

3. **CTA Section**
   - Prompt to use data parser tool

### 6.4 Institute Detail Page (`src/app/institutes/[slug]/page.tsx`)
- Similar structure to department detail
- Displays institute-specific information

---

## 7. Data Models

### 7.1 Type Definitions (`src/lib/types.ts`)

```typescript
export type Equipment = {
  name: string;
  quantity: number;
  status: string;           // 'Functional', 'Needs Repair', 'Not Repairable', 'Required'
  location?: string;        // Lab/room name
  metadata?: Record<string, unknown>;
};

export type Facility = {
  name: string;
  capacity?: number;
  type?: string;            // 'Laboratory', 'Field Research', etc.
  details?: string;         // Room number, building info
};

export type HumanResource = {
  position: string;         // Job title
  bps: number;              // Basic Pay Scale (1-22)
  sanctioned: number;       // Approved positions
  filled: number;           // Currently filled
  vacant: number;           // Open positions
};

export type LandResource = {
  label: string;            // 'Total Area', 'Cultivated', etc.
  value: string;            // Display value
  acres?: number;           // Numeric value
};

export type Department = {
  id: string;
  slug: string;             // URL-friendly identifier
  name: string;
  university: string;
  imageId: string;          // Reference to placeholder image
  contact?: {
    focalPerson: string;
    email: string;
    phone?: string;
  };
  description: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  equipmentList?: Equipment[];
  facilitiesList?: Facility[];
  humanResources?: HumanResource[];
  landResources?: LandResource[];
  farmMachinery?: Equipment[];
};
```

### 7.2 Institute Type (`src/data/institutes.ts`)

```typescript
export type Institute = {
  id: string;
  name: string;
  slug: string;
  imageId: string;
};
```

### 7.3 Image Placeholder Type

```typescript
export type ImagePlaceholder = {
  id: string;               // e.g., 'agri-1', 'agri-2'
  description: string;
  imageUrl: string;         // Full URL to image
  imageHint: string;        // AI hint for image
};
```

---

## 8. Styling Guidelines

### 8.1 Class Name Composition

Use the `cn()` utility function from `@/lib/utils`:

```typescript
import { cn } from "@/lib/utils"

// Usage
<div className={cn(
  "base-class",
  conditional && "conditional-class",
  className // passed as prop
)} />
```

### 8.2 Responsive Patterns

```tsx
// Text sizes
className="text-xl md:text-2xl lg:text-3xl"

// Grid columns
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"

// Spacing
className="px-4 md:px-6 lg:px-8"
className="py-8 md:py-12 lg:py-16"

// Visibility
className="hidden md:block"  // Hide on mobile
className="md:hidden"        // Show only on mobile

// Flex direction
className="flex flex-col md:flex-row"
```

### 8.3 Image Handling

```tsx
import Image from 'next/image';

// Standard image with overlay
<div className="relative h-44 w-full overflow-hidden">
  <Image
    src={image.imageUrl}
    alt={name}
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-110"
    data-ai-hint="research facility"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
</div>
```

### 8.4 SVG Wave Dividers

```tsx
// Standard wave divider (at section bottom)
<div className="absolute bottom-0 left-0 right-0">
  <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
    <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-background"/>
  </svg>
</div>
```

---

## 9. Animation & Interaction Patterns

### 9.1 Transition Classes

```css
/* Standard transitions */
transition-colors          /* Color changes */
transition-all duration-300 /* Multi-property with duration */
transition-transform duration-500 /* Transform with duration */
```

### 9.2 Hover Effects

```tsx
// Card hover (lift + shadow)
className="card-hover"
// Expands to: transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30

// Image zoom on parent hover
className="group" // on parent
className="transition-transform duration-500 group-hover:scale-110" // on image

// Link hover
className="hover:text-primary transition-colors"
className="hover:underline"

// Button hover (handled by variant)
className="hover:bg-primary/90"
```

### 9.3 Accordion Animation

```typescript
// Defined in tailwind.config.ts
keyframes: {
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' },
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' },
  },
},
animation: {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
},
```

### 9.4 Loading States

Use Skeleton components for loading states:
```tsx
import { Skeleton } from "@/components/ui/skeleton"

<Skeleton className="h-4 w-[200px]" />
<Skeleton className="h-32 w-full rounded-xl" />
```

---

## 10. Responsive Design

### 10.1 Breakpoints (Tailwind Default)

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### 10.2 Mobile-First Patterns

```tsx
// Grid layouts
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

// Navigation
- Desktop: Horizontal nav links
- Mobile: Sheet component (hamburger menu)

// Hero sections
- Mobile: Stacked content, smaller text
- Desktop: Side-by-side layout, larger typography

// Statistics
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

// Tabs
- Mobile: Icons hidden, text only
- Desktop: Icons + text
```

### 10.3 Container Configuration

```typescript
// tailwind.config.ts
container: {
  center: true,
  padding: "2rem",
  screens: {
    "2xl": "1400px",
  },
},
```

---

## 11. Implementation Guidelines

### 11.1 Adding a New Department

1. Add data to `src/data/departments.ts`:
```typescript
{
  id: 'unique-id',
  slug: 'url-friendly-name',
  name: 'Full Department Name',
  university: 'Parent University/Institution',
  imageId: 'agri-X', // Reference existing image or add new
  description: 'Brief description of the department...',
  contact: {
    focalPerson: 'Dr. Name',
    email: 'email@domain.edu.pk',
    phone: '+92 XX XXXXXXX'
  },
  address: 'Physical address',
  equipmentList: [
    { name: 'Equipment Name', quantity: 1, status: 'Functional', location: 'Lab Name' }
  ],
  facilitiesList: [
    { name: 'Facility Name', type: 'Laboratory', details: 'Room #XXX' }
  ],
  humanResources: [
    { position: 'Position Name', bps: 17, sanctioned: 5, filled: 3, vacant: 2 }
  ],
  landResources: [
    { label: 'Total Area', value: '100 acres', acres: 100 }
  ],
  farmMachinery: [
    { name: 'Tractor', quantity: 2, status: 'Functional' }
  ]
}
```

2. Add corresponding image to `placeholder-images.json` if needed

### 11.2 Adding a New UI Component

1. Use shadcn/ui CLI:
```bash
npx shadcn-ui@latest add [component-name]
```

2. Or create manually in `src/components/ui/`

3. Follow the established pattern:
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const Component = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("base-classes", className)} {...props} />
  )
)
Component.displayName = "Component"

export { Component }
```

### 11.3 Creating a New Page

1. Create file in `src/app/[route]/page.tsx`

2. For dynamic routes: `src/app/[param]/page.tsx`

3. Follow the section structure pattern:
```tsx
export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative gradient-agriculture text-primary-foreground py-16">
        {/* Decorative elements */}
        <div className="container">
          {/* Content */}
        </div>
        {/* Wave divider */}
      </section>
      
      {/* Content Sections */}
      <section className="py-16">
        <div className="container">
          {/* Content */}
        </div>
      </section>
    </div>
  );
}
```

### 11.4 Icon Usage

Always import from `lucide-react`:
```tsx
import { 
  Building2,      // Departments
  Microscope,     // Institutes
  FlaskConical,   // Labs/Equipment
  Users,          // Staff
  Wheat,          // Agriculture/Logo
  MapPin,         // Location
  ChevronRight,   // Navigation arrows
  Mail, Phone,    // Contact
  Tractor,        // Machinery
  CheckCircle2,   // Functional status
  AlertCircle,    // Warning status
  Wrench          // Repair/maintenance
} from 'lucide-react';
```

### 11.5 Toast Notifications

```tsx
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

toast({
  title: "Success",
  description: "Action completed successfully",
})

toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive",
})
```

### 11.6 Form Implementation

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
})

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: "", email: "" },
})

// Use Form components from @/components/ui/form
```

---

## Quick Reference Card

### Colors
- **Primary:** Forest green (`hsl(142, 45%, 28%)`)
- **Secondary:** Wheat gold (`hsl(45, 70%, 50%)`)
- **Accent:** Bright gold (`hsl(45, 85%, 55%)`)

### Key Classes
- Hero gradient: `gradient-agriculture`
- Card hover: `card-hover`
- Stat card: `stat-card`
- Container: `container`

### Common Patterns
- Section: `<section className="py-16 bg-background">`
- Grid: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`
- Card: `<Card className="card-hover">`
- Button CTA: `<Button asChild size="lg"><Link href="...">`

### File Locations
- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Types: `src/lib/types.ts`
- Data: `src/data/departments.ts`, `src/data/institutes.ts`

---

*This specification is the single source of truth for the AgriData Hub frontend implementation. All new features and modifications should follow these guidelines to maintain consistency.*
