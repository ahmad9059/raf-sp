# Agricultural Theme Reference Guide

## Color Palette

### Primary Colors
```css
/* Forest Green - Main brand color */
--primary: hsl(142, 45%, 28%)           /* #2d5a3d */
--primary-foreground: hsl(60, 30%, 96%) /* Light cream text */

/* Wheat Gold - Secondary actions */
--secondary: hsl(45, 70%, 50%)          /* #c9a227 */
--secondary-foreground: hsl(150, 30%, 10%)

/* Bright Gold - Accents */
--accent: hsl(45, 85%, 55%)             /* #d4a72c */
--accent-foreground: hsl(150, 30%, 10%)
```

### Background Colors
```css
--background: hsl(60, 30%, 96%)         /* Warm cream */
--foreground: hsl(150, 30%, 10%)        /* Deep forest green-black */
--card: hsl(0, 0%, 100%)                /* Pure white */
--muted: hsl(60, 20%, 90%)              /* Soft cream muted */
```

### Chart Colors
```css
--chart-1: hsl(142, 45%, 35%)  /* Green */
--chart-2: hsl(45, 85%, 55%)   /* Gold */
--chart-3: hsl(25, 80%, 50%)   /* Orange */
--chart-4: hsl(180, 40%, 40%)  /* Teal */
--chart-5: hsl(90, 40%, 45%)   /* Light green */
```

## Custom Utility Classes

### Gradients
```css
/* Green gradient for hero sections */
.gradient-agriculture {
  background: linear-gradient(to right, 
    hsl(142, 45%, 28%), 
    hsl(142, 45%, 28%, 0.9), 
    hsl(142, 45%, 28%, 0.8)
  );
}

/* Gold gradient for highlights */
.gradient-gold {
  background: linear-gradient(to right,
    hsl(45, 70%, 50%),
    hsl(45, 85%, 55%),
    hsl(45, 70%, 50%)
  );
}

/* Gradient text effect */
.text-gradient {
  background: linear-gradient(to right,
    hsl(142, 45%, 28%),
    hsl(45, 85%, 55%)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```

### Animations
```css
/* Card hover effect */
.card-hover {
  transition: all 0.3s ease;
}
.card-hover:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
  border-color: hsl(142, 45%, 28%, 0.3);
}

/* Stat card with gradient overlay */
.stat-card {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--card));
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom right,
    hsl(142, 45%, 28%, 0.05),
    transparent
  );
  pointer-events: none;
}
```

## Typography Scale

### Headings
```tsx
// Hero Title (H1)
<h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold">

// Section Title (H2)
<h2 className="text-3xl sm:text-4xl font-bold">

// Card Title (H3)
<h3 className="text-xl md:text-2xl font-semibold">

// Subsection (H4)
<h4 className="text-lg font-semibold">
```

### Body Text
```tsx
// Lead paragraph
<p className="text-lg md:text-xl">

// Regular body
<p className="text-base">

// Small text
<p className="text-sm">

// Caption
<p className="text-xs">
```

## Component Patterns

### Hero Section
```tsx
<section className="relative gradient-agriculture text-primary-foreground py-20 md:py-32">
  {/* Decorative emojis */}
  <div className="absolute inset-0 opacity-10 pointer-events-none">
    <div className="absolute top-10 left-10 text-6xl">🌾</div>
  </div>
  
  {/* Content */}
  <div className="container relative z-10">
    {/* ... */}
  </div>
  
  {/* Wave divider */}
  <div className="absolute bottom-0 left-0 right-0">
    <svg viewBox="0 0 1440 120" className="w-full">
      <path d="..." className="fill-background"/>
    </svg>
  </div>
</section>
```

### Stat Card
```tsx
<div className="stat-card text-center">
  <div className="relative z-10">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div className="text-2xl font-bold text-primary mb-1">
      {value}
    </div>
    <div className="text-xs text-muted-foreground">
      {label}
    </div>
  </div>
</div>
```

### Feature Card
```tsx
<div className="bg-card rounded-xl shadow-sm border overflow-hidden card-hover">
  <div className="relative h-48 gradient-agriculture">
    {/* Image or icon */}
  </div>
  <div className="p-6">
    {/* Content */}
  </div>
</div>
```

### CTA Section
```tsx
<section className="py-16 bg-background">
  <div className="container">
    <div className="gradient-agriculture text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
      {/* Content */}
      <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
        Call to Action
      </Button>
    </div>
  </div>
</section>
```

## Icon Usage

### Common Icons (from lucide-react)
```tsx
import {
  Wheat,           // Agriculture/Logo
  TreeDeciduous,   // Nature/Forestry
  Building2,       // Departments/Buildings
  FlaskConical,    // Labs/Research
  Microscope,      // Science/Research
  Users,           // Staff/People
  Tractor,         // Farm Machinery
  MapPin,          // Location
  Mail, Phone,     // Contact
  BarChart3,       // Analytics
  Database,        // Data
  CheckCircle2,    // Success/Functional
  AlertCircle,     // Warning
  Wrench,          // Maintenance
} from 'lucide-react';
```

## Responsive Breakpoints

```tsx
// Mobile First Approach
className="text-base sm:text-lg md:text-xl lg:text-2xl"

// Grid Layouts
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"

// Spacing
className="px-4 sm:px-6 lg:px-8"
className="py-8 md:py-12 lg:py-16"

// Visibility
className="hidden md:block"    // Hide on mobile
className="md:hidden"          // Show only on mobile
```

## Button Variants

```tsx
// Primary (default)
<Button>Primary Action</Button>

// Secondary
<Button variant="secondary">Secondary Action</Button>

// Outline
<Button variant="outline">Outline Button</Button>

// Ghost
<Button variant="ghost">Ghost Button</Button>

// With Icon
<Button>
  Action
  <ArrowRight className="ml-2 h-5 w-5" />
</Button>
```

## Badge Variants

```tsx
// Default
<Badge>Label</Badge>

// Outline
<Badge variant="outline">Outline</Badge>

// Custom Colors
<Badge className="bg-secondary text-secondary-foreground">Gold</Badge>
<Badge className="bg-green-600 text-white">Functional</Badge>
<Badge className="bg-amber-500 text-white">Warning</Badge>
```

## Animation Timing

```css
/* Standard transitions */
transition-colors              /* 150ms */
transition-all duration-300    /* 300ms */
transition-transform duration-500  /* 500ms */

/* Hover delays */
hover:shadow-xl               /* Instant */
hover:-translate-y-1          /* Instant with duration-300 */
```

## Accessibility

### Color Contrast
- Primary text on background: 12.5:1 (AAA)
- Secondary text on background: 7.2:1 (AA)
- Primary button: 4.8:1 (AA)

### Focus States
All interactive elements have visible focus rings:
```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

## Dark Mode Support

The theme includes dark mode variants:
```css
.dark {
  --background: hsl(150, 30%, 8%);
  --foreground: hsl(60, 30%, 96%);
  --primary: hsl(142, 50%, 45%);
  /* ... other dark mode values */
}
```

To enable dark mode, add the `dark` class to the `<html>` element.
