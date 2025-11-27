# Implementation Plan

- [x] 1. Initialize project and configure development environment

  - Create Next.js 14 project with TypeScript and App Router
  - Install and configure Tailwind CSS with custom color (#134866)
  - Install shadcn/ui CLI and initialize with base components
  - Set up environment variables file structure (.env.local template)
  - Configure TypeScript with strict mode and path aliases
  - _Requirements: 10.2_

- [x] 2. Set up database and ORM

  - Install Prisma and initialize with MySQL provider
  - Create Prisma schema with User, Department, Equipment, and MaintenanceLog models
  - Define Role and EquipmentStatus enums
  - Add database indexes for performance optimization
  - Generate Prisma Client and create lib/prisma.ts singleton
  - Push schema to development database
  - _Requirements: 3.1, 4.1, 5.1, 7.1, 9.1_

- [x] 3. Configure authentication system

  - [x] 3.1 Install and configure NextAuth v5 (Auth.js)

    - Install next-auth@beta and required dependencies
    - Create auth.ts configuration file with Credentials provider
    - Implement password hashing with bcrypt
    - Configure JWT and session callbacks with role information
    - _Requirements: 2.1, 2.3_

  - [x] 3.2 Create authentication API routes and actions

    - Create app/api/auth/[...nextauth]/route.ts handler
    - Implement server action for user registration with validation
    - Create server action for credential verification
    - Add Zod schemas for login and signup validation
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Build authentication UI components
    - Create LoginForm component with React Hook Form
    - Create SignupForm component with department selection
    - Add form validation error displays
    - Implement loading states and error handling
    - Style forms with Tailwind CSS and shadcn/ui components
    - _Requirements: 2.1, 2.2_

- [x] 4. Implement middleware and route protection

  - Create middleware.ts with NextAuth token verification
  - Implement redirect logic for unauthenticated users
  - Add role-based route protection for admin routes
  - Create middleware matcher configuration for protected paths
  - Test middleware with different user roles and auth states
  - _Requirements: 2.4, 3.1, 3.2, 3.3, 3.4_

- [x] 5. Build public landing page

  - [x] 5.1 Create landing page layout and hero section

    - Create app/(public)/page.tsx with hero section
    - Implement responsive layout with Tailwind CSS
    - Add primary color (#134866) branding elements
    - Create navigation bar with Login/Signup buttons
    - _Requirements: 1.1, 1.3_

  - [x] 5.2 Add animations and interactive elements

    - Install and configure Framer Motion
    - Implement hero section entrance animations
    - Add scroll-triggered animations for About section
    - Optimize animations for 60fps performance
    - _Requirements: 1.2, 10.3_

  - [x] 5.3 Create About section and footer
    - Build AboutSection component with government-style content
    - Create large Footer component with multiple columns
    - Add government links and contact information
    - Ensure responsive design across all screen sizes
    - _Requirements: 1.4, 1.5, 10.1_

- [x] 6. Set up dashboard layout and navigation

  - Create app/dashboard/layout.tsx with sidebar and header
  - Build Sidebar component with role-based menu items
  - Create Header component with user profile and logout button
  - Implement responsive mobile drawer navigation
  - Add active route highlighting in navigation
  - _Requirements: 3.1, 3.2_

- [x] 7. Implement dashboard statistics and overview

  - [x] 7.1 Create server actions for dashboard data

    - Implement getDashboardStats server action with department filtering
    - Add Prisma queries for equipment counts by status
    - Create query for equipment distribution by type
    - Implement query for recent equipment additions
    - Add role-based data filtering (admin vs dept_head)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 7.2 Build dashboard overview page

    - Create app/dashboard/page.tsx with stats grid
    - Build StatsOverview component with metric cards
    - Add loading skeletons for data fetching states
    - Implement TanStack Query for data fetching and caching
    - Display role-appropriate data based on user permissions
    - _Requirements: 6.4, 6.5_

  - [x] 7.3 Create data visualization charts

    - Install and configure Recharts library
    - Build EquipmentStatusChart component with Pie Chart
    - Create EquipmentTypeChart component with Bar Chart
    - Add interactive tooltips and legends
    - Implement responsive chart sizing
    - Style charts with brand colors
    - _Requirements: 6.1, 6.2_

  - [x] 7.4 Build recent equipment table
    - Create RecentEquipmentTable component with TanStack Table
    - Add sortable columns for name, type, status, date
    - Implement status badges with color coding
    - Add pagination controls
    - Link table rows to equipment detail pages
    - _Requirements: 6.3_

- [x] 8. Implement equipment inventory management

  - [x] 8.1 Create equipment CRUD server actions

    - Implement createEquipment server action with validation
    - Create updateEquipment server action with authorization check
    - Build deleteEquipment server action with confirmation logic
    - Add Zod schemas for equipment form validation
    - Implement error handling and success responses
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 8.2 Build equipment form component

    - Create EquipmentForm component with React Hook Form
    - Add input fields for name, type, status, purchase date
    - Implement status dropdown with visual indicators
    - Add date picker component for purchase date
    - Integrate form with server actions
    - Display validation errors inline
    - _Requirements: 4.1, 4.2, 4.4, 5.1, 5.2_

  - [x] 8.3 Create equipment inventory page

    - Build app/dashboard/inventory/page.tsx
    - Create EquipmentTable component with full CRUD operations
    - Add filtering by status and type
    - Implement search functionality with debouncing
    - Add "Add Equipment" button with dialog
    - Include inline edit and delete actions
    - _Requirements: 4.1, 4.2, 4.3, 5.3_

  - [x] 8.4 Implement equipment detail page
    - Create app/dashboard/inventory/[id]/page.tsx
    - Display full equipment information
    - Show equipment image with fallback
    - Add edit and delete buttons
    - Include maintenance log section
    - _Requirements: 4.1, 4.2, 4.3, 7.2_

- [x] 9. Set up file storage and image uploads

  - [x] 9.1 Configure Supabase Storage

    - Create Supabase project and storage bucket
    - Configure bucket policies for authenticated uploads
    - Add Supabase client configuration in lib/supabase.ts
    - Set up environment variables for Supabase credentials
    - _Requirements: 4.5_

  - [x] 9.2 Create file upload API and utilities

    - Build POST /api/upload route for image uploads
    - Implement file type validation (images only)
    - Add file size validation (5MB max)
    - Create utility function for Supabase upload
    - Return public URL after successful upload
    - _Requirements: 4.5_

  - [x] 9.3 Add image upload to equipment form
    - Create ImageUpload component with drag-and-drop
    - Add image preview functionality
    - Integrate with /api/upload endpoint
    - Store returned URL in equipment record
    - Handle upload errors gracefully
    - _Requirements: 4.5_

- [x] 10. Implement maintenance log tracking

  - [x] 10.1 Create maintenance log server actions

    - Implement createMaintenanceLog server action
    - Build getMaintenanceLogs server action with equipment filtering
    - Add Zod schema for maintenance log validation
    - Implement date validation (no future dates)
    - Calculate total maintenance costs in query
    - _Requirements: 7.1, 7.3, 7.4, 7.5_

  - [x] 10.2 Build maintenance log UI components

    - Create MaintenanceLogList component
    - Build AddMaintenanceLogForm with date picker and cost input
    - Display logs chronologically with formatting
    - Show total maintenance cost summary
    - Add delete functionality for log entries
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 10.3 Integrate maintenance logs with equipment
    - Add maintenance log section to equipment detail page
    - Display maintenance history below equipment info
    - Add "Add Maintenance Log" button
    - Update equipment status when maintenance is logged
    - _Requirements: 7.2, 7.3_

- [x] 11. Implement bulk equipment import

  - [x] 11.1 Create file parsing utilities

    - Install PapaParse for CSV parsing
    - Install pdf-parse for PDF parsing
    - Create lib/file-parser.ts with parsing functions
    - Implement CSV to equipment data transformation
    - Add PDF text extraction and parsing logic
    - Handle parsing errors with row-level tracking
    - _Requirements: 8.1, 8.2_

  - [x] 11.2 Build bulk import server action

    - Create bulkImportEquipment server action
    - Accept FormData with file upload
    - Parse file based on type (CSV/PDF)
    - Validate each equipment record with Zod
    - Insert valid records into database
    - Return import results with error details
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 11.3 Create bulk import UI
    - Build BulkImportDialog component
    - Add file upload with drag-and-drop support
    - Display progress indicator during parsing
    - Show import results with success/failure counts
    - Display row-level errors in table format
    - Add download template functionality
    - _Requirements: 8.3, 8.4_

- [x] 12. Implement department management (Admin only)

  - [x] 12.1 Create department CRUD server actions

    - Implement createDepartment server action with admin check
    - Build updateDepartment server action
    - Create deleteDepartment with equipment check
    - Add Zod schemas for department validation
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 12.2 Build department management UI

    - Create app/dashboard/admin/departments/page.tsx
    - Build DepartmentTable component
    - Add DepartmentForm for create/edit operations
    - Implement logo upload functionality
    - Add delete confirmation dialog
    - Display equipment count per department
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 12.3 Add department assignment for users
    - Create user management page for admins
    - Add department dropdown to user forms
    - Implement user-to-department assignment
    - Display department info in user profile
    - _Requirements: 9.5_

- [x] 13. Implement data caching and optimization

  - Install and configure TanStack Query
  - Set up query client with 5-minute stale time
  - Implement query keys for equipment, departments, stats
  - Add optimistic updates for equipment mutations
  - Configure automatic refetching on window focus
  - _Requirements: 10.5_

- [x] 14. Add responsive design and mobile support

  - Test all pages on mobile, tablet, and desktop viewports
  - Implement mobile drawer navigation for dashboard
  - Optimize table layouts for small screens
  - Ensure forms are usable on mobile devices
  - Test touch interactions for all interactive elements
  - _Requirements: 10.1_

- [x] 15. Implement error handling and user feedback

  - Create toast notification system with shadcn/ui
  - Add error boundaries for component error catching
  - Implement loading states for all async operations
  - Add confirmation dialogs for destructive actions
  - Display user-friendly error messages
  - _Requirements: 2.2, 4.3, 5.4, 8.4_

- [x] 16. Add settings and user profile management

  - Create app/dashboard/settings/page.tsx
  - Build profile update form (name, email)
  - Implement password change functionality
  - Add department info display for dept_head users
  - Allow users to update their profile image
  - _Requirements: 2.5_

- [x] 17. Write integration tests for critical flows

  - Set up Vitest testing environment
  - Write tests for authentication flow
  - Test equipment CRUD operations with mocked Prisma
  - Test role-based access control in server actions
  - Test bulk import with sample CSV files
  - _Requirements: All_

- [ ] 18. Set up end-to-end testing

  - Install and configure Playwright
  - Write E2E test for admin creating department
  - Test department head login and equipment creation
  - Test bulk import workflow
  - Test dashboard analytics display
  - _Requirements: All_

- [ ] 19. Performance optimization and final polish

  - Run Lighthouse audit and address issues
  - Optimize images with next/image
  - Implement lazy loading for charts
  - Add loading skeletons for better perceived performance
  - Minimize JavaScript bundle size
  - Test animation performance (60fps target)
  - _Requirements: 10.3, 10.4_

- [ ] 20. Documentation and deployment preparation
  - Create README.md with setup instructions
  - Document environment variables
  - Add API documentation for server actions
  - Create database migration guide
  - Prepare production environment configuration
  - _Requirements: All_
